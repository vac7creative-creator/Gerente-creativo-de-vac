/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Check, Minus, Clock, ShieldCheck, Sparkles, Tag, ChevronLeft, ChevronRight, ArrowUpRight, Eye } from "lucide-react";
import { ProjectType } from "../types";
import { SERVICES_CATALOG_DATA, ServiceCatalogItem, PackageItem } from "../data/servicesCatalog";
import { PORTFOLIO_ITEMS, PortfolioItem } from "../data/portfolioCatalog";

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
  onOrder: (type: ProjectType, packageId?: string, sampleReference?: string) => void;
  onViewSample?: (sample: PortfolioItem) => void;
  initialPackageId?: string;
}

export default function ServicePreviewModal({
  service,
  onClose,
  onOrder,
  onViewSample,
  initialPackageId
}: ServicePreviewModalProps) {
  const catalogItem: ServiceCatalogItem =
    SERVICES_CATALOG_DATA.find((s) => s.id === service.id || s.type === service.type) || SERVICES_CATALOG_DATA[0];
  const packages: PackageItem[] = catalogItem.packages || [];

  const [selectedPkgIndex, setSelectedPkgIndex] = useState<number>(() => {
    if (initialPackageId && packages.length > 0) {
      const norm = initialPackageId.toLowerCase().trim();
      const idx = packages.findIndex(
        (p) => p.id.toLowerCase() === norm || p.name.toLowerCase() === norm
      );
      if (idx >= 0) return idx;
    }
    return 0;
  });

  React.useEffect(() => {
    if (initialPackageId && packages.length > 0) {
      const norm = initialPackageId.toLowerCase().trim();
      const idx = packages.findIndex(
        (p) => p.id.toLowerCase() === norm || p.name.toLowerCase() === norm
      );
      if (idx >= 0) {
        setSelectedPkgIndex(idx);
      }
    }
  }, [initialPackageId, packages]);
  const currentPkg: PackageItem | undefined = packages[selectedPkgIndex] || packages[0];

  const currentPrice = currentPkg?.priceInPEN != null ? currentPkg.priceInPEN : null;
  const activeImage = currentPkg?.image || catalogItem.image || service.image;

  const matchingSamples = PORTFOLIO_ITEMS.filter((item) => item.serviceType === service.type);

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
        <div className="relative w-full md:w-5/12 min-h-[460px] md:min-h-[640px] flex flex-col justify-end p-6 md:p-8 overflow-hidden select-none bg-stone-950">
          {/* Ambient diffuse continuation sampling bottom palette of the active sample */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <img 
              key={`ambient-${activeImage}`}
              src={activeImage} 
              alt="" 
              aria-hidden="true"
              referrerPolicy="no-referrer"
              className="absolute -bottom-10 inset-x-0 w-full h-[85%] object-cover object-bottom blur-3xl opacity-50 scale-110 transition-opacity duration-700"
            />
            {/* Scrim over ambient glow */}
            <div className="absolute inset-0 bg-stone-950/40 pointer-events-none" />
          </div>

          {/* Main sample image: begins from very top edge, spans 100% full width, natural aspect ratio */}
          <div className="absolute top-0 inset-x-0 z-[1] pointer-events-none overflow-hidden">
            <div className="relative w-full">
              <img 
                key={`main-${activeImage}`}
                src={activeImage} 
                alt={`${service.title} - ${currentPkg?.name || ""}`} 
                referrerPolicy="no-referrer"
                className="w-full h-auto block select-none transition-all duration-500 animate-fade-in"
              />
              {/* Progressive fade at the bottom boundary of the image to eliminate any hard cuts */}
              <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 md:h-52 bg-gradient-to-b from-transparent via-stone-950/60 to-stone-950 pointer-events-none" />
            </div>
          </div>

          {/* Deep gradient overlay spanning the lower 75% for absolute text readability and seamless bottom fusion */}
          <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-stone-950 via-stone-950/90 via-50% to-transparent pointer-events-none z-[2]" />

          {/* Text and badges overlay positioned legibly in the lower zone */}
          <div className="relative z-10 space-y-3 mt-auto">
            <span className="text-[10px] bg-amber-500 text-stone-950 font-bold uppercase tracking-[0.16em] px-3 py-1 rounded-full inline-block shadow-sm">
              V.A.C. Creative Edition
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-[-0.03em] leading-tight drop-shadow-md">
              {service.title}
            </h2>
            <p className="text-stone-200 text-xs md:text-sm leading-relaxed drop-shadow-sm font-normal line-clamp-3 md:line-clamp-none">
              {currentPkg.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-1.5">
              <div className="bg-stone-900/85 backdrop-blur-md text-white border border-stone-700/80 px-3.5 py-1.5 rounded-full font-mono text-xs font-semibold flex items-center gap-1.5 shadow-md">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentPkg?.delivery || service.deliveryTime}</span>
              </div>
              <div className="bg-stone-900/85 backdrop-blur-md text-amber-400 border border-amber-500/50 px-3.5 py-1.5 rounded-full font-mono text-xs font-bold flex items-center gap-1.5 shadow-md">
                <Tag className="w-3.5 h-3.5" />
                <span>{currentPrice != null ? `S/ ${currentPrice}` : "Precio a cotizar"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Splendid details & Package Selector */}
        <div className="w-full md:w-7/12 p-6 md:p-10 flex flex-col justify-between overflow-y-auto max-h-[90vh] md:max-h-[600px] lg:max-h-[700px]">
          <div className="space-y-8">
            
            {/* PACKAGE CAROUSEL / SELECTOR (IF MULTIPLE PACKAGES) */}
            {packages.length > 1 ? (
              <div className="space-y-3 bg-stone-100/80 dark:bg-stone-900/80 p-4 rounded-2xl border border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-space font-bold tracking-wider text-amber-700 dark:text-amber-400">
                    Selecciona el Paquete ({selectedPkgIndex + 1}/{packages.length})
                  </span>
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
                </div>

                {/* Package tabs / cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                        <span className="text-xs font-mono block opacity-90 font-bold">S/ {pkg.priceInPEN}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Dots indicator */}
                <div className="flex justify-center gap-1.5 pt-1">
                  {packages.map((_, idx) => (
                    <span 
                      key={idx} 
                      className={`h-1.5 rounded-full transition-all ${idx === selectedPkgIndex ? "bg-amber-500 w-4" : "bg-stone-300 dark:bg-stone-700 w-1.5"}`} 
                    />
                  ))}
                </div>
              </div>
            ) : packages.length === 1 && (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-space font-bold tracking-wider text-amber-700 dark:text-amber-400 block">
                    Paquete Exclusivo
                  </span>
                  <span className="text-sm font-serif font-bold text-stone-900 dark:text-stone-100">
                    {packages[0].name}
                  </span>
                </div>
                <span className="text-sm font-mono font-bold text-amber-700 dark:text-amber-400">
                  S/ {packages[0].priceInPEN}
                </span>
              </div>
            )}

            {/* VARIANTES DEL SERVICIO SI APLICAN (EJ. SPOT PUBLICITARIO / LOCUCIÓN) */}
            {catalogItem.variants && catalogItem.variants.length > 0 && (
              <div className="space-y-3 bg-amber-500/5 border border-amber-500/20 p-4 rounded-2xl">
                <span className="text-xs uppercase font-space font-bold tracking-wider text-amber-700 dark:text-amber-400 block">
                  Formatos y Variantes Disponibles
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {catalogItem.variants.map((v) => (
                    <div key={v.id} className="p-3 bg-white dark:bg-stone-900 border border-amber-500/30 rounded-xl space-y-1">
                      <span className="text-xs font-serif font-bold text-stone-900 dark:text-stone-100 block">
                        {v.label}
                      </span>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-tight">
                        {v.description}
                      </p>
                    </div>
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
              
              <div className="relative border-l border-stone-200 dark:border-stone-800 ml-3.5 pl-6 space-y-4">
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

            {/* 2. ¿QUÉ INCLUYE? Y DISPONIBILIDAD */}
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
                </ul>
              </div>

              <div className="space-y-4">
                {/* Disponible en paquetes superiores o como extra */}
                {currentPkg.upgradableFeatures && currentPkg.upgradableFeatures.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 border-b border-stone-200/80 dark:border-stone-800 pb-2">
                      <span className="w-4 h-px bg-amber-500/50" />
                      <h3 className="text-xs uppercase font-space font-bold tracking-[0.15em] text-amber-700 dark:text-amber-400">
                        En paquetes superiores o extra
                      </h3>
                    </div>
                    <ul className="space-y-1.5">
                      {currentPkg.upgradableFeatures.map((upg, index) => (
                        <li key={index} className="flex items-start gap-2 text-stone-600 dark:text-stone-400">
                          <ArrowUpRight className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                          <span className="text-xs leading-tight font-normal">{upg}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* No incluye (verdaderas exclusiones) */}
                {service.notIncludes && service.notIncludes.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 border-b border-stone-200/80 dark:border-stone-800 pb-2">
                      <span className="w-4 h-px bg-stone-400" />
                      <h3 className="text-xs uppercase font-space font-bold tracking-[0.2em] text-stone-400">
                        No incluye
                      </h3>
                    </div>
                    <ul className="space-y-1.5">
                      {service.notIncludes.map((ninc, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="mt-1 shrink-0 text-stone-400">
                            <Minus className="w-3 h-3" />
                          </div>
                          <span className="text-xs text-stone-500 dark:text-stone-400 leading-tight font-normal">{ninc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Servicios bajo cotización especial (A cotizar) */}
                {catalogItem.quotesOnlyFeatures && catalogItem.quotesOnlyFeatures.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 border-b border-stone-200/80 dark:border-stone-800 pb-2">
                      <span className="w-4 h-px bg-amber-500" />
                      <h3 className="text-xs uppercase font-space font-bold tracking-[0.2em] text-amber-700 dark:text-amber-400">
                        Disponibles a cotizar
                      </h3>
                    </div>
                    <ul className="space-y-1.5">
                      {catalogItem.quotesOnlyFeatures.map((qf, index) => (
                        <li key={index} className="flex items-start gap-2 text-stone-600 dark:text-stone-300">
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold shrink-0 mt-0.5">
                            Cotizar
                          </span>
                          <span className="text-xs leading-tight font-normal">{qf}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* 3. MUESTRAS DE REFERENCIA & ESTILOS DE AUTOR */}
            {matchingSamples.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-px bg-amber-500" />
                    <h3 className="text-xs uppercase font-space font-bold tracking-[0.2em] text-amber-700 dark:text-amber-400">
                      Muestras de Referencia & Inspiración
                    </h3>
                  </div>
                  <span className="text-[10px] font-space text-stone-500 dark:text-stone-400 font-medium">
                    {matchingSamples.length} {matchingSamples.length === 1 ? "estilo" : "estilos"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {matchingSamples.map((sample) => {
                    const isForCurrentPkg = sample.packageId === currentPkg?.id;
                    return (
                      <div
                        key={sample.id}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                          isForCurrentPkg
                            ? "bg-amber-500/10 border-amber-500/50 dark:bg-amber-500/5 dark:border-amber-500/40 shadow-xs"
                            : "bg-white dark:bg-stone-900 border-stone-200/90 dark:border-stone-800"
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-950 shrink-0 relative">
                            <img
                              src={sample.image}
                              alt={sample.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[9px] font-space uppercase px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-amber-700 dark:text-amber-400 font-bold truncate">
                                Paquete {sample.packageName}
                              </span>
                              {sample.colorHighlights && (
                                <div className="flex gap-0.5">
                                  {sample.colorHighlights.slice(0, 3).map((col, cIdx) => (
                                    <span key={cIdx} className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: col }} />
                                  ))}
                                </div>
                              )}
                            </div>
                            <h4 className="font-serif font-bold text-xs text-stone-900 dark:text-stone-100 truncate">
                              {sample.title}
                            </h4>
                            <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1 font-light">
                              {sample.conceptSubtitle}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => onViewSample && onViewSample(sample)}
                            className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px] font-space font-medium transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Ver muestra</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onOrder(service.type, sample.packageId, sample.title);
                              onClose();
                            }}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[11px] font-space transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Elegir estilo</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. EXPERIENCE LEVEL ADVICE */}
            <div className="bg-stone-100/70 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 flex items-start gap-3 mt-4">
              <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 font-space uppercase tracking-wider">
                  Nivel de Calidad: {service.difficulty}
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-normal font-normal mt-0.5">
                  Producido individualmente por V.A.C. Creative con diseño de autor y código optimizado para alta velocidad en smartphones.
                </p>
              </div>
            </div>

          </div>

          {/* ACTION BUTTON */}
          <div className="pt-8 border-t border-stone-200/80 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-xs text-stone-500 block uppercase font-mono tracking-wider">
                {currentPkg ? `Paquete ${currentPkg.name}` : "Servicio a cotizar"}
              </span>
              <span className="text-base font-bold text-amber-700 dark:text-amber-400 font-mono">
                {currentPrice != null ? `S/ ${currentPrice}` : "A cotizar"}
              </span>
            </div>

            <button
              onClick={() => {
                onOrder(service.type, currentPkg?.id);
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
