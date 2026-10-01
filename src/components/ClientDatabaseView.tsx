/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from "react";
import { Project } from "../types";
import { 
  Database, 
  Download, 
  Upload, 
  Users, 
  FileText, 
  Trash2, 
  Check, 
  AlertCircle,
  FolderOpen,
  Music,
  Image,
  Video,
  FileDown,
  Cloud,
  CloudCheck,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  X
} from "lucide-react";

interface ClientDatabaseViewProps {
  projects: Project[];
  onImportBackup: (imported: Project[]) => void;
  onClearAll: () => void;
  onSyncFirestore?: () => Promise<void>;
  onSeedFirestore?: () => Promise<void>;
  isFirestoreLive?: boolean;
}

export default function ClientDatabaseView({
  projects,
  onImportBackup,
  onClearAll,
  onSyncFirestore,
  onSeedFirestore,
  isFirestoreLive = true
}: ClientDatabaseViewProps) {
  
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive all contact/clients
  const clientsMap: Record<string, { name: string; phone: string; email: string; projectCount: number; typeList: string[] }> = {};
  
  projects.forEach(p => {
    const key = p.clientEmail.trim().toLowerCase() || p.clientName.trim().toLowerCase();
    if (!clientsMap[key]) {
      clientsMap[key] = {
        name: p.clientName,
        phone: p.clientPhone,
        email: p.clientEmail,
        projectCount: 0,
        typeList: []
      };
    }
    clientsMap[key].projectCount += 1;
    if (!clientsMap[key].typeList.includes(p.type)) {
      clientsMap[key].typeList.push(p.type);
    }
  });

  const uniqueClientsList = Object.values(clientsMap);

  // Compile multimedia assets registered across all client forms
  const mediaList: { id: string; clientName: string; type: "música" | "foto" | "video"; label: string; url: string }[] = [];
  
  projects.forEach(p => {
    if (p.weddingDetails) {
      if (p.weddingDetails.multimediaMusicaNombre) {
        mediaList.push({
          id: `${p.id}-music`,
          clientName: p.clientName,
          type: "música",
          label: p.weddingDetails.multimediaMusicaNombre,
          url: "#"
        });
      }
      p.weddingDetails.multimediaFotos.forEach((f, idx) => {
        mediaList.push({
          id: `${p.id}-photo-${idx}`,
          clientName: p.clientName,
          type: "foto",
          label: `Fotografía de Bodas #${idx + 1}`,
          url: f
        });
      });
      if (p.weddingDetails.youtubeUrl) {
        mediaList.push({
          id: `${p.id}-video-yt`,
          clientName: p.clientName,
          type: "video",
          label: "Video de Novios (YouTube)",
          url: p.weddingDetails.youtubeUrl
        });
      }
    }
    if (p.xvDetails) {
      if (p.xvDetails.musicaNombre) {
        mediaList.push({
          id: `${p.id}-xv-music`,
          clientName: p.clientName,
          type: "música",
          label: p.xvDetails.musicaNombre,
          url: "#"
        });
      }
      if (p.xvDetails.videoUrl) {
        mediaList.push({
          id: `${p.id}-xv-vid`,
          clientName: p.clientName,
          type: "video",
          label: "Video de Quinceañera",
          url: p.xvDetails.videoUrl
        });
      }
    }
    if (p.menuDetails) {
      if (p.menuDetails.logoUrl) {
        mediaList.push({
          id: `${p.id}-menu-logo`,
          clientName: p.clientName,
          type: "foto",
          label: `Logo de Empresa: ${p.menuDetails.businessName}`,
          url: p.menuDetails.logoUrl
        });
      }
    }
  });

  // Handle export JSON backup
  const handleExportBackup = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `VAC_Creative_Backup_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      
      setSuccessMsg("¡Base de datos exportada en formato JSON de forma exitosa!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch {
      setErrorMsg("No se pudo exportar la copia de seguridad.");
      setTimeout(() => setErrorMsg(""), 4000);
    }
  };

  // Handle import JSON file
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportBackup(parsed);
          setSuccessMsg("¡Base de datos importada y sincronizada con éxito!");
          setTimeout(() => setSuccessMsg(""), 4000);
        } else {
          setErrorMsg("El archivo seleccionado no tiene el formato de copia de seguridad compatible.");
          setTimeout(() => setErrorMsg(""), 4000);
        }
      } catch {
        setErrorMsg("Ocurrió un error al procesar el archivo JSON. Verifique su estructura.");
        setTimeout(() => setErrorMsg(""), 4000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleManualSync = async () => {
    if (!onSyncFirestore) return;
    setIsSyncing(true);
    try {
      await onSyncFirestore();
      setSuccessMsg("¡Sincronización exitosa con Firebase Firestore!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setErrorMsg("Ocurrió un error al sincronizar con la nube de Firebase.");
      setTimeout(() => setErrorMsg(""), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleManualSeed = async () => {
    if (!onSeedFirestore) return;
    setIsSyncing(true);
    try {
      await onSeedFirestore();
      setSuccessMsg("¡Datos de demostración cargados en Firebase Firestore!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setErrorMsg("Error al cargar datos semilla.");
      setTimeout(() => setErrorMsg(""), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-8 animate-in fade-in duration-200">
      
      {/* Upper header persistent tool status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white font-space">
                Base de Datos & Centro de Persistencia Cloud
              </h2>
              <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                isFirestoreLive 
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Firebase Firestore Activo
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Tus pedidos se guardan en la nube con Firebase Firestore y sincronización offline en LocalStorage.
            </p>
          </div>
        </div>

        {/* Export / Import triggers */}
        <div className="flex flex-wrap items-center gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImportFile} 
            accept=".json" 
            className="hidden" 
          />
          
          {onSyncFirestore && (
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>Sincronizar Cloud</span>
            </button>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-300 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-zinc-400" />
            Importar JSON
          </button>

          <button
            onClick={handleExportBackup}
            id="btn-export-database-backup"
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 rounded-lg text-xs font-semibold text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar JSON
          </button>
        </div>
      </div>

      {/* Cloud Info Card Banner */}
      <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <Cloud className="w-6 h-6 text-amber-500 shrink-0" />
          <div className="space-y-0.5">
            <span className="font-bold text-slate-800 dark:text-zinc-200">
              Colección Cloud: <code className="font-mono text-indigo-600 dark:text-indigo-400">/projects</code> ({projects.length} registros)
            </span>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              Conexión en tiempo real con escucha bidireccional mediante <code className="font-mono">onSnapshot</code> y respaldo local.
            </p>
          </div>
        </div>

        {onSeedFirestore && projects.length === 0 && (
          <button
            onClick={handleManualSeed}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cargar Proyectos Demo</span>
          </button>
        )}
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Grid: Clients summary & Multimedia assets repository */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CLIENTS DIRECTORY */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" />
              <h3 className="font-space font-bold text-sm text-zinc-900 dark:text-white">
                Directorio de Clientes ({uniqueClientsList.length})
              </h3>
            </div>
          </div>

          <div className="border border-zinc-200/80 dark:border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800 max-h-80 overflow-y-auto bg-slate-50/50 dark:bg-zinc-950/40">
            {uniqueClientsList.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-400">
                No hay clientes registrados en este momento.
              </div>
            ) : (
              uniqueClientsList.map((client, index) => (
                <div key={index} className="p-3 flex items-center justify-between text-xs hover:bg-white dark:hover:bg-zinc-900 transition-colors">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-zinc-200 block">{client.name}</span>
                    <span className="text-slate-400 dark:text-zinc-500 text-[11px] block">{client.phone} • {client.email}</span>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] font-bold">
                      {client.projectCount} {client.projectCount === 1 ? "pedido" : "pedidos"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* MULTIMEDIA CATALOG */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-amber-500" />
              <h3 className="font-space font-bold text-sm text-zinc-900 dark:text-white">
                Archivos Multimedia de Clientes ({mediaList.length})
              </h3>
            </div>
          </div>

          <div className="border border-zinc-200/80 dark:border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800 max-h-80 overflow-y-auto bg-slate-50/50 dark:bg-zinc-950/40">
            {mediaList.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-400">
                No hay enlaces multimedia cargados aún.
              </div>
            ) : (
              mediaList.map((media) => (
                <div key={media.id} className="p-3 flex items-center justify-between text-xs hover:bg-white dark:hover:bg-zinc-900 transition-colors">
                  <div className="flex items-center gap-2 truncate pr-2">
                    {media.type === "música" && <Music className="w-3.5 h-3.5 text-purple-500 shrink-0" />}
                    {media.type === "foto" && <Image className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                    {media.type === "video" && <Video className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                    <span className="truncate text-slate-700 dark:text-zinc-300">{media.label}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono uppercase shrink-0">
                    {media.clientName}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Dangerous Wipe Database trigger Block */}
      <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-red-650 dark:text-red-400 uppercase tracking-wider font-mono">ZONA DE MANTENIMIENTO</h4>
          <p className="text-[11px] text-zinc-400 leading-normal">
            Permite restaurar la base de datos o vaciarla para inicializar desde cero.
          </p>
        </div>

        {showWipeConfirm ? (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/40 p-2 rounded-xl border border-red-200 dark:border-red-900">
            <span className="text-xs font-bold text-red-700 dark:text-red-300">¿Confirmar vaciado total?</span>
            <button
              onClick={() => {
                onClearAll();
                setShowWipeConfirm(false);
                setSuccessMsg("Base de datos vaciada.");
                setTimeout(() => setSuccessMsg(""), 3000);
              }}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold cursor-pointer"
            >
              Sí, vaciar
            </button>
            <button
              onClick={() => setShowWipeConfirm(false)}
              className="px-2 py-1 text-zinc-600 dark:text-zinc-300 rounded-lg text-xs hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowWipeConfirm(true)}
            className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 hover:dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/30 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 text-nowrap"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Vaciar Base de Datos
          </button>
        )}
      </div>

    </div>
  );
}
