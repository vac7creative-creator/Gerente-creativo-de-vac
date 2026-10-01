/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Project, ProjectStatus, ProjectType } from "./types";
import { seedProjects } from "./utils/promptGenerators";

// Firebase Services
import { 
  subscribeToProjects, 
  saveProjectToFirestore, 
  deleteProjectFromFirestore, 
  syncAllProjectsToFirestore, 
  testConnection,
  signOutAdmin,
  cleanCompromisedAdminRecord
} from "./firebase";

// Components
import StatsDashboard from "./components/StatsDashboard";
import ProjectCard from "./components/ProjectCard";
import ProjectForm from "./components/ProjectForm";
import ProjectSummary from "./components/ProjectSummary";
import AIPromptGenerator from "./components/AIPromptGenerator";
import ClientDatabaseView from "./components/ClientDatabaseView";
import ServicePreviewModal from "./components/ServicePreviewModal";
import InstantQuoteCalculator from "./components/InstantQuoteCalculator";
import AdminLoginModal from "./components/AdminLoginModal";

// Data
import { SERVICES_CATALOG, MAIN_CATEGORIES } from "./data/servicesCatalog";

// Icons
import { 
  Moon, 
  Sun, 
  Sparkles, 
  Users, 
  FolderOpen, 
  LayoutGrid, 
  Check, 
  AlertCircle, 
  Search, 
  Lock, 
  LogOut, 
  Compass, 
  Briefcase, 
  MessageCircle, 
  ArrowRight, 
  Cloud, 
  X,
  Palette,
  Video,
  Volume2,
  Smartphone,
  ChevronRight,
  ShieldCheck,
  Flame,
  HelpCircle,
  Star
} from "lucide-react";

const LOCAL_STORAGE_KEY = "vac_creative_manager_projects";
const THEME_STORAGE_KEY = "vac_creative_theme";

