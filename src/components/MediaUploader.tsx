/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { 
  Upload, 
  X, 
  File, 
  Image as ImageIcon, 
  Film, 
  Music, 
  Link as LinkIcon, 
  Check, 
  AlertCircle,
  Loader2,
  HardDrive,
  ExternalLink,
  Trash2
} from "lucide-react";
import { ProjectMediaFile, PendingUploadFile, ProjectType } from "../types";

interface MediaUploaderProps {
  serviceType: ProjectType;
  existingFiles?: ProjectMediaFile[];
  onChangeExistingFiles?: (files: ProjectMediaFile[]) => void;
  // For backwards compatibility:
  files?: ProjectMediaFile[];
  onChangeFiles?: (files: ProjectMediaFile[]) => void;
  pendingFiles: PendingUploadFile[];
  onChangePendingFiles: (files: PendingUploadFile[]) => void;
  googleDriveUrl: string;
  onChangeGoogleDriveUrl: (url: string) => void;
  isUploading?: boolean;
}

export function getMediaSectionTitle(type: ProjectType): string {
  switch (type) {
    case ProjectType.BODA:
      return "Fotografías de los novios y material de la invitación";
    case ProjectType.XV_ANOS:
      return "Fotografías de la quinceañera";
    case ProjectType.DISENO_GRAFICO:
      return "Logotipo actual, referencias y material de marca";
    case ProjectType.SPOT:
      return "Guion, audios y referencias";
    case ProjectType.FOTO_VIDEO:
      return "Videos, audios, fotografías y material audiovisual";
    case ProjectType.CARTA_DIGITAL:
      return "Logo, fotografías de productos y carta actual";
    case ProjectType.CUMPLEANOS:
      return "Fotografías del festejado y referencias";
    case ProjectType.LANDING_PAGE:
      return "Manual de marca, logotipo y contenido de la web";
    default:
      return "Fotografías y material del proyecto";
  }
}

