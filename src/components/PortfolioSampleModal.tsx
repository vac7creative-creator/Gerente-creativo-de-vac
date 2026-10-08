/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X, Sparkles, MessageCircle, ArrowRight, Eye, Palette, Check } from "lucide-react";
import { PortfolioItem } from "../data/portfolioCatalog";
import { ProjectType } from "../types";
import { CONTACT_CONFIG } from "../config/contact";
import { SERVICES_CATALOG_DATA } from "../data/servicesCatalog";

interface PortfolioSampleModalProps {
  item: PortfolioItem;
  onClose: () => void;
  onOrderWithStyle: (serviceType: ProjectType, packageId?: string, sampleTitle?: string) => void;
}

export default function PortfolioSampleModal({
  item,
  onClose,
  onOrderWithStyle
}: PortfolioSampleModalProps) {
  const serviceCatalog = SERVICES_CATALOG_DATA.find((s) => s.type === item.serviceType);
  const serviceTitle = serviceCatalog?.title || item.serviceType;

  const whatsappInquiryUrl = CONTACT_CONFIG.createWhatsAppUrl(
    CONTACT_CONFIG.getSampleInquiryMessage(item.title, serviceTitle, item.packageName)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        id="portfolio-sample-modal"
        className="relative max-w-4xl w-full bg-[#FAF9F5] dark:bg-[#121110] text-stone-900 dark:text-stone-100 rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 dark:border-stone-800 animate-fade-in flex flex-col md:flex-row max-h-[92vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white md:bg-stone-100 md:hover:bg-stone-200 md:text-stone-700 dark:md:bg-stone-800 dark:md:text-stone-200 transition-colors cursor-pointer"
          title="Cerrar vista de muestra"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT: Image Gallery Preview */}
        <div className="relative w-full md:w-1/2 h-72 md:h-auto min-h-[280px] md:min-h-[500px] overflow-hidden bg-stone-950">
          <img
            src={item.image}
            alt={item.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          {/* Badges on image */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="bg-stone-950/85 backdrop-blur-md text-amber-400 border border-amber-500/30 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider font-semibold">
              {serviceTitle}
            </span>
            <span className="bg-amber-500 text-stone-950 rounded-full px-2.5 py-1 font-space text-[10px] font-bold uppercase tracking-wider">
              Paquete {item.packageName}
            </span>
          </div>

          {/* Palette swatches on image */}
          {item.colorHighlights && item.colorHighlights.length > 0 && (
            <div className="absolute bottom-4 left-4 right-4 bg-stone-950/70 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-space text-stone-300 uppercase tracking-wider flex items-center gap-1.5 font-medium">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>Paleta de autor</span>
              </span>
              <div className="flex items-center gap-1.5">
                {item.colorHighlights.map((color, idx) => (
                  <span
                    key={idx}
                    className="w-5 h-5 rounded-full border border-white/30 shadow-xs"
                    style={{ backgroundColor: color }}
                    title={`Color: ${color}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Content & Actions */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] uppercase font-space tracking-[0.25em] text-amber-700 dark:text-amber-400 font-bold block mb-1">
                Muestra de Referencia V.A.C.
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 dark:text-stone-50 tracking-tight leading-tight">
                {item.title}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-400 mt-1">
                {item.conceptSubtitle}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] uppercase font-space font-bold tracking-wider text-stone-500 dark:text-stone-400 block">
                Concepto & Dirección de Arte
              </span>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-light">
                {item.description}
              </p>
            </div>

            {/* Note on bespoke tailoring */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-stone-700 dark:text-stone-300 space-y-1">
              <div className="flex items-center gap-1.5 font-space font-bold text-amber-800 dark:text-amber-300 text-[11px] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Diseño 100% Personalizado</span>
              </div>
              <p className="text-[11px] leading-relaxed text-stone-600 dark:text-stone-300 font-light">
                No vendemos plantillas idénticas. Esta muestra sirve como guía estética y nivel de acabado para construir un proyecto a la medida de tu identidad o celebración.
              </p>
            </div>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] uppercase font-space font-bold tracking-wider text-stone-500 dark:text-stone-400 block">
                  Características Destacadas
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[11px] font-space px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-6 border-t border-stone-200/80 dark:border-stone-800 space-y-2.5 mt-6">
            <button
              type="button"
              onClick={() => {
                onOrderWithStyle(item.serviceType, item.packageId, item.title);
                onClose();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold font-space text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Iniciar Proyecto con este Estilo</span>
            </button>

            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-6 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800 font-space text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Consultar Asesor por WhatsApp</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
