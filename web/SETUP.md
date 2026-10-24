# DeepKids website: setup

The website is the same app as the claude.ai artifact. Instead of claude.ai it uses:

| Need | Service | Cost for 20–100 families |
|---|---|---|
| The app at app.deepkids.in (your existing deepkids.in site stays as it is) | Cloudflare Pages | Free |
| Sign-in | Google, through Supabase Auth | Free |
| Each family's data | Supabase database (private per family) | Free tier (500 MB) |
| Photos and files | Supabase Storage (private per family, photos shrunk to ~250 KB) | Free up to 1 GB |
| Claude | A Supabase Edge Function holding your Claude API key | Function free; Claude about $2 per active family a month on Opus 5.5, used only by DeepKids Plus families |
| DeepKids Plus payments | Razorpay (your existing account), through a second Edge Function | Razorpay's usual fee per payment; no monthly cost |

Lesson plans, chapters, worksheets and resources are files published with the website (`web/public/data.js`), built from this repo.

Do the steps in order. Each takes 5–15 minutes. Keep a note of the values marked **Copy**.

---

## 1. Supabase project

1. Go to supabase.com, sign up (GitHub or Google), and click **New project**.
2. Name: `deepkids`. Make a strong database password and save it in your password manager. Region: **South Asia (Mumbai)**. Plan: **Free**.
3. When it's ready, open **Project Settings → API** (or **API Keys**). **Copy**:
   - **Project URL**, like `https://abcdefghijkl.supabase.co`
   - **anon public** key (or the **publishable** key). This one is meant to be public.
   - Never copy the `service_role` / secret key anywhere. The server function gets it automatically.
4. Open **SQL Editor → New query**. Paste all of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**. You should see "Success. No rows returned".

## 2. Google sign-in

1. Go to console.cloud.google.com and create a project called **DeepKids**.
2. Open **Google Auth Platform** (or **APIs & Services → OAuth consent screen**):
   - App name **DeepKids**, your support email, user type **External**.
   - Under **Branding**, add the authorised domain `deepkids.in`.
   - Under **Audience**, leave it in **Testing** for now and add the Gmail addresses of the families you invite (up to 100). This doubles as your invite list. Later, click **Publish app**. DeepKids asks only for name and email, which doesn't need Google's review.
3. **Clients → Create client → Web application**:
   - Authorised JavaScript origins: `https://app.deepkids.in`
   - Authorised redirect URIs: `https://<your-project>.supabase.co/auth/v1/callback`, using your Project URL from step 1.3
   - **Copy** the **Client ID** and **Client secret**.
4. Back in Supabase, open **Authentication → Sign In / Providers → Google**. Turn it on, paste the Client ID and secret, and **Save**.
5. Open **Authentication → URL Configuration**:
   - Site URL: `https://app.deepkids.in`
   - Redirect URLs: add `https://app.deepkids.in/**`

## 3. Claude API key

1. Go to console.anthropic.com (platform.claude.com) and sign up as an organisation, e.g. "DeepKids". This is separate from a claude.ai subscription, which can't be used by a website.
2. **API Keys → Create key**, named `deepkids-website`. **Copy** it now; it's shown once. Creating the key is free.
3. **Billing**: Claude only answers once the account has prepaid credit (the smallest top-up is $5). You can do this later, when the first family buys Plus; until then the app simply shows the Plus messages. When you add credit, set a **monthly spend limit**, e.g. $20, so costs can't surprise you.

## 4. The Claude server function

