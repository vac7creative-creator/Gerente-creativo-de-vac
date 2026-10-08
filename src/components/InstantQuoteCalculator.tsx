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
  Smartphone,
  Music,
  Camera,
  QrCode,
  Zap
} from "lucide-react";
import { ProjectType } from "../types";
import { SERVICES_CATALOG_DATA, ServiceCatalogItem, PackageItem, isFeatureActive } from "../data/servicesCatalog";
import { CONTACT_CONFIG } from "../config/contact";

interface InstantQuoteCalculatorProps {
  onSelectServiceAndStartOrder: (type: ProjectType, prefilledNotes?: string, packageId?: string) => void;
}

export default function InstantQuoteCalculator({
  onSelectServiceAndStartOrder
}: InstantQuoteCalculatorProps) {
  const [selectedType, setSelectedType] = useState<ProjectType>(ProjectType.BODA);
  const [selectedPackageId, setSelectedPackageId] = useState<string>("basico");
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const currentCatalogItem: ServiceCatalogItem = SERVICES_CATALOG_DATA.find((s) => s.type === selectedType) || SERVICES_CATALOG_DATA[0];
  const packages: PackageItem[] = currentCatalogItem.packages || [];
  const currentPackage = packages.find((p) => p.id === selectedPackageId) || packages[0];
  const variants = currentCatalogItem.variants || [];
  const currentVariant = variants.find((v) => v.id === selectedVariantId) || variants[0];

  // When selectedType changes, reset package to first available and filter incompatible addons
  useEffect(() => {
    if (currentCatalogItem.packages.length > 0) {
      setSelectedPackageId(currentCatalogItem.packages[0].id);
    }
    if (currentCatalogItem.variants && currentCatalogItem.variants.length > 0) {
      setSelectedVariantId(currentCatalogItem.variants[0].id);
    } else {
      setSelectedVariantId("");
    }
    const validAddonIds = currentCatalogItem.addons.map((a) => a.id);
    setSelectedAddons((prev) => prev.filter((id) => validAddonIds.includes(id)));
  }, [selectedType]);

  const basePricePEN = currentPackage?.priceInPEN ?? (currentCatalogItem.packages[0]?.priceInPEN ?? 0);

  // Calculate extras: DO NOT double charge if included in package!
  const addonsTotalPEN = selectedAddons.reduce((sum, id) => {
    const isIncluded = isFeatureActive(id, currentPackage, []);
    if (isIncluded) return sum; // S/ 0 extra
    const addon = currentCatalogItem.addons.find((a) => a.id === id);
    return sum + (addon ? addon.priceInPEN : 0);
  }, 0);

  const displayedTotalPrice = basePricePEN + addonsTotalPEN;

  const toggleAddon = (id: string) => {
    if (isFeatureActive(id, currentPackage, [])) return; // Already included
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter((item) => item !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  const handleStartOrder = () => {
    const validPaidAddonNames = selectedAddons
      .filter((id) => !isFeatureActive(id, currentPackage, []))
      .map((id) => currentCatalogItem.addons.find((a) => a.id === id)?.label)
      .filter(Boolean)
      .join(", ");

    const variantText = currentVariant ? ` [Variante: ${currentVariant.label}]` : "";
    const notes = `Cotización en V.A.C. Creative: ${currentCatalogItem.title}${variantText} (Paquete: ${currentPackage?.name}). Inversión: S/ ${displayedTotalPrice}. Extras adicionales: ${validPaidAddonNames || "Ninguno"}.`;
    onSelectServiceAndStartOrder(selectedType, notes, currentPackage?.id);
  };

  const handleContactWhatsApp = () => {
    const validPaidAddonNames = selectedAddons
      .filter((id) => !isFeatureActive(id, currentPackage, []))
      .map((id) => currentCatalogItem.addons.find((a) => a.id === id)?.label)
      .filter(Boolean)
      .join(", ");

    const variantText = currentVariant ? ` [Variante: ${currentVariant.label}]` : "";
    const message = `¡Hola V.A.C. Creative! 👋 Deseo cotizar *${currentCatalogItem.title}*${variantText} en el paquete *${currentPackage?.name}* con un estimado de *S/ ${displayedTotalPrice}*.\n\n*Extras elegidos:* ${validPaidAddonNames || "Paquete base"}.\n*Tiempo estimado de entrega:* ${currentPackage?.delivery || currentCatalogItem.deliveryTime}.\n\n¿Podrían brindarme asesoría para iniciar mi proyecto?`;
    window.open(CONTACT_CONFIG.createWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-white dark:bg-[#141311] border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 animate-fade-in">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200/60 dark:border-stone-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-400">
              Cotizador Inteligente · V.A.C. Creative
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 dark:text-stone-50 tracking-[-0.03em]">
            Calcula la Inversión de tu Proyecto
          </h3>
          <p className="text-sm text-stone-600 dark:text-stone-300 font-normal">
            Tarifas oficiales en Soles peruanos (S/) según el nivel de paquete y extras que necesites.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Service Picker & Packages & Addons (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* 1. SELECCIÓN DEL SERVICIO */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-space uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                1. Selecciona el Tipo de Proyecto
              </label>
              <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
                Precios en Soles (S/)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICES_CATALOG_DATA.map((service) => {
                const isSelected = service.type === selectedType;
                const startingPrice = service.packages[0]?.priceInPEN;

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
                        <span className={`text-sm font-serif font-bold ${isSelected ? "text-amber-900 dark:text-amber-300" : "text-stone-900 dark:text-stone-100"}`}>
                          {service.title}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 dark:text-stone-300 font-normal mt-1 line-clamp-2">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs font-mono">
                      <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {service.deliveryTime}
                      </span>
                      <span className="font-bold text-stone-900 dark:text-stone-100">
                        {startingPrice != null ? `Desde S/ ${startingPrice}` : "A cotizar"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1B. SELECCIÓN DE VARIANTE (SI APLICA, EJ. SPOT / LOCUCIÓN) */}
          {variants.length > 0 && (
            <div className="space-y-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
              <label className="text-xs font-bold font-space uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                Formato o Variante del Servicio
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {variants.map((v) => {
                  const isSelected = v.id === (currentVariant?.id || variants[0].id);
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-amber-500 text-stone-950 border-amber-500 font-bold shadow-sm"
                          : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-400"
                      }`}
                    >
                      <span className="text-xs block font-serif font-bold">{v.label}</span>
                      <span className={`text-[11px] block mt-1 leading-tight font-normal ${isSelected ? "text-stone-900" : "text-stone-500 dark:text-stone-400"}`}>
                        {v.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. SELECCIÓN DE PAQUETE */}
          {packages.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs font-bold font-space uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                2. Elige el Nivel de Paquete ({currentCatalogItem.title})
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {packages.map((pkg) => {
                  const isSelected = pkg.id === selectedPackageId;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                        isSelected
                          ? "border-amber-500 bg-amber-500/10 shadow-sm font-bold"
                          : "border-stone-200 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-900/40 hover:border-stone-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-space uppercase tracking-wider">{pkg.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                      </div>
                      <span className="text-base font-mono font-bold block text-stone-900 dark:text-stone-100">
                        S/ {pkg.priceInPEN}
                      </span>
                      <p className="text-[11px] text-stone-500 font-normal">{pkg.delivery}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. EXTRAS ESPECÍFICOS DEL SERVICIO */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-space uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                3. Personaliza con Extras Opcionales
              </label>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                Opcional
              </span>
            </div>

            <div className="space-y-2.5">
              {currentCatalogItem.addons.map((addon) => {
                const isIncluded = isFeatureActive(addon.id, currentPackage, []);
                const isChecked = isIncluded || selectedAddons.includes(addon.id);

                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isIncluded
                        ? "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10 cursor-default"
                        : isChecked
                          ? "border-amber-500/80 bg-amber-500/5 dark:bg-amber-500/10"
                          : "border-stone-200 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-900/40 hover:border-stone-300 dark:hover:border-stone-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                        isChecked
                          ? isIncluded ? "bg-emerald-600 border-emerald-600 text-white" : "bg-amber-500 border-amber-500 text-stone-950"
                          : "border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <span className="text-sm font-serif font-bold text-stone-900 dark:text-stone-100 block">
                          {addon.label}
                        </span>
                        <p className="text-xs text-stone-600 dark:text-stone-300 font-normal leading-relaxed">
                          {addon.description}
                        </p>
                      </div>
                    </div>

                    <span className={`text-xs font-mono font-bold shrink-0 px-2.5 py-1 rounded-lg ${
                      isIncluded
                        ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 uppercase text-[10px]"
                        : "text-amber-700 dark:text-amber-400"
                    }`}>
                      {isIncluded ? "Incluido" : `+ S/ ${addon.priceInPEN}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. SERVICIOS BAJO COTIZACIÓN ESPECIAL (A COTIZAR) */}
          {currentCatalogItem.quotesOnlyFeatures && currentCatalogItem.quotesOnlyFeatures.length > 0 && (
            <div className="space-y-3 p-4 bg-stone-100/60 dark:bg-stone-900/40 rounded-2xl border border-stone-200 dark:border-stone-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold font-space uppercase tracking-wider text-stone-600 dark:text-stone-300 block">
                  Servicios Adicionales (A Cotizar)
                </label>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold">
                  Bajo Pedido
                </span>
              </div>
              <ul className="space-y-2">
                {currentCatalogItem.quotesOnlyFeatures.map((qf, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-stone-600 dark:text-stone-300 font-normal">
                    <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                    <span>{qf}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-stone-500 italic pt-1">
                Puedes indicar estos requerimientos especiales en las notas del formulario o consultarnos por WhatsApp.
              </p>
            </div>
          )}

        </div>

        {/* Right Side: Dynamic Summary & Actions (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-stone-50 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
            
            <div className="space-y-2 border-b border-stone-200 dark:border-stone-800 pb-4">
              <span className="text-xs font-space font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                Resumen de Inversión
              </span>
              <h4 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-50">
                {currentCatalogItem.title}
              </h4>
              {currentVariant && (
                <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                  Variante: <strong className="text-stone-900 dark:text-stone-100">{currentVariant.label}</strong>
                </p>
              )}
              <p className="text-xs text-stone-600 dark:text-stone-300 font-normal">
                Paquete: <strong className="text-stone-900 dark:text-stone-100">{currentPackage?.name}</strong> · Entrega: <strong className="text-stone-900 dark:text-stone-100">{currentPackage?.delivery || currentCatalogItem.deliveryTime}</strong>
              </p>
            </div>

            {/* Price breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-stone-700 dark:text-stone-300">
                <span>Precio Base ({currentPackage?.name})</span>
                <span className="font-mono font-semibold">S/ {basePricePEN}</span>
              </div>

              {selectedAddons.filter(id => !currentPackage?.includedFeatureIds.includes(id)).length > 0 && (
                <div className="space-y-2 pt-2 border-t border-stone-200/60 dark:border-stone-800/60">
                  <span className="text-xs font-bold text-stone-600 dark:text-stone-400 block uppercase font-space">
                    Extras Seleccionados
                  </span>
                  {selectedAddons
                    .filter(id => !currentPackage?.includedFeatureIds.includes(id))
                    .map((id) => {
                      const addon = currentCatalogItem.addons.find((a) => a.id === id);
                      if (!addon) return null;
                      return (
                        <div key={id} className="flex items-center justify-between text-stone-600 dark:text-stone-300 text-xs">
                          <span className="truncate pr-2">• {addon.label}</span>
                          <span className="font-mono shrink-0">+ S/ {addon.priceInPEN}</span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Total display */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 dark:text-stone-400 uppercase font-space font-bold block">
                  Inversión Total Estimada
                </span>
                <span className="text-xs text-stone-400 font-light">
                  Tarifa neta en Soles
                </span>
              </div>
              <div className="text-right">
                <span className="font-serif font-bold text-3xl sm:text-4xl text-stone-950 dark:text-stone-50">
                  S/ {displayedTotalPrice}
                </span>
              </div>
            </div>

            {/* Dynamic Included Benefits */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold font-space uppercase tracking-wider text-stone-800 dark:text-stone-200 block">
                Beneficios Incluidos ({currentPackage?.name}):
              </span>
              <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300 font-normal">
                {currentPackage?.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action buttons */}
            <div className="space-y-3 pt-4">
              <button
                type="button"
                onClick={handleStartOrder}
                className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-stone-950 font-bold font-space text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
              >
                <span>Llenar Formulario con esta Cotización</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleContactWhatsApp}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-space text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Consultar por WhatsApp</span>
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
