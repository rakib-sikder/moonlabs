# Client portal setup (Cloudflare)

The client portal lives at `/login` and `/dashboard`. Clients sign in with email and password
(or Google, if you turn it on) and see their projects, automations, requests, files and
invoices. Moonlab staff manage everything from `/dashboard/admin`.

Everything runs on Cloudflare, inside the same Worker as the website:

| Piece | What it uses |
| --- | --- |
| Data | D1 database `moonlabs-portal` (binding `DB`), schema in `migrations/` |
| Sign-in | Our own code: PBKDF2 password hashes, session cookies, invite and reset links |
| Files | Optional R2 bucket (binding `FILES`). Without it, deliverables are shared as links |
| Google sign-in | Optional, only when `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set |

If the `DB` binding is missing, `/login` and `/dashboard` show "Client portal not configured
yet" and the rest of the site works normally.

---

## How sign-in works

- **Passwords** are hashed with PBKDF2-SHA256 (100,000 iterations, the Workers maximum, with a
  random salt per user) and stored as `pbkdf2$<iterations>$<salt>$<hash>`.
- **Sessions**: signing in sets an httpOnly, SameSite=Lax cookie (`ml_session`, Secure on
  https) holding a random 32-byte token. The database stores only its SHA-256 hash. Sessions
  last 30 days and are extended while the person keeps using the portal. Sign out deletes the
  session.
- **Rate limiting**: 5 failed passwords per email and IP address (and 30 per IP address)
  within 15 minutes blocks further attempts for that window.
- **Sign-up**: anyone can create an account at `/signup` (or with Google / Facebook). Email
  sign-ups are held in `signup_requests` until the emailed link is confirmed. Every new
  account gets its own workspace and a client membership. Admin invites still work.
- **Forgot password** emails a one-time reset link (24 hours).
- **Who can see what** is checked in code (`lib/portal/access.ts`) on every page, action and
  download:

| | Client | Org admin | Staff |
| --- | --- | --- | --- |
| See their organization's projects, automations, runs, files, invoices | yes | yes | all orgs |
| See draft invoices | no | yes | yes |
| Open requests, comment on requests (as themselves) | yes | yes | yes |
| Change request status, edit everything else, add files | no | yes | yes |
| Invite people, create reset links | no | own org | all orgs |
| Create organizations, make someone staff | no | no | yes |

An org admin can create a password reset link only for people who are not staff and whose
organizations they all administer.

---

## 1. Apply the database migrations

The database already exists (`moonlabs-portal`, bound as `DB` in `wrangler.jsonc`).

```bash
npx wrangler d1 migrations apply moonlabs-portal --remote
```

Run this again whenever a new file appears in `migrations/`. It only applies new ones.
`migrations/` never contains demo data.

## 2. Deploy

```bash
npm run deploy:cf
```

This builds the site with OpenNext and deploys the Worker to
`https://moonlab.space`.

## 3. Create the first admin

```bash
node scripts/portal-create-admin.mjs you@example.com
```

It adds a one-time staff invite to the production database and prints a link like
`https://moonlab.space/invite/...`. Open it (valid 7 days, works once), set
your name and a password, and you are signed in as Moonlab staff with access to every
organization.

Options: `--base https://your-domain.com` to print a link for a custom domain, `--local` to
write to the local database used by `wrangler dev`. The link cannot be shown again (only its
hash is stored); if you lose it, run the script again.

## 4. Invite a client

1. `/dashboard/admin` > **New organization**: the client's company name and plan.
2. Open the organization > **Settings & people** > **Invite someone**: their email and role
   (**Client**, or **Admin (Moonlab)** for a teammate who should manage only this client).
   Staff also see "Also make them Moonlab staff".
3. Click **Create invite link**, then **Copy link** and send it to them yourself (email,
   WhatsApp, Slack). It is valid for 7 days, works once, and is not shown again. Creating a
   new invite for the same email replaces the old link. Pending invites are listed under the
   form and can be revoked.
4. They open the link, enter their name and a password, and land in their dashboard. If they
   already have an account (for example with another client), they confirm their existing
   password instead and the new organization is added.
5. Fill in their workspace from the admin tabs: projects (the five stages are created for
   you), milestones and updates, automations and run logs, files, invoices.

## 5. Reset a password

No emails are sent yet, so the "Forgot password?" page tells people to ask their Moonlab
contact.

1. Open the organization > **Settings & people** > **Reset a password**.
2. Pick the person, click **Create reset link**, then **Copy link** and send it to them.
3. They open it (valid 24 hours, works once) and choose a new password. All their other
   sessions are signed out.

## 6. Files (deliverables)

**Without R2 (now):** Admin > Files > **Share a link**: a name and an `https://` link (Google
Drive, Dropbox, Loom and so on). Clients see it under Files with an **Open** button.

**With R2 (later):** uploads up to 50 MB go to a private R2 bucket and downloads go through
`/dashboard/files/<id>/download`, which checks that the person belongs to the file's
organization and streams the file back as an attachment.

To turn R2 on:

1. In the Cloudflare dashboard open **R2 Object Storage** and click **Get started** (R2 must be
   enabled on the account once).
2. `npx wrangler r2 bucket create moonlabs-portal-files`
3. In `wrangler.jsonc`, uncomment the `r2_buckets` block (binding `FILES`).
4. `npm run cf-typegen` (refreshes `cloudflare-env.d.ts`), then `npm run deploy:cf`.