1. In Supabase open **Edge Functions → Deploy a new function → Via Editor**.
2. Name it exactly `claude`. Replace the sample code with all of [`supabase/functions/claude/index.ts`](supabase/functions/claude/index.ts) and click **Deploy**.
3. Keep **Enforce JWT verification** on, so only signed-in parents can use it.
4. Open **Edge Functions → Secrets** and add:
   - `ANTHROPIC_API_KEY` = the key from step 3
   - Optional: `DAILY_CALLS` = `80` (each family's daily cap on Claude uses)
   - Claude only works for families with DeepKids Plus. To let everyone use it instead, add `REQUIRE_PLUS` = `false` and set `ai: true` in `public/config.js`.
   - Optional: `INVITE_ONLY` = `true` to allow only emails in the `invites` table (Table Editor → invites → Insert row)

If you prefer the command line: `npx supabase login`, `npx supabase link --project-ref <ref>`, `npx supabase functions deploy claude --project-ref <ref>`, `npx supabase secrets set ANTHROPIC_API_KEY=...`

## 4b. DeepKids Plus with Razorpay

Do this in **Test Mode** first: test payments use test cards and UPI, and no money moves.

1. **Database:** Supabase → SQL Editor → New query. Paste the part of [`supabase/schema.sql`](supabase/schema.sql) from `-- 8. DeepKids Plus` to the end, and **Run**.
2. **Razorpay keys:** in the Razorpay Dashboard, switch to **Test Mode** (toggle at the top), then **Account & Settings → API Keys → Generate Key**. Keep the Key Secret private; don't paste it into chat.
3. **The payment function:** Supabase → **Edge Functions → Deploy a new function → Via Editor**, name it exactly `plus`, paste all of [`supabase/functions/plus/index.ts`](supabase/functions/plus/index.ts), and **Deploy**. In the function's **Details / Settings**, turn **Enforce JWT verification OFF**. The function checks the sign-in itself, and Razorpay's webhook can't send one.
4. **Secrets** (Edge Functions → Secrets):
   - `RAZORPAY_KEY_ID` = the Key Id (starts `rzp_test_`)
   - `RAZORPAY_KEY_SECRET` = the Key Secret
   - `PLUS_PRICES` = your prices in rupees, e.g. `[{"months":1,"inr":199},{"months":12,"inr":1999}]`. Change it any time; no code change is needed.
5. **Webhook (recommended):** this counts a payment even if the parent closes the page mid-way. Razorpay → **Account & Settings → Webhooks → Add New Webhook**:
   - URL: `https://<your-project>.supabase.co/functions/v1/plus`
   - Secret: make up a long password
   - Events: `payment.captured` and `order.paid`
   - Then add the same secret in Supabase as `RAZORPAY_WEBHOOK_SECRET`.
6. **Give yourself Plus** for testing Claude without paying. In the SQL Editor, using your sign-in email:
   ```sql
   insert into public.plans (user_id, valid_until)
   select id, '2099-01-01' from auth.users where email = 'you@gmail.com'
   on conflict (user_id) do update set valid_until = excluded.valid_until;
   ```
   Add other test families the same way. `select * from public.plans;` shows who has Plus until when.
7. **Try a test payment:** sign in with another Google account, tap a 🔒 button, then **Upgrade to Plus**. Pay with card `4111 1111 1111 1111` (any future date, any CVV), or UPI `success@razorpay`. Plus switches on straight away.
8. **Going live:** in Razorpay switch to **Live Mode**, generate live keys (`rzp_live_`), and replace the two key secrets in Supabase. Add the webhook again in Live Mode. Razorpay must have activated your account for live payments (yours already takes payments on deepkids.in).

## 5. Connect the website code

1. Edit [`public/config.js`](public/config.js) and fill in `supabaseUrl` and `supabaseAnonKey` from step 1.3.
2. Commit and push. (Or tell Claude in this project the two values and it will do it.)

## 6. Cloudflare Pages and app.deepkids.in

1. Log in at dash.cloudflare.com. If **deepkids.in** is listed under **Websites** (or **Domains**), its DNS is on Cloudflare. If it isn't, see "Domain not on Cloudflare" below.
2. **Workers & Pages → Create → Pages → Connect to Git**. Allow Cloudflare to read the GitHub repo `deepkids`, then choose it.
3. Build settings:
   - Production branch: the branch with the website. For now that's `claude/homeschooling-app-india-83y794`; later, merge it into `main` and pick `main`.
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: `web/public`
4. Click **Save and Deploy**. You get a test address like `deepkids.pages.dev`.
5. In the Pages project, **Custom domains → Set up a custom domain**: add `app.deepkids.in` only. Cloudflare creates the DNS record. Don't add `deepkids.in` or `www.deepkids.in`; those are your existing website.
6. Open https://app.deepkids.in, tap **Continue with Google**, and sign in with an email on your test list.

**Domain not on Cloudflare:** don't move the whole domain (that could disturb your existing site and email). In the Pages project's **Custom domains**, add `app.deepkids.in`; Cloudflare then shows a CNAME record to create. At the company that manages deepkids.in's DNS (GoDaddy, Hostinger, etc.), add a **CNAME** record with name `app` and value your `….pages.dev` address. It usually works within an hour.

## 7. Bring your family's data across

1. In the claude.ai artifact: **Settings → Your data → Save a copy**. This makes a .zip with everything, including photos.
2. On app.deepkids.in, sign in and finish the short phone-and-name step. Then **Settings → Your data → Bring in a copy**, and pick that .zip.

## 8. Install on a phone

- **Android (Chrome):** open app.deepkids.in, then menu ⋮ → **Add to Home screen** (or **Install app**).
- **iPhone (Safari):** open app.deepkids.in, then Share → **Add to Home Screen**.

---

## Looking after it

- **Who's using it, and Claude use:** Supabase → SQL Editor → `select * from admin_families;`
- **Plus families and payments:** `select * from public.plans;` and `select * from public.payments order by created_at desc;`. Razorpay's dashboard has the same payments.
- **Claude spend:** console.anthropic.com → **Usage**.
- **Free-tier limits to watch:**
  - Storage over 1 GB: add Cloudflare R2, free to 10 GB.
  - A free Supabase project pauses after 7 days with no use. Any family opening the app keeps it awake.
- **Updating the app:** Claude rebuilds `web/public` with `python3 web/build_web.py` after app changes. Pushing to the branch redeploys automatically.
- **Testing locally:** `python3 web/build_web.py && node web/tests/test_web.js && node web/tests/test_plus.js` runs the whole site, including a stubbed Plus payment, against a fake backend.

## What isn't on the website yet

- **Live Google Calendar linking.** The calendar file import and the calendar reminders work.
- **Phone notifications when the app is closed.** These need push messages; the calendar reminders cover this for now.
- **Phone-number sign-in by SMS.** This needs a paid SMS provider; Google sign-in is used instead.

## Editing any text in the app (owner only)

1. **Database (once):** Supabase → SQL Editor → New query. Paste the part of [`supabase/schema.sql`](supabase/schema.sql) from `-- ---------- content edits` to the end, and **Run**.
2. **Make yourself an editor:** in a new query, run this with the Google email you sign in with:
   `insert into public.editors (email) values ('your-email@gmail.com');`
3. Reload the app. A **✏️** button appears at the bottom left, and in the top bar of every lesson. Tap it to start editing, tap any text, rewrite it and **Save**. The new text replaces that exact text everywhere it appears, for every family, straight away. **Back to original** undoes an edit. Tap **✓ Done editing** to use the app normally again.
4. **To keep edits in the source files** as well, open any text in edit mode, tap **All my edits · download**, and add the file to the repository (or send it to Claude). Then run `python3 app/build/apply_edits.py deepkids-text-edits.json`, which writes the edits into the content files.
