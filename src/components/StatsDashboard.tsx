/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Briefcase, 
  Clock, 
  Palette, 
  Eye, 
  CheckCircle, 
  Users,
  Search,
  Plus,
  Compass,
  Sparkles,
  Database
} from "lucide-react";
import { Project, ProjectStatus } from "../types";

interface StatsDashboardProps {
  projects: Project[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedTypeFilter: string;
  setSelectedTypeFilter: (val: string) => void;
  onNewProjectClick: () => void;
  onOpenDatabaseClick: () => void;
  isDatabaseOpen: boolean;
}

export default function StatsDashboard({
  projects,
  searchTerm,
  setSearchTerm,
  selectedTypeFilter,
  setSelectedTypeFilter,
  onNewProjectClick,
  onOpenDatabaseClick,
  isDatabaseOpen
}: StatsDashboardProps) {
  
  // Calculate analytics
  const total = projects.length;
  const pending = projects.filter(p => p.status === ProjectStatus.PENDIENTE).length;
  const enDiseno = projects.filter(p => p.status === ProjectStatus.EN_DISENO || (p.status as string) === "En Diseño").length;
  const enRevision = projects.filter(p => p.status === ProjectStatus.EN_REVISION).length;
  const entregados = projects.filter(p => p.status === ProjectStatus.ENTREGADO || p.status === ProjectStatus.APROBADO).length;
  
  const uniqueClients = new Set(projects.map(p => p.clientName.trim().toLowerCase())).size;

  const serviceTypes = [
    "Todos",
    "Invitación Virtual de Boda",
    "Invitación Virtual de 15 Años",
    "Invitación Virtual de Cumpleaños",
    "Carta / Menú Digital",
    "Spot Publicitario",
    "Fotografía y Video",
    "Diseño Gráfico",
    "Landing Page",
    "Otro"
  ];

  return (
    <div className="space-y-8">
      {/* Upper Brand Info & Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200/80 dark:border-stone-800 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-space font-bold uppercase tracking-[0.25em] text-amber-700 dark:text-amber-400">
              Consola Maestra de Dirección · Vlad01
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-950 dark:text-stone-50 tracking-tight">
            Gestión Ejecutiva de Proyectos
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 font-light max-w-xl">
            Control de briefs de clientes, estados de producción, generación de prompts IA para desarrollo y sincronización con Firebase Firestore.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDatabaseClick}
            id="btn-client-database"
            className={`px-4 py-2.5 rounded-full font-space font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer border ${
              isDatabaseOpen 
              ? "bg-amber-500 text-stone-950 border-amber-500 shadow-md"
              : "bg-white hover:bg-stone-50 text-stone-800 dark:bg-stone-900 dark:hover:bg-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-800"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isDatabaseOpen ? "Ver Cuadrícula" : "Base de Datos & Clientes"}</span>
          </button>

          <button
            onClick={onNewProjectClick}
            id="btn-new-project-main"
            className="px-5 py-2.5 bg-stone-950 hover:bg-stone-850 text-white dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-stone-950 font-space font-bold text-xs uppercase tracking-wider rounded-full flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nuevo Proyecto</span>
          </button>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total */}
        <div className="p-5 rounded-3xl border border-stone-200/80 bg-white shadow-xs dark:bg-[#141311] dark:border-stone-800 space-y-3">
          <span className="text-[10px] font-space font-bold uppercase tracking-wider text-stone-400 block">Total Proyectos</span>
          <div>
            <p className="text-3xl font-serif font-bold text-stone-950 dark:text-white">{total}</p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-light mt-0.5">En base de datos</p>
          </div>
        </div>

        {/* Pendientes */}
        <div className="p-5 rounded-3xl border border-stone-200/80 bg-white shadow-xs dark:bg-[#141311] dark:border-stone-800 space-y-3">
          <span className="text-[10px] font-space font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">Pendientes</span>
          <div>
            <p className="text-3xl font-serif font-bold text-amber-600 dark:text-amber-400">{pending}</p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-light mt-0.5">Esperando datos</p>
          </div>
        </div>

        {/* En diseño */}
        <div className="p-5 rounded-3xl border border-stone-200/80 bg-white shadow-xs dark:bg-[#141311] dark:border-stone-800 space-y-3">
          <span className="text-[10px] font-space font-bold uppercase tracking-wider text-stone-400 block">En Diseño</span>
          <div>
            <p className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">{enDiseno}</p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-light mt-0.5">Fase de armado</p>
          </div>
        </div>

        {/* En revisión */}
        <div className="p-5 rounded-3xl border border-stone-200/80 bg-white shadow-xs dark:bg-[#141311] dark:border-stone-800 space-y-3">
          <span className="text-[10px] font-space font-bold uppercase tracking-wider text-stone-400 block">En Revisión</span>
          <div>
            <p className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">{enRevision}</p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-light mt-0.5">Boceto con cliente</p>
          </div>
        </div>

        {/* Entregados */}
        <div className="p-5 rounded-3xl border border-stone-200/80 bg-white shadow-xs dark:bg-[#141311] dark:border-stone-800 space-y-3">
          <span className="text-[10px] font-space font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">Entregados</span>
          <div>
            <p className="text-3xl font-serif font-bold text-emerald-600 dark:text-emerald-400">{entregados}</p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-light mt-0.5">Lanzamiento activo</p>
          </div>
        </div>

        {/* Clientes Únicos */}
        <div className="p-5 rounded-3xl border border-stone-200/80 bg-white shadow-xs dark:bg-[#141311] dark:border-stone-800 space-y-3">
          <span className="text-[10px] font-space font-bold uppercase tracking-wider text-stone-400 block">Clientes</span>
          <div>
            <p className="text-3xl font-serif font-bold text-stone-950 dark:text-white">{uniqueClients}</p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-light mt-0.5">Contactos registrados</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-[#141311] border border-stone-200/80 dark:border-stone-800 p-4 rounded-2xl">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, teléfono, email, iglesia, salón o platillo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-xl text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400 font-space shrink-0">Categoría:</span>
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-xl text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer font-space"
          >
            {serviceTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
