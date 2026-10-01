/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { X, Check, Minus, Clock, ShieldCheck, Sparkles, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { ProjectType } from "../types";
import { CurrencyCode, detectUserCurrency, formatCurrencyPrice } from "../utils/currency";
import { SERVICES_CATALOG_DATA, ServiceCatalogItem, PackageItem } from "../data/servicesCatalog";

export interface ServiceItem {
  id: string;
  type: ProjectType;
  title: string;
  subtitle: string;
  deliveryTime: string;
  image: string;
  itinerary: { label: string; desc: string }[];
  includes: string[];
  notIncludes: string[];
  difficulty: string;
}

interface ServicePreviewModalProps {
  service: ServiceItem;
  onClose: () => void;
  onOrder: (type: ProjectType, packageId?: string) => void;
}

export default function ServicePreviewModal({
  service,
  onClose,
  onOrder
}: ServicePreviewModalProps) {
  const [currency, setCurrency] = useState<CurrencyCode>("PEN");
  const [selectedPkgIndex, setSelectedPkgIndex] = useState<number>(0);

  useEffect(() => {
    const { currency: detected } = detectUserCurrency();
    setCurrency(detected);
  }, []);

  const catalogItem: ServiceCatalogItem = SERVICES_CATALOG_DATA.find((s) => s.type === service.type) || SERVICES_CATALOG_DATA[0];
  const packages: PackageItem[] = catalogItem.packages || [];
  const currentPkg = packages[selectedPkgIndex] || packages[0] || {
    id: "default",
    name: "Estándar",
    priceInPEN: 240,
    delivery: service.deliveryTime,
    description: service.subtitle,
    benefits: service.includes
  };

  const currentPrice = currentPkg.priceInPEN;

  const nextPackage = () => {
    if (packages.length <= 1) return;
    setSelectedPkgIndex((prev) => (prev + 1) % packages.length);
  };

  const prevPackage = () => {
    if (packages.length <= 1) return;
    setSelectedPkgIndex((prev) => (prev - 1 + packages.length) % packages.length);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        id="service-preview-overlay"
        className="relative max-w-5xl w-full bg-[#FAF9F5] dark:bg-[#121110] text-stone-900 dark:text-stone-100 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-stone-200/80 dark:border-stone-800 animate-fade-in"
      >
        <button
          onClick={onClose}
          id="close-preview-btn"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white md:bg-stone-100 md:hover:bg-stone-200 md:text-stone-700 dark:md:bg-stone-800 dark:md:text-stone-200 transition-colors cursor-pointer"
          title="Cerrar vista previa"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: Immersive visual presentation */}
        <div className="relative w-full md:w-5/12 h-64 md:h-auto min-h-[300px] md:min-h-[600px] flex flex-col justify-end p-6 md:p-8 overflow-hidden select-none">
          <div className="absolute inset-0 z-0">
            <img 
              src={service.image} 
              alt={service.title} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>
          </div>

          <div className="relative z-10 space-y-3">
            <span className="text-[10px] bg-amber-500 text-stone-950 font-bold uppercase tracking-[0.2em] font-space px-3 py-1 rounded-full inline-block">
              V.A.C. Creative Edition
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight leading-tight drop-shadow-md">
              {service.title}
            </h2>
            <p className="text-stone-200 text-xs md:text-sm leading-relaxed drop-shadow-sm font-normal">
              {currentPkg.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <div className="bg-stone-900/80 backdrop-blur-xs text-white border border-stone-700 px-3.5 py-1.5 rounded-full font-mono text-xs font-semibold flex items-center gap-1.5 shadow-md">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentPkg.delivery}</span>
              </div>
              <div className="bg-stone-900/80 backdrop-blur-xs text-amber-400 border border-amber-500/40 px-3.5 py-1.5 rounded-full font-mono text-xs font-bold flex items-center gap-1.5 shadow-md">
                <Tag className="w-3.5 h-3.5" />
                <span>{formatCurrencyPrice(currentPrice, currency)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Splendid details & Package Carousel */}
        <div className="w-full md:w-7/12 p-6 md:p-10 flex flex-col justify-between overflow-y-auto max-h-[90vh] md:max-h-[600px] lg:max-h-[700px]">
          <div className="space-y-8">
            
            {/* PACKAGE CAROUSEL SELECTOR */}
            {packages.length > 0 && (
              <div className="space-y-3 bg-stone-100/80 dark:bg-stone-900/80 p-4 rounded-2xl border border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-space font-bold tracking-wider text-amber-700 dark:text-amber-400">
                    Selecciona el Paquete ({selectedPkgIndex + 1}/{packages.length})
                  </span>
                  {packages.length > 1 && (
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={prevPackage}
                        className="p-1 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 cursor-pointer"
                        title="Anterior paquete"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={nextPackage}
                        className="p-1 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 cursor-pointer"
                        title="Siguiente paquete"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Package tabs / cards */}
                <div className="grid grid-cols-3 gap-2">
                  {packages.map((pkg, idx) => {
                    const isSelected = idx === selectedPkgIndex;
                    return (
                      <button
                        key={pkg.id}
                        onClick={() => setSelectedPkgIndex(idx)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-amber-500 text-stone-950 border-amber-500 font-bold shadow-sm"
                            : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-400"
                        }`}
                      >
                        <span className="text-xs block font-space uppercase tracking-wider">{pkg.name}</span>
                        <span className="text-[11px] font-mono block opacity-90">{formatCurrencyPrice(pkg.priceInPEN, currency)}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Dots indicator */}
                <div className="flex justify-center gap-1.5 pt-1">
                  {packages.map((_, idx) => (
                    <span 
                      key={idx} 
                      className={`w-1.5 h-1.5 rounded-full transition-all ${idx === selectedPkgIndex ? "bg-amber-500 w-4" : "bg-stone-300 dark:bg-stone-700"}`} 
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 1. ITINERARIO DETALLADO */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-200/80 dark:border-stone-800 pb-2">
                <span className="w-6 h-px bg-amber-500" />
                <h3 className="text-xs uppercase font-space font-bold tracking-[0.2em] text-amber-700 dark:text-amber-400">
                  Fases del Proceso Digital
                </h3>
              </div>
              
              <div className="relative border-l border-stone-200 dark:border-stone-800 ml-3.5 pl-6 space-y-5">
                {service.itinerary.map((step, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-10 top-0.5 w-4 h-4 rounded-full border-2 border-amber-500 bg-[#FAF9F5] dark:bg-[#121110] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                    </div>
                    <div>
                      <h4 className="font-space text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide">
                        {step.label}
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-normal mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. ¿QUÉ INCLUYE? & NO INCLUYE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-stone-200/80 dark:border-stone-800 pb-2">
                  <span className="w-4 h-px bg-amber-500" />
                  <h3 className="text-xs uppercase font-space font-bold tracking-[0.2em] text-amber-700 dark:text-amber-400">
                    Incluye ({currentPkg.name})
                  </h3>
                </div>
                <ul className="space-y-2">
                  {currentPkg.benefits.map((inc, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="mt-0.5 p-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="text-xs text-stone-800 dark:text-stone-200 leading-tight font-normal">{inc}</span>
                    </li>
                  ))}
                  {service.includes.map((inc, index) => (
                    <li key={`gen-${index}`} className="flex items-start gap-2">
                      <div className="mt-0.5 p-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="text-xs text-stone-800 dark:text-stone-200 leading-tight font-normal">{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-stone-200/80 dark:border-stone-800 pb-2">
                  <span className="w-4 h-px bg-stone-400" />
                  <h3 className="text-xs uppercase font-space font-bold tracking-[0.2em] text-stone-400">
                    No incluye
                  </h3>
                </div>
                <ul className="space-y-2">
                  {service.notIncludes.map((ninc, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="mt-1 shrink-0 text-stone-400">
                        <Minus className="w-3 h-3" />
                      </div>
                      <span className="text-xs text-stone-600 dark:text-stone-300 leading-tight font-normal">{ninc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 3. EXPERIENCE LEVEL ADVICE */}
            <div className="bg-stone-100/70 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 flex items-start gap-3 mt-4">
              <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 font-space uppercase tracking-wider">
                  Nivel de Calidad: {service.difficulty}
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-normal font-normal mt-0.5">
                  Nuestras invitaciones se programan individualmente con código limpio, garantizando carga instantánea en redes móviles y excelente desempeño.
                </p>
              </div>
            </div>

          </div>

          {/* ACTION BUTTON */}
          <div className="pt-8 border-t border-stone-200/80 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-xs text-stone-500 block uppercase font-mono tracking-wider">Paquete {currentPkg.name}</span>
              <span className="text-sm font-bold text-amber-700 dark:text-amber-400 font-mono">
                {formatCurrencyPrice(currentPrice, currency)}
              </span>
            </div>

            <button
              onClick={() => {
                onOrder(service.type, currentPkg.id);
                onClose();
              }}
              id="confirm-checkout-btn"
              className="w-full sm:w-auto px-8 py-3.5 bg-stone-950 hover:bg-stone-850 text-white dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-stone-950 rounded-full font-bold font-space text-xs tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer uppercase"
            >
              Hacer Pedido & Llenar Formulario
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