export default function MediaUploader({
  serviceType,
  existingFiles = [],
  onChangeExistingFiles,
  files = [],
  onChangeFiles,
  pendingFiles,
  onChangePendingFiles,
  googleDriveUrl,
  onChangeGoogleDriveUrl,
  isUploading = false
}: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normalize existing files list
  const currentExistingFiles = existingFiles.length > 0 ? existingFiles : files;
  const updateExistingFiles = onChangeExistingFiles || onChangeFiles || (() => {});

  const sectionTitle = getMediaSectionTitle(serviceType);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      pendingFiles.forEach((p) => {
        if (p.previewUrl && p.previewUrl.startsWith("blob:")) {
          try {
            URL.revokeObjectURL(p.previewUrl);
          } catch {
            // ignore
          }
        }
      });
    };
  }, []);

  const handleFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles || incomingFiles.length === 0) return;
    setUploadError("");

    const fileList = Array.from(incomingFiles);
    const newPendingItems: PendingUploadFile[] = [];

    for (const file of fileList) {
      // 50MB max limit per direct upload file
      if (file.size > 50 * 1024 * 1024) {
        setUploadError(`El archivo "${file.name}" supera los 50MB. Para archivos muy pesados, te recomendamos usar el enlace directo de Google Drive abajo.`);
        continue;
      }

      // Check if already added
      const alreadyExists = pendingFiles.some((p) => p.name === file.name && p.size === file.size);
      if (alreadyExists) continue;

      let previewUrl = "";
      if (file.type.startsWith("image/")) {
        try {
          previewUrl = URL.createObjectURL(file);
        } catch {
          previewUrl = "";
        }
      }

      newPendingItems.push({
        id: `pending_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        file,
        previewUrl,
        name: file.name,
        size: file.size,
        type: file.type,
        status: "pending"
      });
    }

    if (newPendingItems.length > 0) {
      onChangePendingFiles([...pendingFiles, ...newPendingItems]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removePendingFile = (id: string) => {
    const itemToRemove = pendingFiles.find((p) => p.id === id);
    if (itemToRemove && itemToRemove.previewUrl && itemToRemove.previewUrl.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(itemToRemove.previewUrl);
      } catch {
        // ignore
      }
    }
    onChangePendingFiles(pendingFiles.filter((p) => p.id !== id));
  };

  const removeExistingFile = (id: string) => {
    updateExistingFiles(currentExistingFiles.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type?: string) => {
    if (!type) return <File className="w-5 h-5 text-stone-400" />;
    if (type.startsWith("image/")) return <ImageIcon className="w-5 h-5 text-amber-500" />;
    if (type.startsWith("video/")) return <Film className="w-5 h-5 text-purple-500" />;
    if (type.startsWith("audio/")) return <Music className="w-5 h-5 text-blue-500" />;
    return <File className="w-5 h-5 text-stone-400" />;
  };

  const totalFilesCount = currentExistingFiles.length + pendingFiles.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-5 h-px bg-amber-500" />
          <h3 className="text-xs uppercase font-space font-bold tracking-[0.2em] text-amber-700 dark:text-amber-400">
            {sectionTitle}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-stone-500 bg-stone-100 dark:bg-stone-800/80 px-2 py-0.5 rounded-md">
            {totalFilesCount} {totalFilesCount === 1 ? "archivo" : "archivos"}
          </span>
        </div>
      </div>

      {uploadError && (
        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{uploadError}</span>
        </div>
      )}

      {/* DRAG & DROP ZONE (Supports Multiple Files) */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-7 text-center transition-all ${
          isUploading
            ? "opacity-50 cursor-not-allowed border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/30"
            : isDragging
            ? "border-amber-500 bg-amber-500/10 scale-[0.99] cursor-pointer"
            : "border-stone-300 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-900/40 hover:border-amber-400 dark:hover:border-amber-500/60 cursor-pointer"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.zip,.rar,.psd,.ai"
          className="hidden"
          disabled={isUploading}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2.5">
          <Upload className="w-6 h-6" />
        </div>
        <p className="text-sm font-space font-bold text-stone-900 dark:text-stone-100">
          Arrastra o selecciona tus archivos aquí
        </p>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Selección múltiple de imágenes, fotos en alta resolución, audios o documentos
        </p>
        <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-medium">
          <HardDrive className="w-3.5 h-3.5" />
          <span>Se organizarán automáticamente en tu carpeta de Google Drive</span>
        </div>
      </div>

      {/* PENDING FILES (SELECTED LOCALLY, READY TO UPLOAD TO DRIVE) */}
      {pendingFiles.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Archivos seleccionados ({pendingFiles.length})
            </span>
            <span className="text-[11px] text-stone-400">
              Se subirán al guardar el pedido
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {pendingFiles.map((item) => {
              const isImage = item.type.startsWith("image/") && item.previewUrl;
              return (
                <div
                  key={item.id}
                  className="relative group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-2.5 flex flex-col justify-between shadow-xs overflow-hidden transition-all"
                >
                  <div className="w-full h-24 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 flex items-center justify-center relative">
                    {isImage ? (
                      <img
                        src={item.previewUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getFileIcon(item.type)
                    )}

                    {/* Status Overlay */}
                    {item.status === "uploading" && (
                      <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-[1px] flex flex-col items-center justify-center text-amber-400 gap-1">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-[10px] font-mono font-medium">Subiendo...</span>
                      </div>
                    )}

                    {item.status === "success" && (
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-mono flex items-center gap-1 shadow-xs">
                        <Check className="w-2.5 h-2.5" /> Subido
                      </div>
                    )}

                    {item.status === "error" && (
                      <div className="absolute inset-0 bg-red-950/70 flex flex-col items-center justify-center text-red-200 p-2 text-center">
                        <AlertCircle className="w-4 h-4 text-red-400 mb-1" />
                        <span className="text-[9px] leading-tight font-medium">
                          {item.errorMessage || "Error al subir"}
                        </span>
                      </div>
                    )}

                    {!isUploading && item.status !== "uploading" && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removePendingFile(item.id);
                        }}
                        className="absolute top-1 right-1 p-1 rounded-full bg-stone-950/75 text-white hover:bg-red-600 transition-colors cursor-pointer"
                        title="Quitar de la lista"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="pt-2 px-0.5">
                    <p className="text-xs font-medium text-stone-800 dark:text-stone-200 truncate" title={item.name}>
                      {item.name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-stone-400 font-mono">
                        {formatFileSize(item.size)}
                      </span>
                      <span className={`text-[10px] font-mono ${
                        item.status === "success" ? "text-emerald-500" :
                        item.status === "error" ? "text-red-500" :
                        item.status === "uploading" ? "text-amber-500 animate-pulse" :
                        "text-stone-400"
                      }`}>
                        {item.status === "success" ? "✓ Drive" :
                         item.status === "uploading" ? "Subiendo" :
                         item.status === "error" ? "Error" :
                         "Pendiente"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ALREADY UPLOADED FILES IN PROJECT */}
      {currentExistingFiles.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-stone-200/60 dark:border-stone-800/60">
          <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Archivos guardados en Google Drive ({currentExistingFiles.length})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {currentExistingFiles.map((file) => {
              const isImage = file.type?.startsWith("image/") || (!file.type && /\.(jpe?g|png|webp|gif)$/i.test(file.name));
              return (
                <div
                  key={file.id}
                  className="relative group bg-white dark:bg-stone-900 border border-emerald-500/20 dark:border-emerald-500/30 rounded-2xl p-2.5 flex flex-col justify-between shadow-xs overflow-hidden"
                >
                  <div className="w-full h-24 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 flex items-center justify-center relative">
                    {isImage && file.url && !file.url.startsWith("data:") ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // If preview fails due to permissions, show icon
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      getFileIcon(file.type)
                    )}

                    <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-mono flex items-center gap-1 shadow-xs">
                      <Check className="w-2.5 h-2.5" /> Drive
                    </div>

                    {!isUploading && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeExistingFile(file.id);
                        }}
                        className="absolute top-1 right-1 p-1 rounded-full bg-stone-950/75 text-white hover:bg-red-600 transition-colors cursor-pointer"
                        title="Eliminar referencia"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="pt-2 px-0.5">
                    <p className="text-xs font-medium text-stone-800 dark:text-stone-200 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-stone-400 font-mono">
                        {formatFileSize(file.size)}
                      </span>
                      {file.url && (
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5"
                          title="Abrir en Google Drive"
                        >
                          Ver <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* GOOGLE DRIVE / DROPBOX FOLDER LINK (OPTIONAL) */}
      <div className="p-4 bg-stone-50 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
        <div className="flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">
            Tengo un enlace a carpeta en Google Drive o Dropbox (Opcional)
          </label>
        </div>
        <input
          type="url"
          value={googleDriveUrl}
          onChange={(e) => onChangeGoogleDriveUrl(e.target.value)}
          placeholder="https://drive.google.com/drive/folders/..."
          disabled={isUploading}
          className="w-full h-11 px-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs font-mono text-stone-900 dark:text-stone-100 focus:ring-1 focus:ring-amber-500 focus:outline-none"
        />
        <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-normal">
          Si ya tienes una carpeta con videos 4K, sesiones de fotos o material extenso, puedes compartir el enlace con permisos de lectura.
        </p>
      </div>
    </div>
  );
}
