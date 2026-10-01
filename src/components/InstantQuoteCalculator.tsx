/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Calculator, 
  Sparkles, 
  Check, 
  MessageCircle, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  HelpCircle,
  Smartphone,
  Music,
  Camera,
  QrCode,
  Zap,
  MapPin
} from "lucide-react";
import { ProjectType } from "../types";
import CurrencySelector, { 
  ActiveCurrency, 
  convertPrice, 
  formatCurrency, 
  CURRENCY_OPTIONS 
} from "./CurrencySelector";

interface InstantQuoteCalculatorProps {
  onSelectServiceAndStartOrder: (type: ProjectType, prefilledNotes?: string) => void;
}

interface ServiceBaseItem {
  type: ProjectType;
  title: string;
  basePriceInPEN: number;
  delivery: string;
  description: string;
}

// Master catalogue defined in Soles (PEN)
const SERVICE_BASE_PRICES: ServiceBaseItem[] = [
  {
    type: ProjectType.BODA,
    title: "Invitación de Bodas Luxury",
    basePriceInPEN: 240,
    delivery: "3 a 5 días",
    description: "Diseño elegante para parejas con confirmación RSVP y enlace web propio."
  },
  {
    type: ProjectType.XV_ANOS,
    title: "Invitación de XV Años Princesa",
    basePriceInPEN: 190,
    delivery: "3 a 4 días",
    description: "Animaciones mágicas, lluvia de destellos, cronómetro y dress code."
  },
  {
    type: ProjectType.CUMPLEANOS,
    title: "Invitación de Cumpleaños Express",
    basePriceInPEN: 130,
    delivery: "24 a 48 horas",
    description: "Formato ágil de alta energía con botón de ubicación y confirmación."
  },
  {
    type: ProjectType.CARTA_DIGITAL,
    title: "Carta & Menú Digital Gourmet",
    basePriceInPEN: 280,
    delivery: "4 a 6 días",
    description: "Catálogo de platillos con categorías, fotos y envío de comanda a WhatsApp."
  },
  {
    type: ProjectType.LANDING_PAGE,
    title: "Landing Page Comercial",
    basePriceInPEN: 360,
    delivery: "3 a 5 días",
    description: "Página web de alta conversión para venta o captación de prospectos."
  },
  {
    type: ProjectType.SPOT,
    title: "Spot Publicitario / Locución",
    basePriceInPEN: 220,
    delivery: "3 a 5 días",
    description: "Audio comercial con locución profesional y masterización de sonido."
  },
  {
    type: ProjectType.FOTO_VIDEO,
    title: "Producción Audiovisual / Video",
    basePriceInPEN: 320,
    delivery: "5 a 7 días",
    description: "Edición cinemática, corrección de color y formato vertical para redes."
  },
  {
    type: ProjectType.DISENO_GRAFICO,
    title: "Identidad Gráfica & Branding",
    basePriceInPEN: 260,
    delivery: "2 a 4 días",
    description: "Diseño de logotipos vectoriales originales y paletas cromáticas."
  }
];

interface AddonItem {
  id: string;
  label: string;
  priceInPEN: number;
  description: string;
  icon: "music" | "camera" | "qr" | "zap" | "msg";
}

const ADDON_OPTIONS: AddonItem[] = [
  {
    id: "musica",
    label: "Música de Fondo Autoejecutable",
    priceInPEN: 30,
    description: "Canción personalizada que suena al abrir la invitación en el smartphone.",
    icon: "music"
  },
  {
    id: "fotos_hd",
    label: "Galería de Fotos HD (Hasta 10)",
    priceInPEN: 40,
    description: "Carrousel interactivo con fotos de la sesión previa en alta resolución.",
    icon: "camera"
  },
  {
    id: "qr_personalizado",
    label: "Código QR Imprimible en Alta",
    priceInPEN: 25,
    description: "Vector del código QR para imprimir en tarjetas de recuerdo o mesas.",
    icon: "qr"
  },
  {
    id: "rsvp_avanzado",
    label: "Confirmación RSVP WhatsApp con Pases",
    priceInPEN: 35,
    description: "Mensaje estructurado con conteo exacto de adultos y niños confirmados.",
    icon: "msg"
  },
  {
    id: "entrega_urgente",
    label: "Entrega Prioritaria Flash (24 Horas)",
    priceInPEN: 70,
    description: "Trabajamos tu proyecto en canal preferencial con revisión prioritaria.",
    icon: "zap"
  }
];

const STORAGE_CURRENCY_KEY = "vac_cotizador_currency";

