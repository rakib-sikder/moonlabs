#!/usr/bin/env node
// Creates a one-time invite link for a Moonlabs staff account (first admin bootstrap).
//
//   node scripts/portal-create-admin.mjs you@example.com                 # production D1
//   node scripts/portal-create-admin.mjs you@example.com --local         # local D1 (wrangler dev)
//   node scripts/portal-create-admin.mjs you@example.com --base https://portal.example.com
//
// The link is valid for 7 days and works once. Opening it lets the person set their name and
// password; the account is created with is_staff = 1 (access to every organization).
// Only the SHA-256 hash of the token is stored, so the printed link cannot be recovered later.

import { createHash, randomBytes, randomUUID } from "node:crypto";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const DATABASE = "moonlabs-portal";
const DEFAULT_BASE = "https://moonlabs.sikdersmail.workers.dev";
const INVITE_DAYS = 7;

function usage(message) {
  if (message) console.error(`Error: ${message}\n`);
  console.error("Usage: node scripts/portal-create-admin.mjs <email> [--local] [--base <url>]");
  process.exit(1);
}

const args = process.argv.slice(2);
let email = null;
let local = false;
let base = DEFAULT_BASE;
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--local") local = true;
  else if (a === "--remote") local = false;
  else if (a === "--base") base = args[++i] ?? usage("--base needs a URL");
  else if (a.startsWith("--base=")) base = a.slice("--base=".length);
  else if (a === "-h" || a === "--help") usage();
  else if (!a.startsWith("-") && !email) email = a;
  else usage(`unknown argument ${a}`);
}

if (!email) usage("email is required");
email = email.trim().toLowerCase();
if (!/^[^\s@'"\\;]+@[^\s@'"\\;]+\.[^\s@'"\\;]+$/.test(email) || email.length > 254) usage("that does not look like an email address");
try {
  const u = new URL(base);
  if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error("bad protocol");
  base = u.origin;
} catch {
  usage("--base must be a full URL like https://example.com");
}

const token = randomBytes(32).toString("base64url");
const tokenHash = createHash("sha256").update(token).digest("hex");
const expiresAt = new Date(Date.now() + INVITE_DAYS * 24 * 60 * 60 * 1000).toISOString();

// Values are validated above (uuid, hex, ISO date, email without quotes), so plain literals are safe.
const sql =
  "INSERT INTO invites (id, token_hash, email, org_id, role, is_staff, expires_at) " +
  `VALUES ('${randomUUID()}', '${tokenHash}', '${email}', NULL, 'admin', 1, '${expiresAt}');\n`;

const dir = mkdtempSync(join(tmpdir(), "portal-admin-"));
const file = join(dir, "invite.sql");
writeFileSync(file, sql);

const wranglerArgs = ["wrangler", "d1", "execute", DATABASE, local ? "--local" : "--remote", `--file=${file}`, "--yes"];
console.error(`Running: npx ${wranglerArgs.join(" ")}`);
const result = spawnSync("npx", wranglerArgs, { stdio: ["ignore", "inherit", "inherit"], shell: process.platform === "win32" });
rmSync(dir, { recursive: true, force: true });

if (result.status !== 0) {
  console.error("\nCould not insert the invite. Check that wrangler is logged in and migrations are applied.");
  process.exit(result.status ?? 1);
}

console.log(`\nStaff invite for ${email} (${local ? "local" : "production"} database), valid ${INVITE_DAYS} days, works once:\n`);
console.log(`  ${base}/invite/${token}\n`);