Admin > Files then shows **Upload a deliverable** next to **Share a link**.

## 7. Plan orders (Payoneer)

1. A client picks a plan on Billing. That creates an open invoice and a pending plan order,
   and emails you and the client.
2. In Payoneer, create a payment request for the invoice amount and copy its link.
3. Admin > the organization > Invoices > **Payment links**: paste it, keep "Email the link to
   the client" ticked, **Save link**. The client sees **Pay now** on Billing.
4. When the money arrives, set that invoice to **Paid**. The plan switches on and the client
   is emailed. Setting it to **Void** cancels the order.

### Project briefs

1. A client opens Projects > **Start a new project** and describes it in their own words
   (goal, users, features, examples, budget, deadline). You get an email with the whole brief;
   the client gets a receipt. At most 5 briefs per organization can wait at once.
2. Admin > the organization > Projects lists **Client briefs**. Open one, then either
   **Start project** (creates the project with its five stages and links the brief) or
   **Decline brief** with a reason. Either way the client's members are emailed.
3. The brief text is never edited. It shows on the project page for you and the client.
   The client can withdraw a brief until you answer it.

### Client approvals (gates)

1. On the admin project page, **Client approvals**: pick Spec, Mockup or Release, give a title,
   a link to the work and what to check, then **Send for approval**. Client members (role
   client, not staff) are emailed. One of each kind can wait at a time; **Withdraw** it to
   replace it.
2. The client sees it at the top of the project page, on Overview and on Projects. They
   **Approve**, or **Request changes** with a reason. You are emailed either way.
3. Spec unlocks Design, Mockup unlocks Build, Release unlocks Live. While the newest gate of a
   kind is waiting or has changes requested, that stage cannot be set to In progress or Done.
   Approving marks the stage before it Done and starts it. After "changes requested", send a
   new version as a new approval; every decision stays on record.
4. Staff cannot approve for the client. A project with no gates works as before.

## 8. Optional: Facebook sign-in

The button is hidden until both secrets are set.

1. <https://developers.facebook.com/apps> > **Create app** > use case "Authenticate and request
   data from users with Facebook Login".
2. **Facebook Login > Settings**: Valid OAuth Redirect URIs
   `https://moonlab.space/auth/facebook/callback`.
3. **App settings > Basic**: Privacy Policy URL `https://moonlab.space/privacy`, a data
   deletion instructions URL, category, icon. Then switch the app to **Live**.
4. Copy the App ID and App secret:

   ```bash
   npx wrangler secret put FACEBOOK_APP_ID
   npx wrangler secret put FACEBOOK_APP_SECRET
   ```

Accounts without an email on Facebook (phone-only) are sent back to sign in another way.

## 9. Optional: Google sign-in

A verified Google address signs in to its account or creates one with its own workspace. The
button is hidden until both secrets are set.

1. Go to <https://console.cloud.google.com/>, pick or create a project.
2. **APIs & Services > OAuth consent screen**: app name "Moonlab", your support email, user
   type External. Scopes: `openid`, `email`, `profile` (the defaults). Publish the app.
3. **APIs & Services > Credentials > Create credentials > OAuth client ID**:
   - Application type: **Web application**
   - Authorized redirect URI: `https://moonlab.space/auth/google/callback`
     (add one per domain if you use a custom domain, e.g.
     `https://your-domain.com/auth/google/callback`)
4. Copy the Client ID and Client secret, then:

   ```bash
   npx wrangler secret put GOOGLE_CLIENT_ID
   npx wrangler secret put GOOGLE_CLIENT_SECRET
   ```

   Secrets take effect immediately; no redeploy needed. For local `wrangler dev`, put the
   same two values in `.dev.vars` (git-ignored) and add
   `http://localhost:8787/auth/google/callback` (or your local port) as another redirect URI.

To turn it off again: `npx wrangler secret delete GOOGLE_CLIENT_ID`.

---

## Local testing with demo data

```bash
npx wrangler d1 migrations apply moonlabs-portal --local
npx wrangler d1 execute moonlabs-portal --local --file=scripts/portal-seed-local.sql
node scripts/portal-create-admin.mjs admin@example.com --local --base http://localhost:8787

npx opennextjs-cloudflare build
npx wrangler dev
```

Open the printed invite link to create a local staff account. The seed adds two fake client
organizations and two invites with fixed tokens (local only):
`/invite/local-demo-client-invite-0001` (Demo Bakery) and
`/invite/local-demo-florist-invite-0001` (Demo Florist). Never run the seed with `--remote`.

`npm run dev` (next dev) also works: `next.config.ts` calls `initOpenNextCloudflareForDev()`,
which gives the app the same local D1 database.

## Troubleshooting

- **"Client portal not configured yet"**: the `DB` binding is missing from `wrangler.jsonc`, or
  the Worker was deployed without it. Check the binding and redeploy.
- **Errors like "no such table"**: the migrations were not applied to that database. Run
  step 1 (`--remote` for production, `--local` for wrangler dev).
- **Invite link says it does not work**: it was used, revoked, replaced by a newer invite, or
  is older than 7 days. Create a new one.
- **"Too many failed attempts"**: wait 15 minutes, or create a reset link for the person.
- **Signed in but no workspace**: the person has an account but no membership. Invite them to
  the organization (they confirm their password to accept).
- **Google returns to /login with an error**: check the redirect URI in Google Cloud matches
  the address exactly, and that the person has an account or open invite for that email.
