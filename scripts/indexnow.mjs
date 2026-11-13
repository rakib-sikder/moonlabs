// Tell Bing, Yandex and the other IndexNow engines about every page in the live sitemap.
// Run after a deploy:  node scripts/indexnow.mjs
// The key file lives in public/indexnow-<key>.txt and is served at the site root.

import { readdirSync, readFileSync } from "node:fs";

const SITE = "https://moonlab.space";
const keyFile = readdirSync("public").find((f) => /^indexnow-[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("No public/indexnow-<key>.txt file found.");
const key = readFileSync(`public/${keyFile}`, "utf8").trim();

const sitemap = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urls.length) throw new Error("The sitemap has no URLs.");

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key, keyLocation: `${SITE}/${keyFile}`, urlList: urls }),
});
// 200 or 202 means accepted. 403 means the key file isn't reachable yet (deploy first).
console.log(`IndexNow: ${res.status} for ${urls.length} URLs`);
