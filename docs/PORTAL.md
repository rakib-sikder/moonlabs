# Client portal setup

The client portal lives at `/login` and `/dashboard`. Clients sign in with an email link or
Google and see their projects, automations, requests, files and invoices. Moonlabs staff
manage everything from `/dashboard/admin`.

It runs on [Supabase](https://supabase.com) (database, sign-in and file storage). Until the
two environment variables below are set, `/login` and `/dashboard` show "Client portal not
configured yet" and the rest of the site works normally.

The app only ever uses the public **anon** key. Who can see and change what is enforced in
the database by row-level security (RLS), so you never need the service-role key in this
project. Do not add it.

---

## 1. Create the Supabase project

1. Sign in at <https://supabase.com/dashboard> and click **New project**.
2. Pick a name (e.g. `moonlabs-portal`), a strong database password (save it in your password
   manager), and the region closest to your clients.
3. Wait for it to finish provisioning (about two minutes).

## 2. Run the migration

1. In the project, open **SQL Editor** > **New query**.
2. Paste the whole of `supabase/migrations/0001_portal.sql` and click **Run**.
   It creates the tables, the security rules, and a private storage bucket called
   `deliverables`.
3. Do **not** run `supabase/seed.sql` on this project. It is fake demo data for local testing
   only (see "Local testing" below).

If you use the Supabase CLI instead: `supabase link --project-ref <ref>` then `supabase db push`.

## 3. Turn on sign-in methods

### Email links (on by default)

**Authentication > Sign In / Providers > Email**: make sure Email is enabled.

Recommended: make email links work on any device (the default link only works in the same
browser that requested it). Go to **Authentication > Emails > Templates > Magic Link** and
replace the link in the template with:

```html
<a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email">Sign in to Moonlabs</a>
```

Do the same in the **Confirm signup** template (first sign-in of a new address) using
`type=email` as well. The callback route handles both link styles.

The built-in email sender is rate-limited (a few emails per hour) and meant for testing.
Before real clients use it, set up your own SMTP under **Authentication > Emails > SMTP
Settings** (Resend, Postmark, SES, etc.).

### Google

1. In Google Cloud Console, create a project (or use an existing one) and open
   **APIs & Services > Credentials > Create credentials > OAuth client ID**.
   - Application type: **Web application**.
   - Authorised redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`
     (copy the exact value from Supabase: **Authentication > Sign In / Providers > Google**).
   - Configure the OAuth consent screen (app name "Moonlabs", your support email).
2. Copy the Client ID and Client Secret into **Supabase > Authentication > Sign In /
   Providers > Google**, enable it, and save.

## 4. Set the redirect URLs

**Authentication > URL Configuration**:

- **Site URL**: your production address, e.g. `https://moonlabs.vercel.app` (or your custom
  domain).
- **Redirect URLs** (add each):
  - `https://moonlabs.vercel.app/auth/callback`
  - `https://*-<your-vercel-team>.vercel.app/auth/callback` (Vercel preview deploys, optional)
  - `http://localhost:3000/auth/callback` (local development)

If you later move to a custom domain, add its `/auth/callback` here and update Site URL.

## 5. Set the environment variables

Find both values in **Project Settings > API** (or **Connect** > App frameworks):

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL, e.g. `https://abcd1234.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The `anon` / publishable key (not `service_role`) |

**Locally:** copy `.env.example` to `.env.local` and fill them in. `.env*` files are
git-ignored; never commit them.

**On Vercel:** Project > **Settings > Environment Variables**, add both for Production (and
Preview if you want previews to have a working portal), then **redeploy**. `NEXT_PUBLIC_`
values are baked in at build time, so a redeploy is required after changing them.

## 6. Make yourself an admin

1. Open `/login` on the site and sign in once (email link or Google). This creates your
   account and profile.
2. In Supabase **SQL Editor**, run (with your email):

   ```sql
   update public.profiles set is_staff = true
   where email = lower('you@moonlabs.example');
   ```

3. Reload `/dashboard`. You now see **Admin** in the sidebar and can see every organization.

`is_staff` = Moonlabs staff with access to every client. For a teammate who should only
manage one client, invite them to that organization with the **Admin (Moonlabs)** role
instead.

## 7. Invite a client

1. `/dashboard/admin` > **New organization**: the client's company name and plan.
2. Open the organization > **Settings & people** > **Invite someone**: their email, role
   **Client**. Add as many people from the client's team as you like.
3. Tell them to go to `https://<your-site>/login` and sign in with **that same email**
   (email link, or Google if it is a Google account). They are added to the organization
   automatically on first sign-in. Pending invites are listed under the form until used.
4. Fill in their workspace from the admin tabs: projects (the five stages are created for
   you), milestones and updates, automations and run logs, files, invoices.

Anyone can request a sign-in link, but a person who is not invited only sees "Your workspace
is not set up yet". They cannot see any client data.

## What clients can and cannot do

| | Client | Org admin / staff |
| --- | --- | --- |
| See their own organization's projects, automations, runs, files, invoices | yes | yes (all orgs for staff) |
| See draft invoices | no | yes |
| Open requests, comment on requests | yes | yes |
| Change request status, edit anything else, upload files | no | yes |
| Create organizations | no | staff only |

All of this is enforced by the RLS policies in the migration, not just hidden in the UI.

## Files

Deliverables go to the private `deliverables` bucket under `<organization id>/...`. Admins
upload from **Admin > Files** (straight from the browser to Supabase, max 50 MB per file).
Clients download through `/dashboard/files/<id>/download`, which issues a signed link that
expires after 5 minutes.

## Hours saved

Each automation has "minutes saved per run". Every successful run logged gets that many
minutes (or a custom number), and the overview shows the total for the current month (UTC).

## Local testing with demo data

With the Supabase CLI and Docker:

```bash
supabase init            # once, if there is no supabase/config.toml yet
supabase start
supabase db reset        # applies migrations/ and then seed.sql
```

Use the local URL and anon key printed by `supabase start` in `.env.local`. Sign in as
`demo-client@example.com` (the email shows up in the local mail viewer, Inbucket/Mailpit, at
the URL printed by `supabase start`) to see the demo client "Demo Bakery Co. (DEMO)". Make a
second account staff with the SQL in step 6 to try the admin side.

## Troubleshooting

- **"Client portal not configured yet" in production**: the env vars are missing or the
  site was not redeployed after adding them.
- **Email link says invalid or expired**: links are one-time and expire after an hour. With
  the default template they also only work in the browser that requested them; use the
  token-hash template from step 3.
- **Google sign-in returns to /login with an error**: check the redirect URI in Google Cloud
  and the Redirect URLs list in Supabase.
- **Signed in but no workspace**: the invite email does not match the sign-in email exactly,
  or no invite was created. Add the invite and have them sign in again.
