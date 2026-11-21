// Assistant settings staff change in the admin (app_settings table), with safe defaults.

export type AssistantSettings = {
  enabled: boolean;
  /** Messages one person may send per day. */
  dailyLimit: number;
  /** Tokens (input + output) allowed per calendar month across everyone; 0 = no cap. */
  monthlyTokenBudget: number;
  /** USD per million tokens, for the cost estimate; 0 = free tier / unknown. */
  priceInPerM: number;
  priceOutPerM: number;
};

export const DEFAULT_SETTINGS: AssistantSettings = {
  enabled: true,
  dailyLimit: 80,
  monthlyTokenBudget: 0,
  priceInPerM: 0,
  priceOutPerM: 0,
};

const KEYS: Record<keyof AssistantSettings, string> = {
  enabled: "assistant.enabled",
  dailyLimit: "assistant.daily_limit",
  monthlyTokenBudget: "assistant.monthly_token_budget",
  priceInPerM: "assistant.price_in_per_m",
  priceOutPerM: "assistant.price_out_per_m",
};

export async function getAssistantSettings(db: D1Database): Promise<AssistantSettings> {
  const { results } = await db.prepare("SELECT key, value FROM app_settings WHERE key LIKE 'assistant.%'").all<{ key: string; value: string }>();
  const map = new Map(results.map((r) => [String(r.key), String(r.value)]));
  const num = (k: keyof AssistantSettings, d: number) => {
    const v = Number(map.get(KEYS[k]));
    return Number.isFinite(v) && v >= 0 ? v : d;
  };
  return {
    enabled: map.has(KEYS.enabled) ? map.get(KEYS.enabled) === "1" : DEFAULT_SETTINGS.enabled,
    dailyLimit: Math.floor(num("dailyLimit", DEFAULT_SETTINGS.dailyLimit)),
    monthlyTokenBudget: Math.floor(num("monthlyTokenBudget", DEFAULT_SETTINGS.monthlyTokenBudget)),
    priceInPerM: num("priceInPerM", 0),
    priceOutPerM: num("priceOutPerM", 0),
  };
}

export function settingStatements(db: D1Database, s: AssistantSettings, userId: string): D1PreparedStatement[] {
  const values: [keyof AssistantSettings, string][] = [
    ["enabled", s.enabled ? "1" : "0"],
    ["dailyLimit", String(s.dailyLimit)],
    ["monthlyTokenBudget", String(s.monthlyTokenBudget)],
    ["priceInPerM", String(s.priceInPerM)],
    ["priceOutPerM", String(s.priceOutPerM)],
  ];
  return values.map(([k, v]) =>
    db
      .prepare(
        `INSERT INTO app_settings (key, value, updated_by) VALUES (?, ?, ?)
         ON CONFLICT (key) DO UPDATE SET value = excluded.value, updated_by = excluded.updated_by, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`,
      )
      .bind(KEYS[k], v, userId),
  );
}

export function costUsd(s: AssistantSettings, input: number, output: number): number | null {
  if (!s.priceInPerM && !s.priceOutPerM) return null;
  return (input / 1e6) * s.priceInPerM + (output / 1e6) * s.priceOutPerM;
}