export default function InstantQuoteCalculator({
  onSelectServiceAndStartOrder
}: InstantQuoteCalculatorProps) {
  const [selectedType, setSelectedType] = useState<ProjectType>(ProjectType.BODA);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([
    "musica",
    "rsvp_avanzado"
  ]);
  const [currency, setCurrency] = useState<ActiveCurrency>("PEN");
  const [detectionOrigin, setDetectionOrigin] = useState<string>("");

  // Detect region on mount or load saved preference
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_CURRENCY_KEY);
    if (saved === "PEN" || saved === "USD") {
      setCurrency(saved as ActiveCurrency);
      setDetectionOrigin("preferencia guardada");
      return;
    }

    try {
      const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || "").toLowerCase();
      const languages = (navigator.languages || [navigator.language || ""]).map((l) => l.toLowerCase());
      
      if (tz.includes("lima") || languages.some((l) => l.includes("pe"))) {
        setCurrency("PEN");
        setDetectionOrigin("Perú (Soles)");
      } else {
        setCurrency("USD");
        setDetectionOrigin("Internacional (USD)");
      }
    } catch {
      setCurrency("PEN");
    }
  }, []);

  const handleCurrencyChange = (newCurrency: ActiveCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem(STORAGE_CURRENCY_KEY, newCurrency);
    setDetectionOrigin("");
  };

  const currentService = SERVICE_BASE_PRICES.find((s) => s.type === selectedType) || SERVICE_BASE_PRICES[0];

  // Dynamic price calculation using the conversion function
  const currentBasePrice = convertPrice(currentService.basePriceInPEN, currency);

  const addonsTotalInCurrency = selectedAddons.reduce((sum, id) => {
    const addon = ADDON_OPTIONS.find((a) => a.id === id);
    return sum + (addon ? convertPrice(addon.priceInPEN, currency) : 0);
  }, 0);

  const displayedTotalPrice = currentBasePrice + addonsTotalInCurrency;
  const currencyMeta = CURRENCY_OPTIONS[currency];

  const toggleAddon = (id: string) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter((item) => item !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  const handleStartOrder = () => {
    const addonNames = selectedAddons
      .map((id) => ADDON_OPTIONS.find((a) => a.id === id)?.label)
      .filter(Boolean)
      .join(", ");

    const formattedAmount = formatCurrency(displayedTotalPrice, currency);
    const notes = `Cotización Calculada en el Sistema: ${currentService.title}. Inversión estimada: ${formattedAmount}. Extras incluidos: ${addonNames || "Ninguno"}.`;
    onSelectServiceAndStartOrder(selectedType, notes);
  };

  const handleContactWhatsApp = () => {
    const addonNames = selectedAddons
      .map((id) => ADDON_OPTIONS.find((a) => a.id === id)?.label)
      .filter(Boolean)
      .join(", ");

    const formattedAmount = formatCurrency(displayedTotalPrice, currency);

    const message = encodeURIComponent(
      `¡Hola V.A.C. Creative! 👋 Deseo cotizar el servicio de *${currentService.title}* con un estimado de *${formattedAmount}*.\n\n*Extras elegidos:* ${addonNames || "Paquete base"}.\n*Tiempo estimado de entrega:* ${currentService.delivery}.\n*Moneda elegida:* ${currencyMeta.name} (${currencyMeta.symbol} ${currency}).\n\n¿Podrían asesorarme para iniciar mi pedido?`
    );
    window.open(`https://wa.me/525512345678?text=${message}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-white dark:bg-[#141311] border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 animate-fade-in">
      
      {/* Title & Currency Selector Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200/60 dark:border-stone-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-space font-bold uppercase tracking-[0.25em] text-amber-700 dark:text-amber-400">
              Cotizador Inteligente · V.A.C. Atelier
            </span>
            {detectionOrigin && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                <MapPin className="w-3 h-3" />
                <span>Región: {detectionOrigin}</span>
              </span>
            )}
          </div>

          <h3 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-50 tracking-tight">
            Calcula la Inversión de tu Proyecto
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 font-light">
            Alterna entre Soles (S/) y Dólares ($) con conversión instantánea para todo el catálogo.
          </p>
        </div>

        {/* Dedicated Currency Selector Component (Soles / Dólares) */}
        <CurrencySelector
          currency={currency}
          onChange={handleCurrencyChange}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Service Picker & Addons (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* 1. SELECCIÓN DEL SERVICIO */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-space uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400 block">
                1. Selecciona el Tipo de Proyecto
              </label>
              <span className="text-[11px] font-mono text-stone-400">
                Precios en {currencyMeta.symbol} {currency}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICE_BASE_PRICES.map((service) => {
                const isSelected = service.type === selectedType;
                const convertedServicePrice = convertPrice(service.basePriceInPEN, currency);

                return (
                  <button
                    key={service.type}
                    type="button"
                    onClick={() => setSelectedType(service.type)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? "border-amber-500 bg-amber-500/10 dark:bg-amber-500/15 shadow-sm"
                        : "border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/50 hover:border-stone-300 dark:hover:border-stone-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-serif font-bold ${isSelected ? "text-amber-900 dark:text-amber-300" : "text-stone-900 dark:text-stone-100"}`}>
                          {service.title}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 font-light mt-1 line-clamp-2">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs font-mono">
                      <span className="text-[10px] text-stone-400">{service.delivery}</span>
                      <span className="font-bold text-stone-900 dark:text-amber-400">
                        {formatCurrency(convertedServicePrice, currency)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. COMPLEMENTOS Y EXTRAS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-space uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400 block">
                2. Personaliza con Extras & Funcionalidades
              </label>
              <span className="text-[10px] text-stone-400 font-mono">Opcionales</span>
            </div>

            <div className="space-y-2.5">
              {ADDON_OPTIONS.map((addon) => {
                const isChecked = selectedAddons.includes(addon.id);
                const convertedAddonPrice = convertPrice(addon.priceInPEN, currency);

                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isChecked
                        ? "border-amber-500 bg-amber-500/5 dark:bg-amber-500/10 shadow-xs"
                        : "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300 dark:hover:border-stone-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                        isChecked
                          ? "bg-amber-500 text-stone-950"
                          : "border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          {addon.icon === "music" && <Music className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                          {addon.icon === "camera" && <Camera className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                          {addon.icon === "qr" && <QrCode className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                          {addon.icon === "msg" && <Smartphone className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                          {addon.icon === "zap" && <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                          <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 font-serif">
                            {addon.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 font-light">
                          {addon.description}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 shrink-0">
                      +{formatCurrency(convertedAddonPrice, currency)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Side: Dynamic Price Breakdown & Action (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          
          <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-7 space-y-6">
            
            <div className="border-b border-stone-200/80 dark:border-stone-800 pb-4">
              <span className="text-[10px] font-space font-bold uppercase tracking-[0.2em] text-stone-400 block mb-1">
                Resumen de Cotización
              </span>
              <h4 className="font-serif font-bold text-xl text-stone-950 dark:text-white">
                {currentService.title}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-light mt-0.5">
                Tiempo de entrega: {currentService.delivery}
              </p>
            </div>

            {/* Breakdown List */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                <span>Paquete Base de Diseño:</span>
                <span className="font-mono font-semibold">
                  {formatCurrency(currentBasePrice, currency)}
                </span>
              </div>

              {selectedAddons.map((id) => {
                const addon = ADDON_OPTIONS.find((a) => a.id === id);
                if (!addon) return null;
                const convertedAddon = convertPrice(addon.priceInPEN, currency);
                return (
                  <div key={id} className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-[11px]">
                    <span className="truncate pr-2">+ {addon.label}</span>
                    <span className="font-mono font-semibold shrink-0">
                      {formatCurrency(convertedAddon, currency)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Grand Total with Active Currency */}
            <div className="pt-4 border-t border-stone-200/80 dark:border-stone-800 space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="font-space text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Inversión Total Estimada:
                </span>
                <div className="text-right">
                  <span className="text-3xl font-serif font-bold text-stone-950 dark:text-amber-400 tracking-tight">
                    {formatCurrency(displayedTotalPrice, currency)}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-stone-400 text-right font-light">
                {currencyMeta.name} ({currencyMeta.flag}) · Sin comisiones ocultas
              </p>
            </div>

            {/* Guarantees */}
            <div className="pt-3 border-t border-stone-200/60 dark:border-stone-800 space-y-1.5 text-[11px] text-stone-500 dark:text-stone-400 font-light">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Enlace web propio y alojamiento garantizado</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Compatibilidad 100% con iOS y Android</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Confirmación instantánea de invitados por WhatsApp</span>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleStartOrder}
              id="btn-cotizador-iniciar-pedido"
              className="w-full py-4 bg-stone-950 hover:bg-stone-850 text-white dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-stone-950 font-bold font-space text-xs uppercase tracking-[0.2em] rounded-full shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Llenar Formulario con esta Cotización</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleContactWhatsApp}
              id="btn-cotizador-whatsapp"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-space text-xs uppercase tracking-wider rounded-full shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Consultar Asesor por WhatsApp ({currency})</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
