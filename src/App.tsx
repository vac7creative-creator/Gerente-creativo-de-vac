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
  cleanCompromisedAdminRecord,
  auth,
  db,
  createPublicOrderWithTracking,
  createDriveFolderForExistingProject,
  getPublicTrackingByCode,
  updateProjectAndTracking,
  deleteProjectAndTracking,
  generateMissingTrackingCodesForAdmin,
  normalizeTrackingCode
} from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

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
import { SERVICES_CATALOG, MAIN_CATEGORIES, SERVICES_CATALOG_DATA } from "./data/servicesCatalog";
import { PORTFOLIO_ITEMS, PortfolioItem } from "./data/portfolioCatalog";
import { CONTACT_CONFIG } from "./config/contact";

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
  Star,
  Eye
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
  const [clientTab, setClientTab] = useState<"catalog" | "portfolio" | "quote" | "tracker">("catalog");
  const [portfolioServiceFilter, setPortfolioServiceFilter] = useState<string>("Todos");
  const [portfolioPackageFilter, setPortfolioPackageFilter] = useState<string>("Todos");
  const [portfolioPreviewItem, setPortfolioPreviewItem] = useState<PortfolioItem | null>(null);

  // View Mode: Client vs Admin
  const [viewMode, setViewMode] = useState<"client" | "admin">("client");
  const [selectedServiceForPreview, setSelectedServiceForPreview] = useState<any | null>(null);
  
  // Progress tracker inputs
  const [progressEmailInput, setProgressEmailInput] = useState("");
  const [trackResultText, setTrackResultText] = useState("");
  const [trackedProjects, setTrackedProjects] = useState<Project[] | null>(null);

  // Secure Tracking State
  const [trackingInputCode, setTrackingInputCode] = useState("");
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [trackedResultData, setTrackedResultData] = useState<any | null>(null);
  const [trackingErrorMsg, setTrackingErrorMsg] = useState("");
  const [newlyCreatedCodeModal, setNewlyCreatedCodeModal] = useState<string | null>(null);
  const [selectedInitialPackage, setSelectedInitialPackage] = useState<string | undefined>(undefined);

  const [adminDisplayName, setAdminDisplayName] = useState<string>("Administrador V.A.C.");

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
  }, []);

  // 2. Real-time Firebase Authentication State Observer
  useEffect(() => {
    // Read-only connection health check
    testConnection().then((connected) => {
      setIsFirestoreConnected(connected);
    });

    // Clean up old compromised records if any
    cleanCompromisedAdminRecord().catch(() => {});

    // Listen to Firebase Auth state
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocSnap = await getDoc(doc(db, "users", currentUser.uid));
          if (userDocSnap.exists() && userDocSnap.data()?.role === "admin") {
            setIsAdminAuthenticated(true);
            const name = userDocSnap.data()?.name || userDocSnap.data()?.username || "Administrador V.A.C.";
            setAdminDisplayName(name);
            return;
          }
        } catch (err) {
          console.warn("Could not verify admin role against Firestore:", err);
        }
      }
      // If not authenticated or does not hold role admin:
      setIsAdminAuthenticated(false);
      setViewMode("client");
      setProjects([]);
      sessionStorage.removeItem("vac_admin_logged");
      localStorage.removeItem("vac_admin_user");
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // 3. Admin-Only Real-time Projects Subscription (Requirement 7 & 8)
  useEffect(() => {
    // Client view NEVER downloads or subscribes to the projects collection
    if (!isAdminAuthenticated || viewMode !== "admin") {
      setProjects([]);
      return;
    }

    setIsSyncingWithCloud(true);
    const unsubscribeProjects = subscribeToProjects(
      (firestoreProjects) => {
        setIsSyncingWithCloud(false);
        setIsFirestoreConnected(true);
        setProjects(firestoreProjects);
      },
      (error) => {
        console.warn("Firestore subscription error:", error);
        setIsSyncingWithCloud(false);
        setIsFirestoreConnected(false);
      }
    );

    return () => {
      unsubscribeProjects();
    };
  }, [isAdminAuthenticated, viewMode]);

  const saveProjectsToStorage = (updatedList: Project[]) => {
    setProjects(updatedList);
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
  const handleToggleAdminView = async () => {
    if (viewMode === "admin") {
      setViewMode("client");
    } else {
      if (isAdminAuthenticated && auth.currentUser) {
        setViewMode("admin");
      } else {
        setLoginModalOpen(true);
      }
    }
  };

  // Secure Admin Logout (Requirement 12)
  const handleAdminLogout = async () => {
    await signOutAdmin();
    sessionStorage.removeItem("vac_admin_logged");
    localStorage.removeItem("vac_admin_user");
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setIsAdminAuthenticated(false);
    setProjects([]);
    setViewMode("client");
    showToast("Sesión de administrador cerrada en Firebase Auth", "info");
  };

  // Consult secure tracking code
  const handleConsultTrackingCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = normalizeTrackingCode(trackingInputCode);
    if (!cleanCode) {
      setTrackingErrorMsg("Introduce tu código de seguimiento.");
      setTrackedResultData(null);
      return;
    }

    setIsTrackingLoading(true);
    setTrackingErrorMsg("");
    setTrackedResultData(null);

    try {
      const data = await getPublicTrackingByCode(cleanCode);
      if (data) {
        setTrackedResultData(data);
      } else {
        setTrackingErrorMsg("No encontramos un proyecto asociado a ese código. Verifica que lo hayas escrito correctamente.");
      }
    } catch (err: any) {
      setTrackingErrorMsg(err?.message || "No pudimos consultar el proyecto. Intenta nuevamente.");
    } finally {
      setIsTrackingLoading(false);
    }
  };

  // Helper: Create/Update project (Secured for Public vs Admin with Tracking Synchronization)
  const handleSaveProject = async (updatedProj: Project) => {
    if (!isAdminAuthenticated) {
      updatedProj.status = ProjectStatus.PENDIENTE;
    }

    try {
      if (isAdminAuthenticated) {
        const wasExisting = projects.some(p => p.id === updatedProj.id);
        const saved = await updateProjectAndTracking(updatedProj);
        setProjects(prev => {
          const index = prev.findIndex(p => p.id === saved.id);
          return index >= 0
            ? prev.map(p => p.id === saved.id ? saved : p)
            : [saved, ...prev];
        });
        showToast(wasExisting ? "¡Proyecto y seguimiento actualizados con éxito en Firestore!" : "¡Nuevo proyecto creado y guardado en Firestore!", "success");
      } else {
        const orderResult = await createPublicOrderWithTracking(updatedProj);
        const assignedCode = typeof orderResult === "string" ? orderResult : orderResult.trackingCode;
        setNewlyCreatedCodeModal(assignedCode);
        if (orderResult && typeof orderResult === "object") {
          if (orderResult.driveError) {
            showToast("Tu pedido fue registrado correctamente. La carpeta de archivos se terminará de preparar automáticamente.", "info");
          } else if (orderResult.driveFolderUrl) {
            showToast("¡Pedido y carpeta de Google Drive vinculados con éxito!", "success");
          } else {
            showToast("¡Pedido registrado exitosamente!", "success");
          }
        } else {
          showToast("¡Pedido registrado exitosamente!", "success");
        }
      }
      setEditingProject(undefined);
    } catch (err: any) {
      console.error("Error saving project:", err);
      const isAuthError = err?.message?.includes("PERMISSION_DENIED") || err?.message?.includes("permission-denied");
      const errorText = isAuthError 
        ? "Error de permisos en Firestore. Comprueba que tu sesión administrativa esté activa."
        : (err?.message || "Error al registrar el proyecto en Firestore. Verifica tu conexión.");
      showToast(errorText, "error");
      throw new Error(errorText);
    }
  };

  // Admin: Manually create Drive folder for existing project
  const handleCreateDriveFolderForProject = async (proj: Project) => {
    if (!isAdminAuthenticated) return;
    try {
      showToast("Conectando con Google Drive...", "info");
      const res = await createDriveFolderForExistingProject(proj);
      if (res.ok && res.folderUrl) {
        showToast("¡Carpeta de Google Drive vinculada con éxito!");
        const updated = {
          ...proj,
          driveFolderUrl: res.folderUrl
        };
        setProjects(prev => prev.map(p => p.id === proj.id ? updated : p));
      } else {
        showToast(res.error || "No se pudo crear la carpeta en Google Drive.", "info");
      }
    } catch {
      showToast("Error al conectar con Google Drive.", "info");
    }
  };

  // Delete project and tracking (Admin Only)
  const handleDeleteProject = async (projId: string) => {
    if (!isAdminAuthenticated) return;
    const target = projects.find(p => p.id === projId);
    const filtered = projects.filter(p => p.id !== projId);
    setProjects(filtered);

    try {
      await deleteProjectAndTracking(projId, target?.trackingCode);
      showToast("Proyecto y seguimiento eliminados", "info");
    } catch (err) {
      console.warn("Error deleting:", err);
      showToast("Error al eliminar en Firebase", "info");
    }
  };

  // Change individual project status directly inside card dropdown click (Admin Only)
  const handleStatusChange = async (id: string, newStatus: ProjectStatus) => {
    if (!isAdminAuthenticated) return;
    const target = projects.find(p => p.id === id);
    if (!target) return;

    const updated = { ...target, status: newStatus, updatedAt: new Date().toISOString() };
    const newList = projects.map(p => (p.id === id ? updated : p));
    setProjects(newList);

    try {
      await updateProjectAndTracking(updated);
      showToast(`Estado cambiado a: ${newStatus}`);
    } catch (err) {
      console.warn("Error updating status:", err);
      showToast("Error al actualizar estado", "info");
    }
  };

  // Admin tool: Generate missing tracking codes
  const handleGenerateMissingTrackingCodes = async () => {
    if (!isAdminAuthenticated) return;
    try {
      const count = await generateMissingTrackingCodesForAdmin(projects);
      if (count > 0) {
        showToast(`Se generaron ${count} códigos de seguimiento faltantes.`);
      } else {
        showToast("Todos los proyectos ya cuentan con código de seguimiento.");
      }
    } catch {
      showToast("Error al generar códigos faltantes.", "info");
    }
  };

  // Helper to open the registration form with a pre-selected project type & notes
  const handleStartNewOrder = (type: ProjectType, prefilledNotes?: string, packageId?: string) => {
    setSelectedInitialPackage(packageId);
    setEditingProject({
      id: "",
      clientName: "",
      clientPhone: "",
      clientEmail: "",
      type: type,
      packageId: packageId,
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
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200 max-w-md">
          <div className={`px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 text-xs font-medium ${
            toastNotification.type === "error"
              ? "bg-red-950/95 border-red-800/80 text-red-100 shadow-red-950/40"
              : toastNotification.type === "info"
                ? "bg-stone-900 border-stone-800 text-stone-100 dark:bg-stone-900"
                : "bg-stone-950 text-stone-100 border-stone-800 dark:bg-stone-900 dark:border-stone-700"
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 animate-pulse ${
              toastNotification.type === "error" ? "bg-red-400" : "bg-amber-400"
            }`} />
            <span className="flex-1 leading-snug">{toastNotification.message}</span>
            <button 
              onClick={() => setToastNotification(null)}
              className="ml-2 text-stone-400 hover:text-white cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
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
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 font-normal hidden sm:block">
                Diseño Digital & Experiencias de Alta Costura
              </p>
            </div>
          </div>

          {/* Controls & Mode Switcher */}
          <div className="flex items-center gap-3">

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
          <div className="flex items-center justify-start gap-3 border-b border-stone-200/80 dark:border-stone-800 pb-4 overflow-x-auto">
            <button
              onClick={() => setClientTab("catalog")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold font-space uppercase tracking-[0.15em] transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                clientTab === "catalog"
                  ? "bg-stone-950 text-white dark:bg-amber-400 dark:text-stone-950 shadow-md"
                  : "bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white border border-stone-200 dark:border-stone-800"
              }`}
            >
              <span>Servicios & Paquetes</span>
            </button>

            <button
              onClick={() => setClientTab("portfolio")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold font-space uppercase tracking-[0.15em] transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                clientTab === "portfolio"
                  ? "bg-stone-950 text-white dark:bg-amber-400 dark:text-stone-950 shadow-md"
                  : "bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white border border-stone-200 dark:border-stone-800"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nuestros Trabajos</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-mono font-bold">
                {PORTFOLIO_ITEMS.length}
              </span>
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
                  <div className="space-y-1 text-right sm:text-left">
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-light max-w-sm">
                      Explora nuestros estilos de referencia y anatomía interactiva. Cada proyecto se personaliza a la medida de tu celebración o negocio.
                    </p>
                    <button
                      onClick={() => setClientTab("portfolio")}
                      className="text-xs font-space font-bold text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-1 cursor-pointer pt-1"
                    >
                      <span>Ver galería de muestras realizadas →</span>
                    </button>
                  </div>
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
                          <span className="text-amber-700 dark:text-amber-400 font-bold font-mono">
                            {(() => {
                              const srv = SERVICES_CATALOG_DATA.find(s => s.type === service.type);
                              const p = srv?.packages[0]?.priceInPEN;
                              return p != null ? `Desde S/ ${p}` : "Precio a cotizar";
                            })()}
                          </span>
                          <span className="text-stone-700 dark:text-stone-300 font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
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
                        <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                          {(() => {
                            const srv = SERVICES_CATALOG_DATA.find(s => s.type === cat.type);
                            const p = srv?.packages[0]?.priceInPEN;
                            return p != null ? `Desde S/ ${p}` : "Precio a cotizar";
                          })()}
                        </span>
                        <span className="text-stone-700 dark:text-stone-300 font-bold group-hover:translate-x-1 transition-transform">
                          Detalles →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB: MUESTRAS & NUESTROS TRABAJOS DE AUTOR */}
          {clientTab === "portfolio" && (
            <div className="space-y-10 animate-fade-in">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-5">
                <div className="space-y-1">
                  <span className="text-[10px] font-space font-bold uppercase tracking-[0.25em] text-amber-700 dark:text-amber-400">
                    Estilos de Referencia & Inspiración Visual
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-950 dark:text-stone-50 tracking-tight">
                    Muestras de Nuestro Trabajo
                  </h2>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-light max-w-md">
                  No vendemos plantillas idénticas: cada proyecto se personaliza con la identidad, fotos y requerimientos de cada cliente. Inspírate con estas líneas visuales de autor.
                </p>
              </div>

              {/* FILTROS DE DOS NIVELES */}
              <div className="space-y-4 bg-white dark:bg-[#141311] border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-sm">
                
                {/* NIVEL 1: SERVICIO */}
                <div className="space-y-2">
                  <span className="text-[11px] font-space font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
                    1. Filtrar por Tipo de Servicio
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
                    {[
                      { label: "Todos los Servicios", value: "Todos" },
                      { label: "Bodas", value: ProjectType.BODA },
                      { label: "XV Años", value: ProjectType.XV_ANOS },
                      { label: "Cumpleaños", value: ProjectType.CUMPLEANOS },
                      { label: "Carta Digital", value: ProjectType.CARTA_DIGITAL },
                      { label: "Landing Page", value: ProjectType.LANDING_PAGE },
                      { label: "Artes Multimedia", value: ProjectType.ARTES_MULTIMEDIA },
                      { label: "Branding", value: ProjectType.DISENO_GRAFICO },
                      { label: "Audiovisual", value: ProjectType.FOTO_VIDEO },
                      { label: "Spot", value: ProjectType.SPOT }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setPortfolioServiceFilter(opt.value);
                          setPortfolioPackageFilter("Todos");
                        }}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-space font-medium transition-all shrink-0 cursor-pointer ${
                          portfolioServiceFilter === opt.value
                            ? "bg-stone-950 text-white dark:bg-amber-400 dark:text-stone-950 font-bold shadow-xs"
                            : "bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* NIVEL 2: PAQUETE (DINÁMICO SEGÚN SERVICIO SELECCIONADO) */}
                {portfolioServiceFilter !== "Todos" && (() => {
                  const currentSrv = SERVICES_CATALOG_DATA.find((s) => s.type === portfolioServiceFilter);
                  const pkgList = currentSrv?.packages || [];
                  if (pkgList.length === 0) return null;
                  return (
                    <div className="space-y-2 pt-3 border-t border-stone-100 dark:border-stone-800/80">
                      <span className="text-[11px] font-space font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                        2. Filtrar por Nivel de Paquete ({currentSrv?.title})
                      </span>
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                        <button
                          onClick={() => setPortfolioPackageFilter("Todos")}
                          className={`px-3 py-1 rounded-full text-xs font-space font-medium transition-all shrink-0 cursor-pointer ${
                            portfolioPackageFilter === "Todos"
                              ? "bg-amber-500 text-stone-950 font-bold"
                              : "bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800"
                          }`}
                        >
                          Todos los Paquetes
                        </button>
                        {pkgList.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => setPortfolioPackageFilter(p.id)}
                            className={`px-3 py-1 rounded-full text-xs font-space font-medium transition-all shrink-0 cursor-pointer ${
                              portfolioPackageFilter === p.id
                                ? "bg-amber-500 text-stone-950 font-bold"
                                : "bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800"
                            }`}
                          >
                            {p.name} {p.priceInPEN != null ? `(S/ ${p.priceInPEN})` : ""}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}

              </div>

              {/* GRID DE MUESTRAS */}
              {(() => {
                const filtered = PORTFOLIO_ITEMS.filter((item) => {
                  if (portfolioServiceFilter !== "Todos" && item.serviceType !== portfolioServiceFilter) return false;
                  if (portfolioPackageFilter !== "Todos" && item.packageId !== portfolioPackageFilter) return false;
                  return true;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="h-64 flex flex-col items-center justify-center border border-dashed border-stone-300 dark:border-stone-800 rounded-3xl p-6 bg-white dark:bg-stone-900 text-center text-stone-400 space-y-2">
                      <Sparkles className="w-8 h-8 text-amber-500/60" />
                      <p className="text-sm font-semibold">No se encontraron muestras para los filtros seleccionados.</p>
                      <button
                        onClick={() => {
                          setPortfolioServiceFilter("Todos");
                          setPortfolioPackageFilter("Todos");
                        }}
                        className="text-xs text-amber-700 dark:text-amber-400 font-bold underline cursor-pointer mt-2"
                      >
                        Ver todas las muestras
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map((item) => (
                      <div
                        key={item.id}
                        className="group bg-white dark:bg-[#141311] border border-stone-200/80 dark:border-stone-800/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between"
                      >
                        {/* Image Preview with Badges */}
                        <div className="relative h-64 overflow-hidden bg-stone-950">
                          <img
                            src={item.image}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                            <span className="bg-stone-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider font-semibold">
                              {item.serviceType}
                            </span>
                            <span className="bg-amber-500 text-stone-950 rounded-full px-2.5 py-0.5 font-space text-[10px] font-bold uppercase tracking-wider">
                              Paquete {item.packageName}
                            </span>
                          </div>

                          {/* Color accents */}
                          {item.colorHighlights && (
                            <div className="absolute top-4 right-4 flex gap-1 bg-stone-950/60 backdrop-blur-xs p-1.5 rounded-full border border-white/10">
                              {item.colorHighlights.map((col, cIdx) => (
                                <span
                                  key={cIdx}
                                  className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs"
                                  style={{ backgroundColor: col }}
                                  title={`Color: ${col}`}
                                />
                              ))}
                            </div>
                          )}

                          <div className="absolute bottom-4 left-4 right-4 space-y-1">
                            <span className="text-[10px] uppercase font-space tracking-widest text-amber-300 font-bold block">
                              Estilo de Referencia
                            </span>
                            <h3 className="font-serif font-bold text-white text-xl tracking-tight leading-snug drop-shadow-sm">
                              {item.title}
                            </h3>
                          </div>
                        </div>

                        {/* Content & Actions */}
                        <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                              {item.conceptSubtitle}
                            </p>
                            <p className="text-xs text-stone-500 dark:text-stone-400 font-light leading-relaxed line-clamp-3">
                              {item.description}
                            </p>

                            {/* Tags */}
                            {item.tags && item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-2">
                                {item.tags.map((t, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="text-[10px] font-space px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200/60 dark:border-stone-800"
                                  >
                                    #{t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => setPortfolioPreviewItem(item)}
                              className="px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-850 text-stone-700 dark:text-stone-300 text-xs font-space font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Ver muestra</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                handleStartNewOrder(
                                  item.serviceType,
                                  `Inspirado en la muestra de referencia: "${item.title}" (${item.packageName}).`,
                                  item.packageId
                                );
                              }}
                              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold font-space text-xs tracking-wider uppercase transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Quiero algo así</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

            </div>
          )}

          {/* TAB 2: COTIZADOR INSTANTANEO EN VIVO */}
          {clientTab === "quote" && (
            <div className="space-y-6 animate-fade-in">
              <InstantQuoteCalculator
                onSelectServiceAndStartOrder={(type, notes, packageId) => {
                  handleStartNewOrder(type, notes, packageId);
                }}
              />
            </div>
          )}

          {/* TAB 3: CONSULTA DE AVANCE CON CÓDIGO SECRETO DE SEGUIMIENTO */}
          {clientTab === "tracker" && (
            <div className="bg-white dark:bg-[#141311] border border-stone-200/80 dark:border-stone-800/80 rounded-3xl p-6 md:p-12 space-y-8 animate-fade-in shadow-sm">
              <div className="max-w-2xl mx-auto space-y-6 text-center">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-space font-bold uppercase tracking-[0.25em] text-amber-700 dark:text-amber-400">
                    Seguimiento Privado por Código
                  </span>
                  <h3 className="font-serif font-bold text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 tracking-tight">
                    Consulta el Estado de tu Invitación
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-light leading-relaxed max-w-lg mx-auto">
                    Introduce tu código secreto de seguimiento (ej. <code className="font-mono text-amber-700 dark:text-amber-400">VAC-XXXX-...</code>) proporcionado al registrar tu pedido.
                  </p>
                </div>

                <form onSubmit={handleConsultTrackingCode} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto w-full pt-2">
                  <input 
                    type="text" 
                    value={trackingInputCode}
                    onChange={(e) => setTrackingInputCode(e.target.value)}
                    placeholder="VAC-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX"
                    className="flex-1 px-4 py-3 text-xs font-mono uppercase bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder:normal-case placeholder:font-sans"
                  />
                  <button 
                    type="submit" 
                    disabled={isTrackingLoading}
                    id="search-progress-btn"
                    className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-stone-950 font-bold font-space text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <Search className="w-4 h-4" />
                    <span>{isTrackingLoading ? "Consultando..." : "Consultar proyecto"}</span>
                  </button>
                </form>

                {/* Messages / Errors */}
                {trackingErrorMsg && (
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-2xl text-xs text-red-700 dark:text-red-400 flex items-center justify-center gap-2 max-w-md mx-auto">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{trackingErrorMsg}</span>
                  </div>
                )}
              </div>

              {/* Tracked Result Display */}
              {trackedResultData && (
                <div className="max-w-3xl mx-auto space-y-8 pt-6 border-t border-stone-200/80 dark:border-stone-800 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-amber-700 dark:text-amber-400 font-bold block mb-1">
                        Servicio: {trackedResultData.serviceType} · Código: {trackedResultData.trackingCode}
                      </span>
                      <h4 className="font-serif font-bold text-stone-900 dark:text-stone-50 text-2xl">
                        Estado Actual: <span className="text-amber-600 dark:text-amber-400">{trackedResultData.status}</span>
                      </h4>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-stone-400 block font-light">
                        Actualizado: {new Date(trackedResultData.updatedAt || trackedResultData.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {trackedResultData.publicMessage && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-stone-800 dark:text-stone-200 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{trackedResultData.publicMessage}</span>
                    </div>
                  )}

                  {/* Visual Step Progress */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 pt-4">
                    {([
                      { title: "Recibido", desc: "Briefing registrado en cola." },
                      { title: "En Diseño", desc: "Composición tipográfica y arte." },
                      { title: "Borrador Revisión", desc: "Boceto interactivo compartido." },
                      { title: "Aprobado", desc: "Validación de dirección lista." },
                      { title: "Listo / Entregado", desc: "Enlace final autodesplegado." }
                    ]).map((st, stepIdx) => {
                      const getStatusStepIndex = (status: string) => {
                        switch (status) {
                          case ProjectStatus.PENDIENTE: return 0;
                          case ProjectStatus.EN_DISENO: return 1;
                          case ProjectStatus.EN_REVISION: return 2;
                          case ProjectStatus.APROBADO: return 3;
                          case ProjectStatus.ENTREGADO: return 4;
                          default: return 0;
                        }
                      };
                      const currentIdx = getStatusStepIndex(trackedResultData.status);
                      const isVisited = currentIdx >= stepIdx;
                      const isCurrent = currentIdx === stepIdx;

                      return (
                        <div key={stepIdx} className="space-y-2 relative">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                              isCurrent 
                                ? "bg-amber-500 text-stone-950 ring-4 ring-amber-500/20" 
                                : isVisited 
                                  ? "bg-stone-900 text-white dark:bg-amber-400 dark:text-stone-950" 
                                  : "bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200 dark:border-stone-700"
                            }`}>
                              {stepIdx + 1}
                            </div>
                            <div className={`h-0.5 flex-1 ${isVisited ? "bg-stone-900 dark:bg-amber-400" : "bg-stone-200 dark:bg-stone-800"}`} />
                          </div>
                          <div>
                            <h5 className={`font-space text-xs font-bold uppercase tracking-wide ${isCurrent ? "text-amber-700 dark:text-amber-400" : "text-stone-900 dark:text-stone-100"}`}>
                              {st.title}
                            </h5>
                            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-light mt-0.5 leading-relaxed">
                              {st.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-stone-200/60 dark:border-stone-800 text-center">
                    <a
                      href="https://wa.me/525512345678?text=Hola%20V.A.C.%20Creative,%20deseo%20consultar%20sobre%20el%20seguimiento%20de%20mi%20pedido."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-space font-bold inline-flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Contactar Asesor por WhatsApp</span>
                    </a>
                  </div>
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
                onClick={handleGenerateMissingTrackingCodes}
                className="px-3 py-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 rounded-lg text-xs font-semibold font-space transition-colors cursor-pointer"
                title="Genera códigos de rastreo VAC para proyectos antiguos"
              >
                Generar códigos faltantes
              </button>
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
                      onCreateDriveFolder={handleCreateDriveFolderForProject}
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
          V.A.C. Creative Studio · Diseño & Experiencias Digitales
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
          onOrder={(type, packageId) => {
            handleStartNewOrder(type, undefined, packageId);
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
            setSelectedInitialPackage(undefined);
          }}
          initialServiceType={editingProject?.type}
          initialPackageId={selectedInitialPackage}
          isAdminContext={isAdminAuthenticated}
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

      {/* NEWLY CREATED ORDER TRACKING CODE MODAL */}
      {newlyCreatedCodeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-[#FAF9F5] dark:bg-[#121110] text-stone-900 dark:text-stone-100 rounded-3xl p-8 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-6 text-center animate-fade-in">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-space font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
                ¡Solicitud Registrada Correctamente!
              </span>
              <h3 className="font-serif font-bold text-2xl text-stone-950 dark:text-stone-50">
                Tu Código Privado de Seguimiento
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-light leading-relaxed">
                Guarda este código con cuidado. Lo necesitarás en la pestaña <strong className="text-stone-900 dark:text-white">“Rastreo de Proyecto”</strong> para consultar el estado en tiempo real.
              </p>
            </div>

            <div className="p-4 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl flex items-center justify-between gap-3 font-mono text-sm font-bold text-amber-700 dark:text-amber-400">
              <span className="truncate">{newlyCreatedCodeModal}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(newlyCreatedCodeModal);
                  showToast("¡Código copiado al portapapeles!", "success");
                }}
                className="px-3.5 py-1.5 bg-stone-950 text-white dark:bg-amber-400 dark:text-stone-950 rounded-xl text-xs font-space font-bold uppercase tracking-wider cursor-pointer shrink-0"
              >
                Copiar
              </button>
            </div>

            <button
              type="button"
              onClick={() => setNewlyCreatedCodeModal(null)}
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-stone-950 rounded-xl text-xs font-bold font-space uppercase tracking-widest transition-colors cursor-pointer"
            >
              Entendido & Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