export default function App() {
  // --- STATE ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("Todos");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("Todos");
  
  // Cloud Firestore Status
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(true);
  const [isSyncingWithCloud, setIsSyncingWithCloud] = useState<boolean>(false);

  // Authentication State for Admin Console
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);

  // Toast Notification State
  const [toastNotification, setToastNotification] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    setToastNotification({ message, type });
    setTimeout(() => {
      setToastNotification(null);
    }, 3500);
  };
  
  // Modals / Overlays triggers
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
  const [activeSummaryProject, setActiveSummaryProject] = useState<Project | undefined>(undefined);
  const [activePromptProject, setActivePromptProject] = useState<Project | undefined>(undefined);
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(false);

  // Client view Navigation Tabs
  const [clientTab, setClientTab] = useState<"catalog" | "quote" | "tracker">("catalog");

  // View Mode: Client vs Admin
  const [viewMode, setViewMode] = useState<"client" | "admin">("client");
  const [selectedServiceForPreview, setSelectedServiceForPreview] = useState<any | null>(null);
  
  // Progress tracker inputs
  const [progressEmailInput, setProgressEmailInput] = useState("");
  const [trackResultText, setTrackResultText] = useState("");
  const [trackedProjects, setTrackedProjects] = useState<Project[] | null>(null);

  // --- ACTIONS & PERSISTENCE EFFECTS ---

  // 1. Theme Configuration
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const isDark = savedTheme === "dark";
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }

    // Check if admin is logged in this browser session
    const adminSession = sessionStorage.getItem("vac_admin_logged");
    if (adminSession === "true") {
      setIsAdminAuthenticated(true);
    }
  }, []);

  // 2. Firebase Firestore & Admin Initialization
  useEffect(() => {
    // A. Clean up old compromised credentials from Firestore if any exist
    cleanCompromisedAdminRecord().catch(() => {});

    // B. First load cached data immediately for instant speed
    const savedProjects = localStorage.getItem(LOCAL_STORAGE_KEY);
    let initialList: Project[] = [];
    if (savedProjects) {
      try {
        initialList = JSON.parse(savedProjects);
        setProjects(initialList);
      } catch (err) {
        console.error("Error reading projects from localStorage.", err);
      }
    }

    // C. Test connection
    testConnection().then((connected) => {
      setIsFirestoreConnected(connected);
    });

    // D. Subscribe to Firestore
    setIsSyncingWithCloud(true);
    const unsubscribe = subscribeToProjects(
      (firestoreProjects) => {
        setIsSyncingWithCloud(false);
        setIsFirestoreConnected(true);
        if (firestoreProjects && firestoreProjects.length > 0) {
          setProjects(firestoreProjects);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(firestoreProjects));
        } else {
          const listToSeed = initialList.length > 0 ? initialList : seedProjects;
          setProjects(listToSeed);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(listToSeed));
          syncAllProjectsToFirestore(listToSeed).catch((err) => {
            console.warn("Could not initial-seed Firestore", err);
          });
        }
      },
      (error) => {
        console.warn("Firestore subscription fallback to local storage cache:", error);
        setIsSyncingWithCloud(false);
        setIsFirestoreConnected(false);
        if (initialList.length === 0) {
          setProjects(seedProjects);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seedProjects));
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Save projects locally and to Firestore
  const saveProjectsToStorage = (updatedList: Project[]) => {
    setProjects(updatedList);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
  };

  // Toggle App Theme (Light/Dark mode)
  const toggleTheme = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    if (nextTheme) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      localStorage.setItem(THEME_STORAGE_KEY, "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      localStorage.setItem(THEME_STORAGE_KEY, "light");
    }
  };

  // Switch to admin view with security check
  const handleToggleAdminView = () => {
    if (viewMode === "admin") {
      setViewMode("client");
    } else {
      if (isAdminAuthenticated) {
        setViewMode("admin");
      } else {
        setLoginModalOpen(true);
      }
    }
  };

  const handleAdminLogout = async () => {
    await signOutAdmin();
    sessionStorage.removeItem("vac_admin_logged");
    localStorage.removeItem("vac_admin_user");
    setIsAdminAuthenticated(false);
    setViewMode("client");
    showToast("Sesión de administrador cerrada en Firebase Auth", "info");
  };

  // Helper: Create/Update project
  const handleSaveProject = async (updatedProj: Project) => {
    const index = projects.findIndex(p => p.id === updatedProj.id);
    let newList = [...projects];

    if (index >= 0) {
      newList[index] = updatedProj;
    } else {
      newList = [updatedProj, ...newList];
    }

    saveProjectsToStorage(newList);
    setFormModalOpen(false);
    setEditingProject(undefined);

    try {
      await saveProjectToFirestore(updatedProj);
      showToast(index >= 0 ? "Proyecto actualizado en Firebase" : "¡Nuevo proyecto guardado en Firebase!");
    } catch (err) {
      console.warn("Error saving to Firestore", err);
      showToast("Guardado localmente (Offline)", "info");
    }
  };

  // Delete project
  const handleDeleteProject = async (projId: string) => {
    const filtered = projects.filter(p => p.id !== projId);
    saveProjectsToStorage(filtered);

    try {
      await deleteProjectFromFirestore(projId);
      showToast("Proyecto eliminado de Firebase", "info");
    } catch (err) {
      console.warn("Error deleting from Firestore", err);
      showToast("Eliminado localmente", "info");
    }
  };

  // Change individual project status directly inside card dropdown click
  const handleStatusChange = async (id: string, newStatus: ProjectStatus) => {
    const target = projects.find(p => p.id === id);
    if (!target) return;

    const updated = { ...target, status: newStatus, updatedAt: new Date().toISOString() };
    const newList = projects.map(p => (p.id === id ? updated : p));
    saveProjectsToStorage(newList);

    try {
      await saveProjectToFirestore(updated);
      showToast(`Estado cambiado a: ${newStatus}`);
    } catch (err) {
      console.warn("Error updating status in Firestore", err);
      showToast(`Estado actualizado localmente a: ${newStatus}`, "info");
    }
  };

  // Track client progress in real-time
  const handleTrackProgress = (e: React.FormEvent) => {
    e.preventDefault();
    const query = progressEmailInput.trim().toLowerCase();
    if (!query) {
      setTrackResultText("Por favor, introduce tu correo, teléfono o código para buscar.");
      setTrackedProjects([]);
      return;
    }
    const found = projects.filter(p => 
      p.clientEmail.toLowerCase().includes(query) || 
      p.clientPhone.toLowerCase().includes(query) ||
      p.clientName.toLowerCase().includes(query) ||
      p.id.toLowerCase().includes(query)
    );
    if (found.length === 0) {
      setTrackResultText("No encontramos solicitudes activas con ese criterio. Prueba con otro email o haz un pedido.");
      setTrackedProjects([]);
    } else {
      setTrackResultText("");
      setTrackedProjects(found);
    }
  };

  // Helper to open the registration form with a pre-selected project type & notes
  const handleStartNewOrder = (type: ProjectType, prefilledNotes?: string) => {
    setEditingProject({
      id: "",
      clientName: "",
      clientPhone: "",
      clientEmail: "",
      type: type,
      status: ProjectStatus.PENDIENTE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      generalNotes: prefilledNotes || ""
    });
    setFormModalOpen(true);
  };

  // Database actions callbacks
  const handleImportBackup = async (importedList: Project[]) => {
    saveProjectsToStorage(importedList);
    try {
      await syncAllProjectsToFirestore(importedList);
      showToast("Copia de seguridad importada y sincronizada en Firebase");
    } catch (err) {
      console.warn("Could not batch sync backup to Firestore", err);
      showToast("Respaldo guardado en almacenamiento local", "info");
    }
  };

  const handleClearAll = () => {
    saveProjectsToStorage([]);
    showToast("Base de datos local vaciada", "info");
  };

  const handleManualSyncFirestore = async () => {
    await syncAllProjectsToFirestore(projects);
  };

  const handleManualSeedFirestore = async () => {
    await syncAllProjectsToFirestore(seedProjects);
    saveProjectsToStorage(seedProjects);
  };

  // Trigger edit modal
  const handleStartEdit = (proj: Project) => {
    setEditingProject(proj);
    setFormModalOpen(true);
  };

  // --- FILTERS & SEARCH EVALUATOR ---
  const filteredProjects = projects.filter(proj => {
    const typeMatches = selectedTypeFilter === "Todos" || proj.type === selectedTypeFilter;
    const statusMatches = selectedStatusFilter === "Todos" || proj.status === selectedStatusFilter;

    const normalizedQuery = searchTerm.toLowerCase().trim();
    let matchesSearch = true;
    
    if (normalizedQuery) {
      const fieldName = proj.clientName.toLowerCase();
      const fieldId = proj.id.toLowerCase();
      const fieldEmail = proj.clientEmail.toLowerCase();
      const fieldPhone = proj.clientPhone.toLowerCase();
      const fieldNotes = proj.generalNotes ? proj.generalNotes.toLowerCase() : "";
      
      let specificMatch = false;
      if (proj.weddingDetails) {
        specificMatch = proj.weddingDetails.novioName.toLowerCase().includes(normalizedQuery) ||
                        proj.weddingDetails.noviaName.toLowerCase().includes(normalizedQuery) ||
                        proj.weddingDetails.ceremoniaIglesia.toLowerCase().includes(normalizedQuery) ||
                        proj.weddingDetails.recepcionLocal.toLowerCase().includes(normalizedQuery);
      } else if (proj.xvDetails) {
        specificMatch = proj.xvDetails.quinceaneraName.toLowerCase().includes(normalizedQuery) ||
                        proj.xvDetails.lugar.toLowerCase().includes(normalizedQuery) ||
                        proj.xvDetails.tematica.toLowerCase().includes(normalizedQuery);
      } else if (proj.menuDetails) {
        specificMatch = proj.menuDetails.businessName.toLowerCase().includes(normalizedQuery) ||
                        proj.menuDetails.address.toLowerCase().includes(normalizedQuery) ||
                        proj.menuDetails.items.some(i => i.name.toLowerCase().includes(normalizedQuery) || i.description.toLowerCase().includes(normalizedQuery));
      }

      matchesSearch = fieldName.includes(normalizedQuery) || 
                      fieldId.includes(normalizedQuery) || 
                      fieldEmail.includes(normalizedQuery) || 
                      fieldPhone.includes(normalizedQuery) || 
                      fieldNotes.includes(normalizedQuery) ||
                      specificMatch;
    }

    return typeMatches && statusMatches && matchesSearch;
  });

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-[#0C0B0A] text-stone-100" : "bg-[#FAF8F5] text-stone-900"} transition-colors duration-200`}>
      
      {/* Toast Notification */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="px-5 py-3 rounded-2xl shadow-2xl border border-stone-800 bg-stone-950 text-stone-100 dark:bg-stone-900 dark:border-stone-700 flex items-center gap-3 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>{toastNotification.message}</span>
            <button 
              onClick={() => setToastNotification(null)}
              className="ml-3 text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* LUXURY EDITORIAL HEADER BAR */}
      <nav className="border-b border-stone-200/70 bg-[#FAF8F5]/90 dark:bg-[#0C0B0A]/90 dark:border-stone-800/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Atelier Brand Logo */}
          <div className="flex items-center gap-4">
            <img 
              src="https://res.cloudinary.com/dcnynnstm/image/upload/v1768607132/VAC_Creatuve_LOGO_fzyvbn.png"
              alt="V.A.C. Creative Logo"
              referrerPolicy="no-referrer"
              className="w-11 h-11 object-contain rounded-xl bg-white p-1 shadow-sm border border-stone-200/80 dark:border-stone-800"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold tracking-tight text-stone-950 dark:text-stone-50 text-xl">
                  V.A.C. Creative
                </span>
                <span className="text-[9px] tracking-[0.25em] font-space font-bold uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                  ATELIER
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-light hidden sm:block">
                Experiencias Digitales & Diseño Web de Alta Costura
              </p>
            </div>
          </div>

          {/* Controls & Mode Switcher */}
          <div className="flex items-center gap-3">
            
            {/* Cloud Status Pill */}
            <div 
              title="Base de datos Firestore sincronizada en tiempo real"
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-[11px] font-mono text-stone-600 dark:text-stone-300"
            >
              <span className={`w-2 h-2 rounded-full ${isFirestoreConnected ? "bg-amber-500 animate-pulse" : "bg-stone-400"}`} />
              <Cloud className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{isSyncingWithCloud ? "Sincronizando..." : "Firestore Cloud"}</span>
            </div>

            {/* Direct WhatsApp Concierge */}
            <a
              href="https://wa.me/525512345678?text=Hola%20V.A.C.%20Creative,%20deseo%20asesor%C3%ADa%20personalizada%20para%20un%20proyecto"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800 text-xs font-space font-medium transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Concierge Studio</span>
            </a>

            {/* Mode Switcher with Security */}
            {viewMode === "admin" ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("client")}
                  className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 text-xs font-space font-medium transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Ver Portal Cliente</span>
                </button>
                <button
                  onClick={handleAdminLogout}
                  title="Cerrar sesión de administrador"
                  className="p-2 rounded-full bg-red-500/10 text-red-600 hover:bg-red-500/20 border border-red-500/20 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleToggleAdminView}
                id="view-mode-toggle"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold font-space uppercase tracking-wider transition-all border cursor-pointer bg-stone-950 text-white hover:bg-stone-850 dark:bg-amber-400 dark:text-stone-950 dark:border-amber-400 shadow-sm"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400 dark:text-stone-950" />
                <span>Consola Admin</span>
              </button>
            )}

            {/* Dark & Light toggle buttons */}
            <button
              onClick={toggleTheme}
              id="theme-toggler-btn"
              className="p-2.5 rounded-full bg-white hover:bg-stone-100 dark:bg-stone-900 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-800 transition-colors cursor-pointer"
              title="Cambiar Modo visual (Claro/Oscuro)"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-700" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* VIEW CONDITIONAL STREAM */}
      {viewMode === "client" ? (
        /* HIGH-END EDITORIAL CLIENT EXPERIENCE */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16 animate-fade-in">
          
          {/* HIGH-END EDITORIAL HERO SPREAD */}
          <div className="relative overflow-hidden bg-white text-stone-900 dark:bg-gradient-to-br dark:from-stone-950 dark:via-[#161412] dark:to-stone-950 dark:text-stone-100 rounded-3xl p-8 sm:p-12 md:p-16 border border-stone-200/80 dark:border-stone-800 shadow-xl shadow-stone-200/40 dark:shadow-2xl">
            
            {/* Background subtle art mark */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-[0.03] dark:opacity-5 pointer-events-none select-none hidden lg:block overflow-hidden">
              <span className="font-serif text-[18rem] leading-none text-stone-950 dark:text-white italic">V</span>
            </div>

            <div className="max-w-3xl space-y-6 relative z-10">
              
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-space font-bold uppercase tracking-[0.25em] text-amber-700 dark:text-amber-400">
                  V.A.C. Creative Atelier · Edición 2026
                </span>
                <span className="h-px w-10 bg-amber-600/40 dark:bg-amber-500/50" />
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-stone-950 dark:text-white tracking-tight leading-[1.05]">
                Invitaciones Digitales <br />
                <span className="font-normal italic text-amber-600 dark:text-amber-400">de Alta Costura</span>
              </h1>

              <p className="text-stone-600 dark:text-stone-300 text-sm md:text-lg font-light leading-relaxed max-w-2xl">
                Diseñadas con precisión arquitectónica y tipografía refinada. Experiencias móviles que integran música autoejecutable, confirmación RSVP fluida a WhatsApp y mapas de navegación para bodas, celebraciones exclusivas y marcas de autor.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={() => setClientTab("catalog")}
                  className="px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold font-space text-xs uppercase tracking-[0.2em] rounded-full transition-all shadow-lg shadow-amber-500/15 cursor-pointer flex items-center gap-2"
                >
                  <span>Explorar Colección</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setClientTab("quote")}
                  className="px-7 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-300 dark:bg-stone-900/90 dark:hover:bg-stone-800 dark:text-stone-100 dark:border-stone-700 font-bold font-space text-xs uppercase tracking-[0.2em] rounded-full transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Cotizador Instantáneo</span>
                </button>
              </div>

              {/* Editorial Highlights */}
              <div className="pt-8 border-t border-stone-200/80 dark:border-stone-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-stone-600 dark:text-stone-300 font-light">
                <div className="space-y-1">
                  <span className="font-serif text-amber-700 dark:text-amber-400 text-base italic block">01. Enlace Web Propio</span>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">Carga ultra-rápida optimizada para smartphones y redes sociales.</p>
                </div>
                <div className="space-y-1">
                  <span className="font-serif text-amber-700 dark:text-amber-400 text-base italic block">02. RSVP Directo</span>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">Confirmación de pases estructurada directamente a tu chat de WhatsApp.</p>
                </div>
                <div className="space-y-1">
                  <span className="font-serif text-amber-700 dark:text-amber-400 text-base italic block">03. Banda Sonora</span>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">Música de fondo elegida para ambientar la experiencia desde el primer toque.</p>
                </div>
              </div>

            </div>
          </div>

          {/* EDITORIAL SUB-NAVIGATION TABS */}
          <div className="flex items-center justify-start gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-4 overflow-x-auto">
            <button
              onClick={() => setClientTab("catalog")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold font-space uppercase tracking-[0.15em] transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                clientTab === "catalog"
                  ? "bg-stone-950 text-white dark:bg-amber-400 dark:text-stone-950 shadow-md"
                  : "bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white border border-stone-200 dark:border-stone-800"
              }`}
            >
              <span>Colección & Modelos</span>
            </button>

            <button
              onClick={() => setClientTab("quote")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold font-space uppercase tracking-[0.15em] transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                clientTab === "quote"
                  ? "bg-stone-950 text-white dark:bg-amber-400 dark:text-stone-950 shadow-md"
                  : "bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white border border-stone-200 dark:border-stone-800"
              }`}
            >
              <span>Cotizador en Vivo</span>
            </button>

            <button
              onClick={() => setClientTab("tracker")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold font-space uppercase tracking-[0.15em] transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                clientTab === "tracker"
                  ? "bg-stone-950 text-white dark:bg-amber-400 dark:text-stone-950 shadow-md"
                  : "bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white border border-stone-200 dark:border-stone-800"
              }`}
            >
              <span>Rastreo de Proyecto</span>
            </button>
          </div>

          {/* TAB 1: CATALOGO DE INVITACIONES & SERVICIOS */}
          {clientTab === "catalog" && (
            <div className="space-y-16 animate-fade-in">
              
              {/* Sección Principal de Modelos Digitales */}
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-space font-bold uppercase tracking-[0.25em] text-amber-700 dark:text-amber-400">
                      Invitaciones Digitales · Modelos Interactivos
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-950 dark:text-stone-50 tracking-tight">
                      Colección para Momentos Trascendentes
                    </h2>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-light max-w-sm">
                    Selecciona una plantilla para explorar la anatomía del diseño, itinerario y solicitar tu proyecto.
                  </p>
                </div>

                {/* Grid Editorial de Modelos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {SERVICES_CATALOG.map((service, idx) => (
                    <div 
                      key={service.id}
                      onClick={() => setSelectedServiceForPreview(service)}
                      id={`service-block-${service.id}`}
                      className="group bg-white dark:bg-[#141311] border border-stone-200/80 dark:border-stone-800/80 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:border-amber-500/50 transition-all duration-500 flex flex-col justify-between"
                    >
                      {/* Photo Area with luxury zoom */}
                      <div className="relative h-64 overflow-hidden bg-stone-950">
                        <img 
                          src={service.image} 
                          alt={service.title} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        <div className="absolute top-4 left-4 bg-stone-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider font-semibold">
                          {service.deliveryTime}
                        </div>

                        <div className="absolute bottom-4 left-4 right-4">
                          <span className="text-[10px] uppercase font-space tracking-[0.2em] text-stone-300 font-medium">
                            Serie {String(idx + 1).padStart(2, "0")}
                          </span>
                          <h3 className="font-serif font-bold text-white text-2xl tracking-tight leading-tight">
                            {service.title}
                          </h3>
                        </div>
                      </div>

                      {/* Details Area */}
                      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                        <p className="text-xs text-stone-600 dark:text-stone-400 font-light leading-relaxed line-clamp-2">
                          {service.subtitle}
                        </p>

                        <div className="pt-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs font-space">
                          <span className="text-stone-400 dark:text-stone-500 text-[11px]">
                            {service.includes.length} prestaciones incluidas
                          </span>
                          <span className="text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                            Ver Ficha →
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SERVICIOS COMPLEMENTARIOS: PRODUCCIÓN & BRANDING */}
              <div className="space-y-8 pt-8 border-t border-stone-200/80 dark:border-stone-800">
                <div className="space-y-1">
                  <span className="text-[10px] font-space font-bold uppercase tracking-[0.25em] text-amber-700 dark:text-amber-400">
                    Servicios de Producción
                  </span>
                  <h2 className="text-3xl font-serif font-bold text-stone-950 dark:text-stone-50 tracking-tight">
                    Dirección de Arte & Multimedia
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {MAIN_CATEGORIES.filter(c => !c.isSubCatalogTrigger).map((cat) => (
                    <div 
                      key={cat.id}
                      onClick={() => setSelectedServiceForPreview(cat)}
                      className="group bg-white dark:bg-[#141311] border border-stone-200/80 dark:border-stone-800/80 rounded-3xl p-6 cursor-pointer shadow-sm hover:shadow-lg hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between space-y-6"
                    >
                      <div className="space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                          {cat.iconName === "Palette" && <Palette className="w-5 h-5" />}
                          {cat.iconName === "Video" && <Video className="w-5 h-5" />}
                          {cat.iconName === "Volume2" && <Volume2 className="w-5 h-5" />}
                          {cat.iconName === "Sparkles" && <Sparkles className="w-5 h-5" />}
                          {cat.iconName === "Smartphone" && <Smartphone className="w-5 h-5" />}
                        </div>

                        <div className="space-y-1.5">
                          <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                            {cat.title}
                          </h3>
                          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-3 font-light leading-relaxed">
                            {cat.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs font-space font-medium text-stone-500 dark:text-stone-400">
                        <span>{cat.deliveryTime}</span>
                        <span className="text-amber-700 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                          Detalles →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: COTIZADOR INSTANTANEO EN VIVO */}
          {clientTab === "quote" && (
            <div className="space-y-6 animate-fade-in">
              <InstantQuoteCalculator
                onSelectServiceAndStartOrder={(type, notes) => {
                  handleStartNewOrder(type, notes);
                }}
              />
            </div>
          )}

          {/* TAB 3: CONSULTA DE AVANCE EN TIEMPO REAL */}
          {clientTab === "tracker" && (
            <div className="bg-white dark:bg-[#141311] border border-stone-200/80 dark:border-stone-800/80 rounded-3xl p-6 md:p-10 space-y-8 animate-fade-in shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200/60 dark:border-stone-800">
                <div className="space-y-1">
                  <span className="text-[10px] font-space font-bold uppercase tracking-[0.25em] text-amber-700 dark:text-amber-400">
                    Seguimiento Privado de Proyecto
                  </span>
                  <h3 className="font-serif font-bold text-2xl md:text-3xl text-stone-900 dark:text-stone-100">
                    Consulta el Estado de tu Invitación
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-light">
                    Introduce el correo electrónico, teléfono o ID de proyecto proporcionado al registrarte.
                  </p>
                </div>

                <form onSubmit={handleTrackProgress} className="flex gap-2 max-w-md w-full">
                  <input 
                    type="text" 
                    value={progressEmailInput}
                    onChange={(e) => setProgressEmailInput(e.target.value)}
                    placeholder="tucorreo@ejemplo.com o teléfono..."
                    className="flex-1 px-4 py-2.5 text-xs bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button 
                    type="submit" 
                    id="search-progress-btn"
                    className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-stone-950 font-bold font-space text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Buscar</span>
                  </button>
                </form>
              </div>

              {/* Messages */}
              {trackResultText && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{trackResultText}</span>
                </div>
              )}

              {/* Tracked Projects Results */}
              {trackedProjects && trackedProjects.length > 0 ? (
                <div className="space-y-8 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-[0.2em] font-space text-amber-700 dark:text-amber-400">
                    Proyectos Activos Vinculados ({trackedProjects.length})
                  </h4>
                  
                  {trackedProjects.map((proj) => {
                    const getStatusStepIndex = (status: ProjectStatus) => {
                      switch (status) {
                        case ProjectStatus.PENDIENTE: return 0;
                        case ProjectStatus.EN_DISENO: return 1;
                        case ProjectStatus.EN_REVISION: return 2;
                        case ProjectStatus.APROBADO: return 3;
                        case ProjectStatus.ENTREGADO: return 4;
                        default: return 0;
                      }
                    };

                    const currentIdx = getStatusStepIndex(proj.status);

                    const steps = [
                      { title: "Recibido", desc: "Briefing registrado en cola del diseñador." },
                      { title: "En Diseño", desc: "Composición tipográfica, música e imágenes." },
                      { title: "Borrador Revisión", desc: "Boceto interactivo compartido para feedback." },
                      { title: "Aprobado", desc: "Validación de dirección y pases completada." },
                      { title: "Listo / Entregado", desc: "Enlace final autodesplegado online." }
                    ];

                    return (
                      <div 
                        key={proj.id} 
                        className="bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 md:p-8 space-y-6"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200/60 dark:border-stone-800 pb-4">
                          <div>
                            <span className="text-[10px] uppercase font-mono text-amber-700 dark:text-amber-400 font-bold block mb-1">
                              {proj.type} · ID: {proj.id}
                            </span>
                            <h4 className="font-serif font-bold text-stone-900 dark:text-stone-50 text-2xl">
                              Ficha de {proj.clientName}
                            </h4>
                          </div>
                          <div className="text-left sm:text-right">
                            <span className="text-[11px] text-stone-400 block font-light">
                              Última modificación: {new Date(proj.updatedAt || proj.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-xs uppercase font-space font-extrabold text-amber-700 dark:text-amber-400">
                              Estado: {proj.status}
                            </span>
                          </div>
                        </div>

                        {/* Visual Step Progress */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 pt-2">
                          {steps.map((st, stepIdx) => {
                            const isVisited = currentIdx >= stepIdx;
                            const isCurrent = currentIdx === stepIdx;
                            
                            return (
                              <div key={stepIdx} className="space-y-2 relative">
                                <div className="flex items-center gap-2">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                                    isVisited
                                    ? "bg-amber-500 text-stone-950 shadow-sm font-space"
                                    : "bg-stone-200 dark:bg-stone-800 text-stone-400"
                                  } ${isCurrent ? "ring-4 ring-amber-500/25" : ""}`}>
                                    {stepIdx + 1}
                                  </div>
                                  {stepIdx < 4 && (
                                    <div className={`hidden md:block flex-1 h-0.5 ${
                                      currentIdx > stepIdx ? "bg-amber-500" : "bg-stone-200 dark:bg-stone-800"
                                    }`} />
                                  )}
                                </div>
                                <div>
                                  <span className={`text-xs font-bold block leading-tight font-space uppercase ${isVisited ? "text-stone-900 dark:text-stone-100" : "text-stone-400"}`}>
                                    {st.title}
                                  </span>
                                  <span className="text-[11px] text-stone-500 dark:text-stone-400 font-light mt-0.5 block leading-normal">
                                    {st.desc}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Actions */}
                        <div className="pt-4 border-t border-stone-200/60 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
                          <a
                            href={`https://wa.me/525512345678?text=${encodeURIComponent(`Hola V.A.C. Creative, deseo consultar una duda sobre mi proyecto ${proj.type} (ID: ${proj.id}) de ${proj.clientName}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-800 dark:hover:bg-stone-700 rounded-xl text-xs font-space font-bold flex items-center gap-2 transition-all"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
                            <span>Contactar Asesor por este Pedido</span>
                          </a>

                          <button
                            onClick={() => setActiveSummaryProject(proj)}
                            className="px-4 py-2 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-space font-bold tracking-wide transition-all cursor-pointer"
                          >
                            Ver Resumen del Briefing Completo
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              ) : trackedProjects && trackedProjects.length === 0 ? (
                <div className="p-10 border border-dashed border-stone-200 dark:border-stone-800 rounded-3xl text-center bg-stone-50/50 dark:bg-stone-900/50">
                  <HelpCircle className="w-8 h-8 mx-auto text-stone-400 mb-2" />
                  <p className="text-xs font-bold text-stone-700 dark:text-stone-300">Ningún resultado activo encontrado</p>
                  <p className="text-[11px] text-stone-400 mt-1">Verifique el número de teléfono o correo registrado en su pedido.</p>
                </div>
              ) : (
                <div className="text-center p-6 text-stone-400 text-xs font-light">
                  Ingresa tu correo o teléfono registrado para visualizar tu avance en tiempo real.
                </div>
              )}
            </div>
          )}

          {/* EDITORIAL REVIEWS & TESTIMONIALS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            <div className="p-8 bg-white dark:bg-[#141311] border border-stone-200/80 dark:border-stone-800/80 rounded-3xl space-y-3 shadow-sm">
              <span className="text-amber-500 font-serif text-lg tracking-widest block">★★★★★</span>
              <p className="text-xs text-stone-600 dark:text-stone-300 font-light leading-relaxed">
                "La música autoejecutable de nuestra invitación de Bodas sorprendió a todos los invitados. Fue un deleite ver las confirmaciones de asistencia organizadas al instante por WhatsApp."
              </p>
              <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest font-space">
                — Sofía & Alejandro · Novios V.A.C.
              </p>
            </div>
            <div className="p-8 bg-white dark:bg-[#141311] border border-stone-200/80 dark:border-stone-800/80 rounded-3xl space-y-3 shadow-sm">
              <span className="text-amber-500 font-serif text-lg tracking-widest block">★★★★★</span>
              <p className="text-xs text-stone-600 dark:text-stone-300 font-light leading-relaxed">
                "Hicimos la de 15 años para mi hija con lluvia de estrellas animada y el dress code sugerido. El contador de días creó una expectativa inmensa en toda la familia."
              </p>
              <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest font-space">
                — Mariana R. · Quinceañera Atelier
              </p>
            </div>
            <div className="p-8 bg-white dark:bg-[#141311] border border-stone-200/80 dark:border-stone-800/80 rounded-3xl space-y-3 shadow-sm">
              <span className="text-amber-500 font-serif text-lg tracking-widest block">★★★★★</span>
              <p className="text-xs text-stone-600 dark:text-stone-300 font-light leading-relaxed">
                "El menú gastronómico digital se ve espectacular en el celular. Los clientes envían comandas instantáneas y nos ahorró miles de pesos en reimpresiones de cartas de papel."
              </p>
              <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest font-space">
                — Chef Eduardo M. · Bistro Gourmet
              </p>
            </div>
          </div>

        </div>
      ) : (
        /* CONSOLA DE ADMINISTRADOR (EXECUTIVE ATELIER CONSOLE) */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in-up">
          
          {/* Executive Security Status Bar */}
          <div className="p-4 bg-stone-900 text-stone-100 dark:bg-stone-900 border border-stone-800 rounded-2xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                Sesión autenticada en <strong>Firebase Auth</strong> ({localStorage.getItem("vac_admin_user") || "Administrador V.A.C."}) · Base de datos <strong>Firestore</strong> en tiempo real ({projects.length} proyectos).
              </span>
            </div>
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button 
                onClick={() => setViewMode("client")}
                className="text-amber-400 hover:text-amber-300 font-space text-xs font-bold tracking-wider uppercase cursor-pointer"
              >
                Ver Portal Cliente →
              </button>
              <button
                onClick={handleAdminLogout}
                className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-medium cursor-pointer"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Core analytic cards & filters */}
          <StatsDashboard
            projects={projects}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedTypeFilter={selectedTypeFilter}
            setSelectedTypeFilter={setSelectedTypeFilter}
            isDatabaseOpen={isDatabaseOpen}
            onOpenDatabaseClick={() => setIsDatabaseOpen(!isDatabaseOpen)}
            onNewProjectClick={() => {
              setEditingProject(undefined);
              setFormModalOpen(true);
            }}
          />

          {/* Dynamic Display: Choose between traditional grid and Database management console */}
          {isDatabaseOpen ? (
            <ClientDatabaseView
              projects={projects}
              onImportBackup={handleImportBackup}
              onClearAll={handleClearAll}
              onSyncFirestore={handleManualSyncFirestore}
              onSeedFirestore={handleManualSeedFirestore}
              isFirestoreLive={isFirestoreConnected}
            />
          ) : (
            <div className="space-y-6">
              
              {/* Filters index switcher */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-stone-400" />
                  <h3 className="font-serif font-bold text-lg tracking-tight text-stone-900 dark:text-stone-100">
                    Proyectos Registrados ({filteredProjects.length})
                  </h3>
                </div>

                {/* Status selectors filter */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-stone-400 font-space">Estado:</span>
                  <div className="flex gap-1 flex-wrap">
                    {["Todos", ...Object.values(ProjectStatus)].map((status) => (
                      <button
                        key={status}
                        onClick={() => setSelectedStatusFilter(status)}
                        className={`text-xs px-3 py-1 rounded-full transition-colors font-medium border cursor-pointer font-space ${
                          selectedStatusFilter === status
                            ? "bg-stone-900 border-stone-900 text-white dark:bg-amber-400 dark:border-amber-400 dark:text-stone-950"
                            : "bg-white border-stone-200 hover:bg-stone-50 text-stone-600 dark:bg-stone-900 dark:border-stone-800 dark:text-stone-400 dark:hover:bg-stone-800"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Core Project Cards grid layout */}
              {filteredProjects.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center border border-dashed border-stone-300 dark:border-stone-800 rounded-3xl p-6 bg-white dark:bg-stone-900 text-center text-stone-400 space-y-2">
                  <Compass className="w-8 h-8 text-stone-300 animate-pulse" />
                  <p className="text-sm font-semibold">Ningún pedido coincide con los filtros de búsqueda.</p>
                  <p className="text-xs max-w-sm">Pruebe limpiando las palabras clave o registre un nuevo proyecto para este cliente en el botón "+ Nuevo Proyecto".</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((p) => (
                    <ProjectCard
                      key={p.id}
                      project={p}
                      onEdit={handleStartEdit}
                      onDelete={handleDeleteProject}
                      onViewSummary={(proj) => setActiveSummaryProject(proj)}
                      onGeneratePrompts={(proj) => setActivePromptProject(proj)}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* LUXURY EDITORIAL FOOTER */}
      <footer className="border-t border-stone-200/60 dark:border-stone-900 bg-white/50 dark:bg-[#0C0B0A] py-12 text-xs text-stone-500 text-center space-y-3">
        <p className="font-serif font-bold text-stone-900 dark:text-stone-200 text-sm tracking-wide">
          V.A.C. Creative Studio · Atelier de Diseño & Experiencias Digitales
        </p>
        <p className="text-[11px] text-stone-400 font-light max-w-md mx-auto">
          Base de Datos Firebase Firestore activa con sincronización en tiempo real y arquitectura de alta disponibilidad.
        </p>
      </footer>

      {/* ADMIN LOGIN MODAL */}
      <AdminLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsAdminAuthenticated(true);
          setViewMode("admin");
          const loggedName = localStorage.getItem("vac_admin_user") || "Administrador";
          showToast(`Bienvenido, ${loggedName}. Acceso validado por Firebase Auth.`);
        }}
      />

      {/* SERVICE DETAIL SELECTION PREVIEW */}
      {selectedServiceForPreview && (
        <ServicePreviewModal
          service={selectedServiceForPreview}
          onClose={() => setSelectedServiceForPreview(null)}
          onOrder={(type) => {
            handleStartNewOrder(type);
          }}
        />
      )}

      {/* OVERLAY MODAL: Register / Update Form */}
      {formModalOpen && (
        <ProjectForm
          project={editingProject}
          onSave={handleSaveProject}
          onClose={() => {
            setFormModalOpen(false);
            setEditingProject(undefined);
          }}
        />
      )}

      {/* OVERLAY MODAL: Summary / Review */}
      {activeSummaryProject && (
        <ProjectSummary
          project={activeSummaryProject}
          onClose={() => setActiveSummaryProject(undefined)}
        />
      )}

      {/* OVERLAY MODAL: AI Prompt Generator */}
      {activePromptProject && (
        <AIPromptGenerator
          project={activePromptProject}
          onClose={() => setActivePromptProject(undefined)}
        />
      )}

    </div>
  );
}
