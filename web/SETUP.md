# DeepKids website: setup

The website is the same app as the claude.ai artifact. Instead of claude.ai it uses:

| Need | Service | Cost for 20–100 families |
|---|---|---|
| The app at app.deepkids.in (your existing deepkids.in site stays as it is) | Cloudflare Pages | Free |
| Sign-in | Google, through Supabase Auth | Free |
| Each family's data | Supabase database (private per family) | Free tier (500 MB) |
| Photos and files | Supabase Storage (private per family, photos shrunk to ~250 KB) | Free up to 1 GB |
| Claude | A Supabase Edge Function holding your Claude API key | Function free; Claude about $2 per active family a month on Opus 5.5 |

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

1. Go to console.anthropic.com and sign up as an organisation, e.g. "DeepKids".
2. **Billing**: add a card and buy starting credit ($5–10 is plenty to begin). Set a **monthly spend limit**, e.g. $20, so costs can't surprise you.
3. **API Keys → Create key**, named `deepkids-website`. **Copy** it now; it's shown once.

## 4. The Claude server function

1. In Supabase open **Edge Functions → Deploy a new function → Via Editor**.
2. Name it exactly `claude`. Replace the sample code with all of [`supabase/functions/claude/index.ts`](supabase/functions/claude/index.ts) and click **Deploy**.
3. Keep **Enforce JWT verification** on, so only signed-in parents can use it.
4. Open **Edge Functions → Secrets** and add:
   - `ANTHROPIC_API_KEY` = the key from step 3
   - Optional: `DAILY_CALLS` = `80` (each family's daily cap on Claude uses)
   - Optional: `INVITE_ONLY` = `true` to allow only emails in the `invites` table (Table Editor → invites → Insert row)

If you prefer the command line: `npx supabase login`, `npx supabase link --project-ref <ref>`, `npx supabase functions deploy claude --project-ref <ref>`, `npx supabase secrets set ANTHROPIC_API_KEY=...`

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
- **Claude spend:** console.anthropic.com → **Usage**.
- **Free-tier limits to watch:**
  - Storage over 1 GB: add Cloudflare R2, free to 10 GB.
  - A free Supabase project pauses after 7 days with no use. Any family opening the app keeps it awake.
- **Updating the app:** Claude rebuilds `web/public` with `python3 web/build_web.py` after app changes. Pushing to the branch redeploys automatically.
- **Testing locally:** `python3 web/build_web.py && node web/tests/test_web.js` runs the whole site against a fake backend.

## What isn't on the website yet

- **Live Google Calendar linking.** The calendar file import and the calendar reminders work.
- **Phone notifications when the app is closed.** These need push messages; the calendar reminders cover this for now.
- **Phone-number sign-in by SMS.** This needs a paid SMS provider; Google sign-in is used instead.
