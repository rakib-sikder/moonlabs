// Encryption for secrets clients hand over (API keys, logins). AES-256-GCM with a key that lives
// only in the Worker secret SECRETS_KEY (32 random bytes, base64). The database holds
// ciphertext and IV only; each value is bound to its row id as associated data, so a ciphertext
// copied onto another row does not decrypt.

import { getPortalEnv } from "./env";

const enc = new TextEncoder();
const dec = new TextDecoder();

function toBase64(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function fromBase64(value: string): Uint8Array {
  const bin = atob(value);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** The vault key, or null when SECRETS_KEY is missing or not 32 bytes (feature then off). */
export async function getVaultKey(): Promise<CryptoKey | null> {
  const env = (await getPortalEnv()) as { SECRETS_KEY?: string };
  const raw = (env.SECRETS_KEY ?? process.env.SECRETS_KEY)?.replace(/^﻿/, "").trim();
  if (!raw) return null;
  let bytes: Uint8Array;
  try {
    bytes = fromBase64(raw);
  } catch {
    return null;
  }
  if (bytes.length !== 32) return null;
  return crypto.subtle.importKey("raw", bytes as BufferSource, "AES-GCM", false, ["encrypt", "decrypt"]);
}

export async function isVaultConfigured(): Promise<boolean> {
  return (await getVaultKey()) !== null;
}

export async function sealSecret(key: CryptoKey, rowId: string, value: string): Promise<{ ciphertext: string; iv: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: enc.encode(rowId) }, key, enc.encode(value));
  return { ciphertext: toBase64(new Uint8Array(data)), iv: toBase64(iv) };
}

export async function openSecret(key: CryptoKey, rowId: string, sealed: { ciphertext: string; iv: string }): Promise<string> {
  const data = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromBase64(sealed.iv) as BufferSource, additionalData: enc.encode(rowId) },
    key,
    fromBase64(sealed.ciphertext) as BufferSource,
  );
  return dec.decode(data);
}
