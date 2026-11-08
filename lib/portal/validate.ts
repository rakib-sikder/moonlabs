// Small FormData readers for server actions. Each throws ValidationError with a message
// that is safe to show to the user; actions catch it and return { ok: false, message }.

export class ValidationError extends Error {}

type TextOpts = { label: string; max?: number; min?: number };

export function text(fd: FormData, name: string, opts: TextOpts): string {
  const raw = fd.get(name);
  const value = typeof raw === "string" ? raw.trim() : "";
  const min = opts.min ?? 1;
  if (value.length < min) throw new ValidationError(min <= 1 ? `${opts.label} is required.` : `${opts.label} is too short.`);
  if (opts.max && value.length > opts.max) throw new ValidationError(`${opts.label} must be at most ${opts.max} characters.`);
  return value;
}

export function optionalText(fd: FormData, name: string, opts: Omit<TextOpts, "min">): string | null {
  const raw = fd.get(name);
  const value = typeof raw === "string" ? raw.trim() : "";
  if (!value) return null;
  if (opts.max && value.length > opts.max) throw new ValidationError(`${opts.label} must be at most ${opts.max} characters.`);
  return value;
}

export function oneOf<T extends string>(fd: FormData, name: string, allowed: readonly T[], label: string): T {
  const raw = fd.get(name);
  if (typeof raw === "string" && (allowed as readonly string[]).includes(raw)) return raw as T;
  throw new ValidationError(`Choose a valid ${label.toLowerCase()}.`);
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID.test(value);
}

export function uuid(fd: FormData, name: string, label = "Item"): string {
  const raw = fd.get(name);
  if (isUuid(raw)) return raw;
  throw new ValidationError(`${label} is missing or invalid.`);
}

export function optionalUuid(fd: FormData, name: string, label = "Item"): string | null {
  const raw = fd.get(name);
  if (raw === null || raw === "") return null;
  if (isUuid(raw)) return raw;
  throw new ValidationError(`${label} is invalid.`);
}

export function optionalDate(fd: FormData, name: string, label: string): string | null {
  const raw = fd.get(name);
  if (raw === null || raw === "") return null;
  if (typeof raw === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw) && !Number.isNaN(Date.parse(raw))) return raw;
  throw new ValidationError(`${label} must be a valid date.`);
}

export function optionalDateTime(fd: FormData, name: string, label: string): string | null {
  const raw = fd.get(name);
  if (raw === null || raw === "") return null;
  // <input type="datetime-local"> sends "YYYY-MM-DDTHH:mm"; treat it as UTC like the rest of the portal.
  if (typeof raw === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(raw)) {
    const d = new Date(`${raw}Z`);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  throw new ValidationError(`${label} must be a valid date and time.`);
}

export function int(
  fd: FormData,
  name: string,
  opts: { label: string; min?: number; max?: number; fallback?: number },
): number {
  const raw = fd.get(name);
  if ((raw === null || raw === "") && opts.fallback !== undefined) return opts.fallback;
  const n = typeof raw === "string" ? Number(raw) : NaN;
  if (!Number.isInteger(n)) throw new ValidationError(`${opts.label} must be a whole number.`);
  if (opts.min !== undefined && n < opts.min) throw new ValidationError(`${opts.label} must be at least ${opts.min}.`);
  if (opts.max !== undefined && n > opts.max) throw new ValidationError(`${opts.label} must be at most ${opts.max}.`);
  return n;
}

export function optionalInt(fd: FormData, name: string, opts: { label: string; min?: number; max?: number }): number | null {
  const raw = fd.get(name);
  if (raw === null || raw === "") return null;
  return int(fd, name, opts);
}

/** Money typed as "490" or "490.00" -> cents. */
export function cents(fd: FormData, name: string, label: string): number {
  const raw = fd.get(name);
  const value = typeof raw === "string" ? raw.trim().replace(/,/g, "") : "";
  if (!/^\d+(\.\d{1,2})?$/.test(value)) throw new ValidationError(`${label} must be an amount like 490 or 490.00.`);
  const n = Math.round(Number(value) * 100);
  if (n > 100_000_000_00) throw new ValidationError(`${label} is too large.`);
  return n;
}

export function email(fd: FormData, name: string): string {
  const value = text(fd, name, { label: "Email", max: 254 }).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new ValidationError("Enter a valid email address.");
  return value;
}

export function optionalUrl(fd: FormData, name: string, label: string): string | null {
  const value = optionalText(fd, name, { label, max: 2000 });
  if (!value) return null;
  try {
    const u = new URL(value);
    if (u.protocol === "https:" || u.protocol === "http:") return u.toString();
  } catch {
    // fall through
  }
  throw new ValidationError(`${label} must be a full http(s) link.`);
}

export function checkbox(fd: FormData, name: string): boolean {
  const raw = fd.get(name);
  return raw === "on" || raw === "true" || raw === "1";
}
