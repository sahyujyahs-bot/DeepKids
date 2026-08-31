// ============================================================
// DeepKids — Manual GPay/UPI QR Payment Verification Backend
// ============================================================
// This is a tiny "backend" for the website, built on Google
// Apps Script + a Google Sheet, since the site itself is static
// (no server). It lets the site:
//   1. Log an order the moment a customer says "I've Paid"
//   2. Email you a one-click "Confirm Payment" link
//   3. Let the customer's browser poll for confirmation, so the
//      website can show the confirmation page automatically once
//      you've checked your GPay and clicked Confirm.
//
// SETUP — install this INSIDE your existing "Escape Gravity Signups"
// Google Sheet (the one that already collects pre-order leads), so
// everything lives in one spreadsheet you already check:
// 1. Open that Google Sheet → Extensions → Apps Script.
// 2. You'll see whatsapp-auto-reply.gs already there. Add a NEW file
//    in the same project (File icon → + → Script) and paste this
//    whole file in. Don't delete the existing whatsapp-auto-reply code.
// 3. Run setupSheet() once (select it from the function dropdown,
//    then click ▶ Run). Authorize when asked. This adds a new tab
//    called "Orders" to your existing spreadsheet — separate from
//    the form-response tab, but in the same file.
// 4. Deploy → New deployment → type: "Web app".
//      - Execute as: Me
//      - Who has access: Anyone
//    Click Deploy, authorize again, and copy the Web App URL —
//    it looks like:
//    https://script.google.com/macros/s/AKfycb..../exec
// 5. Paste that URL into index.html where it says
//    MANUAL_PAYMENT_SCRIPT_URL = '...'
//
// Once set up, every "Payment Done" click creates a row in the
// "Orders" tab with status "Pending". The email you receive has a
// "Confirm Payment" link — clicking it sets that row's status to
// "Confirmed" and the customer's browser (which is quietly polling)
// auto-redirects them to the order-confirmed page within ~5 seconds.
// ============================================================

var SHEET_NAME = 'Orders';
var OWNER_EMAIL = 'sahyujyahs@gmail.com';

function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  sheet.getRange(1, 1, 1, 8).setValues([[
    'Order ID', 'Timestamp', 'Name', 'WhatsApp', 'Address', 'Amount', 'Status', 'Confirmed At'
  ]]);
  Logger.log('Sheet ready.');
}

function doGet(e) {
  var action = e.parameter.action;
  if (action === 'create') return handleCreate(e);
  if (action === 'status') return handleStatus(e);
  if (action === 'confirm') return handleConfirm(e);
  return ContentService.createTextOutput('Unknown action').setMimeType(ContentService.MimeType.TEXT);
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

function findRow_(sheet, orderId) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(orderId)) return i + 1; // 1-based row
  }
  return -1;
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// ?action=create&orderId=...&name=...&whatsapp=...&address=...&amount=...
function handleCreate(e) {
  var sheet = getSheet_();
  var orderId = e.parameter.orderId || '';
  if (!orderId) return jsonOut_({ ok: false, error: 'missing orderId' });

  var row = findRow_(sheet, orderId);
  var values = [
    orderId,
    new Date(),
    e.parameter.name || '',
    e.parameter.whatsapp || '',
    e.parameter.address || '',
    e.parameter.amount || '2499',
    'Pending',
    ''
  ];
  if (row === -1) {
    sheet.appendRow(values);
  } else {
    sheet.getRange(row, 1, 1, values.length).setValues([values]);
  }

  sendConfirmEmail_(orderId, e.parameter.name || '', e.parameter.whatsapp || '', e.parameter.address || '', e.parameter.amount || '2499');

  return jsonOut_({ ok: true, status: 'Pending' });
}

function sendConfirmEmail_(orderId, name, whatsapp, address, amount) {
  var confirmLink = ScriptApp.getService().getUrl() + '?action=confirm&orderId=' + encodeURIComponent(orderId);
  var subject = 'CHECK GPAY: Confirm Payment for Order ' + orderId;
  var htmlBody =
    '<div style="font-family:sans-serif;max-width:480px;">' +
    '<h2>New pre-order — verify payment</h2>' +
    '<table style="border-collapse:collapse;width:100%;">' +
    '<tr><td style="padding:4px 8px;color:#666;">Order ID</td><td style="padding:4px 8px;"><strong>' + orderId + '</strong></td></tr>' +
    '<tr><td style="padding:4px 8px;color:#666;">Name</td><td style="padding:4px 8px;">' + name + '</td></tr>' +
    '<tr><td style="padding:4px 8px;color:#666;">WhatsApp</td><td style="padding:4px 8px;">' + whatsapp + '</td></tr>' +
    '<tr><td style="padding:4px 8px;color:#666;">Address</td><td style="padding:4px 8px;">' + address + '</td></tr>' +
    '<tr><td style="padding:4px 8px;color:#666;">Amount</td><td style="padding:4px 8px;">₹' + amount + '</td></tr>' +
    '</table>' +
    '<p>Check your GPay/UPI app for a matching payment, then:</p>' +
    '<p><a href="' + confirmLink + '" style="display:inline-block;background:#c0e638;color:#0d0820;font-weight:bold;padding:12px 24px;border-radius:8px;text-decoration:none;">Confirm Payment Received</a></p>' +
    '<p style="font-size:12px;color:#999;">If the button doesn\'t work, copy this link: ' + confirmLink + '</p>' +
    '</div>';
  MailApp.sendEmail({
    to: OWNER_EMAIL,
    subject: subject,
    htmlBody: htmlBody
  });
}

// ?action=status&orderId=...
function handleStatus(e) {
  var sheet = getSheet_();
  var orderId = e.parameter.orderId || '';
  var row = findRow_(sheet, orderId);
  if (row === -1) return jsonOut_({ ok: false, status: 'Unknown' });
  var status = sheet.getRange(row, 7).getValue();
  return jsonOut_({ ok: true, status: status });
}

// ?action=confirm&orderId=...  (this is the link you click in the email)
function handleConfirm(e) {
  var sheet = getSheet_();
  var orderId = e.parameter.orderId || '';
  var row = findRow_(sheet, orderId);
  if (row === -1) {
    return ContentService.createTextOutput('Order not found: ' + orderId).setMimeType(ContentService.MimeType.TEXT);
  }
  sheet.getRange(row, 7).setValue('Confirmed');
  sheet.getRange(row, 8).setValue(new Date());
  var name = sheet.getRange(row, 3).getValue();

  var html = '<html><body style="font-family:sans-serif;text-align:center;padding:60px 20px;background:#0d0820;color:#fff;">' +
    '<h1 style="color:#c0e638;">Payment Confirmed ✓</h1>' +
    '<p>Order <strong>' + orderId + '</strong> for <strong>' + name + '</strong> has been marked as paid.</p>' +
    '<p>The customer\'s browser will now automatically show their confirmation page.</p>' +
    '</body></html>';
  return HtmlService.createHtmlOutput(html);
}
