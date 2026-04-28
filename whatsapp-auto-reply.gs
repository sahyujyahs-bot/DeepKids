// ============================================================
// DeepKids — Auto WhatsApp Welcome Message on Signup
// ============================================================
// Paste this into Google Apps Script (Extensions → Apps Script)
// in your Google Sheet that collects form responses.
//
// Setup:
// 1. Paste this code
// 2. Run setupTrigger() once (from the menu Run → setupTrigger)
// 3. Authorize when prompted
// 4. Done — messages will auto-send on every new form submission
// ============================================================

var CONFIG = {
  // WhatsApp Cloud API credentials
  PHONE_NUMBER_ID: '99835523371120',
  ACCESS_TOKEN: 'EAA9YUZAwXwegBReMIyaLZCXmiHscZBqVKngFyDDPDQswtdud05ydiTNoABuje5ZBTuvvJxTfhpW1Uiy2mAb3hw9sEGtjHy73v2FL1EyFmGwj4BiHNC3NWosvF9GeUyff9BruUANYEIs1qJLDpDHZANcOGTiYfjqpNLRarNfBuiqh8zzMRmzwsuaheCZCzftIQMb6l8Yi7U1uZA2tJZBrHO2FZBv4yfLcRdSH3DhXRtSs7v9L5B75QnhvOpkFaKZBEZAKbNz5xPWnnFsGWHTGFBiJpId',

  // Template name — use 'hello_world' for testing, switch to
  // 'welcome_signup' once that template is approved
  TEMPLATE_NAME: 'hello_world',
  TEMPLATE_LANGUAGE: 'en_US',

  // Sheet column indices (1-based) — adjust if your columns differ
  // Default Google Form creates: Timestamp | Name | WhatsApp | Type
  COL_TIMESTAMP: 1,
  COL_NAME: 2,
  COL_WHATSAPP: 3,
  COL_TYPE: 4,
  COL_WA_STATUS: 5  // We'll add this column to track send status
};

/**
 * Run this ONCE to set up the auto-trigger.
 * Go to Run → setupTrigger in the Apps Script editor.
 */
function setupTrigger() {
  // Remove existing triggers to avoid duplicates
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(t) {
    if (t.getHandlerFunction() === 'onFormSubmit') {
      ScriptApp.deleteTrigger(t);
    }
  });

  // Create new trigger on form submit
  ScriptApp.newTrigger('onFormSubmit')
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onFormSubmit()
    .create();

  Logger.log('Trigger set up successfully! New form submissions will auto-send WhatsApp messages.');

  // Add "WA Status" header if missing
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var header = sheet.getRange(1, CONFIG.COL_WA_STATUS).getValue();
  if (!header || header === '') {
    sheet.getRange(1, CONFIG.COL_WA_STATUS).setValue('WA Status');
  }
}

/**
 * Triggered automatically on every form submission.
 */
function onFormSubmit(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var row = e.range.getRow();

    var name = sheet.getRange(row, CONFIG.COL_NAME).getValue();
    var phone = sheet.getRange(row, CONFIG.COL_WHATSAPP).getValue();
    var type = sheet.getRange(row, CONFIG.COL_TYPE).getValue();

    if (!phone) {
      sheet.getRange(row, CONFIG.COL_WA_STATUS).setValue('No phone');
      return;
    }

    // Clean phone number — ensure it starts with country code, no spaces/dashes
    phone = String(phone).replace(/[\s\-\(\)]/g, '');
    if (phone.startsWith('+')) phone = phone.substring(1);

    // Send WhatsApp message
    var result = sendWhatsAppMessage(phone, name);

    // Log status
    var status = result.success ? 'Sent ✓' : 'Failed: ' + result.error;
    sheet.getRange(row, CONFIG.COL_WA_STATUS).setValue(status);

    Logger.log('Row ' + row + ': ' + name + ' (' + phone + ') — ' + status);

  } catch (err) {
    Logger.log('Error in onFormSubmit: ' + err.toString());
    if (e && e.range) {
      SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
        .getRange(e.range.getRow(), CONFIG.COL_WA_STATUS)
        .setValue('Error: ' + err.message);
    }
  }
}

/**
 * Send a WhatsApp template message via the Cloud API.
 */
function sendWhatsAppMessage(phone, name) {
  var url = 'https://graph.facebook.com/v25.0/' + CONFIG.PHONE_NUMBER_ID + '/messages';

  var payload;

  if (CONFIG.TEMPLATE_NAME === 'hello_world') {
    // hello_world has no parameters
    payload = {
      messaging_product: 'whatsapp',
      to: phone,
      type: 'template',
      template: {
        name: 'hello_world',
        language: { code: 'en_US' }
      }
    };
  } else {
    // welcome_signup with name parameter
    payload = {
      messaging_product: 'whatsapp',
      to: phone,
      type: 'template',
      template: {
        name: CONFIG.TEMPLATE_NAME,
        language: { code: CONFIG.TEMPLATE_LANGUAGE },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: name || 'there' }
            ]
          }
        ]
      }
    };
  }

  var options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + CONFIG.ACCESS_TOKEN
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    var code = response.getResponseCode();
    var body = JSON.parse(response.getContentText());

    if (code === 200) {
      return { success: true, messageId: body.messages[0].id };
    } else {
      var errMsg = body.error ? body.error.message : 'HTTP ' + code;
      return { success: false, error: errMsg };
    }
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * Manual test — send a message to a specific number.
 * Change the number and run this function to test.
 */
function testSend() {
  var result = sendWhatsAppMessage('918531033180', 'Test User');
  Logger.log(JSON.stringify(result));
}

/**
 * Batch send to all rows that haven't been sent yet.
 * Useful for catching up on signups that happened before
 * the trigger was set up.
 */
function sendToAllPending() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();

  for (var row = 2; row <= lastRow; row++) {
    var status = sheet.getRange(row, CONFIG.COL_WA_STATUS).getValue();
    if (status && status.toString().indexOf('Sent') >= 0) continue;

    var name = sheet.getRange(row, CONFIG.COL_NAME).getValue();
    var phone = sheet.getRange(row, CONFIG.COL_WHATSAPP).getValue();

    if (!phone) {
      sheet.getRange(row, CONFIG.COL_WA_STATUS).setValue('No phone');
      continue;
    }

    phone = String(phone).replace(/[\s\-\(\)]/g, '');
    if (phone.startsWith('+')) phone = phone.substring(1);

    var result = sendWhatsAppMessage(phone, name);
    var statusText = result.success ? 'Sent ✓' : 'Failed: ' + result.error;
    sheet.getRange(row, CONFIG.COL_WA_STATUS).setValue(statusText);

    Logger.log('Row ' + row + ': ' + name + ' — ' + statusText);

    // Rate limit: wait 1 second between messages
    Utilities.sleep(1000);
  }
}
