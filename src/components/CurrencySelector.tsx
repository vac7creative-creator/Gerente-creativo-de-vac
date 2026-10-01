/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Coins } from "lucide-react";

export type ActiveCurrency = "PEN" | "USD";

export interface CurrencyConfig {
  code: ActiveCurrency;
  symbol: string;
  name: string;
  flag: string;
}

export const CURRENCY_OPTIONS: Record<ActiveCurrency, CurrencyConfig> = {
  PEN: {
    code: "PEN",
    symbol: "S/",
    name: "Soles Peruanos",
    flag: "🇵🇪"
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "Dólares Americanos",
    flag: "🇺🇸"
  }
};

// Simple conversion rate: 1 USD = 3.75 PEN
export const EXCHANGE_RATE_PEN_TO_USD = 1 / 3.75;

/**
 * Simple conversion function to calculate price in the target currency
 * based on a base price in Soles (PEN).
 */
export function convertPrice(amountInPEN: number, targetCurrency: ActiveCurrency): number {
  if (targetCurrency === "USD") {
    return Math.round(amountInPEN * EXCHANGE_RATE_PEN_TO_USD);
  }
  return Math.round(amountInPEN);
}

/**
 * Helper to format price with symbol and currency code
 */
export function formatCurrency(amount: number, currency: ActiveCurrency): string {
  const conf = CURRENCY_OPTIONS[currency];
  if (currency === "PEN") {
    return `${conf.symbol} ${amount.toLocaleString("es-PE")}`;
  }
  return `${conf.symbol}${amount.toLocaleString("en-US")} ${currency}`;
}

interface CurrencySelectorProps {
  currency: ActiveCurrency;
  onChange: (currency: ActiveCurrency) => void;
  className?: string;
}

export default function CurrencySelector({
  currency,
  onChange,
  className = ""
}: CurrencySelectorProps) {
  return (
    <div className={`inline-flex items-center gap-1.5 p-1 rounded-full bg-stone-100 dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 ${className}`}>
      <div className="pl-2 pr-1 hidden sm:flex items-center gap-1 text-[11px] font-space font-medium text-stone-500 dark:text-stone-400">
        <Coins className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
        <span>Moneda:</span>
      </div>

      {/* Button: Soles (PEN) */}
      <button
        type="button"
        onClick={() => onChange("PEN")}
        className={`px-3.5 py-1.5 rounded-full font-space text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
          currency === "PEN"
            ? "bg-stone-950 text-white dark:bg-amber-400 dark:text-stone-950 shadow-sm"
            : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"
        }`}
        title="Ver precios en Soles Peruanos (S/)"
      >
        <span>🇵🇪</span>
        <span>Soles (S/)</span>
      </button>

      {/* Button: Dólares (USD) */}
      <button
        type="button"
        onClick={() => onChange("USD")}
        className={`px-3.5 py-1.5 rounded-full font-space text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
          currency === "USD"
            ? "bg-stone-950 text-white dark:bg-amber-400 dark:text-stone-950 shadow-sm"
            : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"
        }`}
        title="Ver precios en Dólares Americanos ($ USD)"
      >
        <span>🇺🇸</span>
        <span>Dólares ($)</span>
      </button>
    </div>
  );
}
