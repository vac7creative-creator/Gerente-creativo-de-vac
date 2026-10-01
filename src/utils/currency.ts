/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CurrencyCode = "PEN" | "USD" | "MXN";

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  country: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  PEN: {
    code: "PEN",
    symbol: "S/",
    name: "Soles Peruanos",
    flag: "🇵🇪",
    country: "Perú"
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "Dólares Americanos",
    flag: "🇺🇸",
    country: "Internacional"
  },
  MXN: {
    code: "MXN",
    symbol: "$",
    name: "Pesos Mexicanos",
    flag: "🇲🇽",
    country: "México"
  }
};

const STORAGE_KEY = "vac_selected_currency";

/**
 * Automatically detects the user's currency based on time zone and browser locale.
 */
export function detectUserCurrency(): { currency: CurrencyCode; detectedBy: string } {
  // Check if user previously saved a manual preference
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "PEN" || saved === "USD" || saved === "MXN") {
    return { currency: saved as CurrencyCode, detectedBy: "preferencia guardada" };
  }

  try {
    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || "").toLowerCase();
    const languages = (navigator.languages || [navigator.language || ""]).map((l) => l.toLowerCase());

    // 1. Peru detection (America/Lima, es-PE)
    if (tz.includes("lima") || languages.some((l) => l.includes("pe") || l === "es-pe")) {
      return { currency: "PEN", detectedBy: "región Perú (Soles)" };
    }

    // 2. Mexico detection (Mexico_City, Monterrey, Cancun, Tijuana, es-MX)
    if (
      tz.includes("mexico") ||
      tz.includes("monterrey") ||
      tz.includes("cancun") ||
      tz.includes("tijuana") ||
      tz.includes("merida") ||
      tz.includes("chihuahua") ||
      tz.includes("mazatlan") ||
      languages.some((l) => l.includes("mx") || l === "es-mx")
    ) {
      return { currency: "MXN", detectedBy: "región México (Pesos)" };
    }

    // 3. International default: USD
    return { currency: "USD", detectedBy: "región internacional (USD)" };
  } catch {
    return { currency: "PEN", detectedBy: "por defecto" };
  }
}

/**
 * Saves user currency preference
 */
export function saveUserCurrency(currency: CurrencyCode): void {
  localStorage.setItem(STORAGE_KEY, currency);
}

/**
 * Currency conversion mapping
 * Base reference values calibrated for wedding & digital invitations market
 */
export interface ServicePriceMap {
  PEN: number;
  USD: number;
  MXN: number;
}

export function formatCurrencyPrice(amount: number, currency: CurrencyCode): string {
  const info = CURRENCIES[currency];
  if (currency === "PEN") {
    return `${info.symbol} ${amount.toLocaleString("es-PE")}`;
  }
  return `${info.symbol}${amount.toLocaleString("en-US")} ${currency}`;
}
