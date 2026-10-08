/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, Mail, Image, Video, Volume2, Palette, Globe, Utensils } from "lucide-react";
import { ProjectType } from "../types";
import { SERVICES_CATALOG } from "../data/servicesCatalog";
import { ServiceItem } from "./ServicePreviewModal";

interface CategoryQuickBarProps {
  onSelectService: (service: ServiceItem) => void;
  onSelectProjectType?: (type: ProjectType) => void;
}

interface QuickCategoryItem {
  id: string;
  label: string;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
  serviceId?: string;
  projectType: ProjectType;
}

const QUICK_CATEGORIES: QuickCategoryItem[] = [
  {
    id: "invitacion-boda",
    label: "Invitación Boda",
    tag: "RSVP & Música",
    icon: Mail,
    serviceId: "boda",
    projectType: ProjectType.BODA
  },
  {
    id: "invitacion-xv",
    label: "15 Años",
    tag: "Estrellas & Cuenta Regresiva",
    icon: Sparkles,
    serviceId: "xv-anos",
    projectType: ProjectType.XV_ANOS
  },
  {
    id: "flyer-multimedia",
    label: "Flyer / Arte",
    tag: "24-48h · Redes",
    icon: Image,
    serviceId: "artes-multimedia",
    projectType: ProjectType.ARTES_MULTIMEDIA
  },
  {
    id: "spot-publicitario",
    label: "Spot Comercial",
    tag: "Locutor & Audio",
    icon: Volume2,
    serviceId: "spot-publicitario",
    projectType: ProjectType.SPOT
  },
  {
    id: "video-audiovisual",
    label: "Video & Reel",
    tag: "Corte Cinemático",
    icon: Video,
    serviceId: "produccion-audiovisual",
    projectType: ProjectType.FOTO_VIDEO
  },
  {
    id: "branding-marca",
    label: "Branding",
    tag: "Logos Vectoriales",
    icon: Palette,
    serviceId: "branding",
    projectType: ProjectType.DISENO_GRAFICO
  },
  {
    id: "web-landing",
    label: "Página Web",
    tag: "Landing Comercial",
    icon: Globe,
    serviceId: "landing-page",
    projectType: ProjectType.LANDING_PAGE
  },
  {
    id: "carta-menu",
    label: "Carta Digital",
    tag: "Menú Gourmet & Pedidos",
    icon: Utensils,
    serviceId: "carta-digital",
    projectType: ProjectType.CARTA_DIGITAL
  }
];

export default function CategoryQuickBar({ onSelectService, onSelectProjectType }: CategoryQuickBarProps) {
  const handleClick = (cat: QuickCategoryItem) => {
    // Si tiene un serviceId en el catálogo, abrimos directamente su ficha
    if (cat.serviceId) {
      const found = SERVICES_CATALOG.find((s) => s.id === cat.serviceId);
      if (found) {
        onSelectService(found);
        return;
      }
    }

    // Como fallback notificamos el tipo de proyecto
    if (onSelectProjectType) {
      onSelectProjectType(cat.projectType);
    }
  };

  return (
    <div className="w-full space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <h2 className="text-xs sm:text-sm font-space font-bold uppercase tracking-[0.2em] text-stone-900 dark:text-stone-100">
            ¿Qué quieres crear?
          </h2>
        </div>
        <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono hidden sm:inline">
          Acceso directo a fichas & paquetes
        </span>
      </div>

      {/* Franja horizontal con scroll suave en móviles */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-stone-300 dark:scrollbar-thumb-stone-800 -mx-4 px-4 sm:mx-0 sm:px-0">
        {QUICK_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => handleClick(cat)}
              className="group shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#141311] border border-stone-200/80 dark:border-stone-800/80 hover:border-amber-500/60 dark:hover:border-amber-400/60 shadow-sm hover:shadow-md transition-all cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-stone-950 transition-all">
                <Icon className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-space font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 block whitespace-nowrap transition-colors">
                  {cat.label}
                </span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400 font-mono block whitespace-nowrap">
                  {cat.tag}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
