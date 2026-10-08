/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Project, 
  ProjectType, 
  ProjectStatus, 
  MenuItem, 
  WeddingDetails, 
  XvDetails, 
  DigitalMenuDetails, 
  OtherDetails,
  ProjectMediaFile,
  PendingUploadFile
} from "../types";
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Save, 
  Sparkles, 
  Utensils, 
  Info, 
  Music, 
  Globe, 
  CheckCircle,
  HelpCircle,
  Hash,
  Trash2,
  FileBadge,
  Check,
  ExternalLink,
  Upload,
  ArrowRight,
  Loader2,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { SERVICES_CATALOG_DATA, ServiceCatalogItem, PackageItem, isFeatureActive } from "../data/servicesCatalog";
import { CurrencyCode, detectUserCurrency, formatCurrencyPrice } from "../utils/currency";
import MediaUploader from "./MediaUploader";
import { createOrGetDriveFolderForProject, uploadPendingFilesToDrive, uploadFileToDrive } from "../services/driveService";
import { generateTrackingCode } from "../firebase";

interface ProjectFormProps {
  project?: Project; // If provided, we're editing
  onSave: (project: Project) => void | Promise<void>;
  onClose: () => void;
  initialServiceType?: ProjectType;
  initialPackageId?: string;
  isAdminContext?: boolean;
}

// Visual Palette Cards for Weddings
interface PaletteOption {
  name: string;
  colors: string[];
  desc: string;
}

const WEDDING_PALETTES: PaletteOption[] = [
  { name: "Marfil & Champagne", colors: ["#FAF5EF", "#E3D5C1", "#C5A880"], desc: "Clásico atemporal de alta costura" },
  { name: "Borgoña & Oro Suave", colors: ["#58111A", "#D4AF37", "#FAF5EF"], desc: "Sofisticación profunda y romántica" },
  { name: "Verde Olivo & Eucalipto", colors: ["#556B2F", "#8FBC8F", "#F5F5F0"], desc: "Natural, orgánico y fresco" },
  { name: "Terracota & Arena", colors: ["#CC6633", "#E6C280", "#F9F6F0"], desc: "Cálido, bohemio y terroso" },
  { name: "Azul Noche & Oro", colors: ["#0B1D3A", "#D4AF37", "#FFFFFF"], desc: "Elegancia nocturna y sobria" },
  { name: "Blanco Monocromático", colors: ["#FFFFFF", "#E0E0E0", "#111111"], desc: "Minimalismo puro y moderno" }
];

const XV_PALETTES: PaletteOption[] = [
  { name: "Rosa Pastel & Oro", colors: ["#FFD1DC", "#F4C430", "#FFF8F0"], desc: "Dulzura y magia tradicional" },
  { name: "Lavanda & Plata", colors: ["#E6E6FA", "#C0C0C0", "#FAF5FF"], desc: "Toque etéreo y sofisticado" },
  { name: "Azul Real & Cristal", colors: ["#4169E1", "#E0FFFF", "#FFFFFF"], desc: "Realeza y brillo estelar" },
  { name: "Verde Esmeralda", colors: ["#50C878", "#D4AF37", "#F0FFF0"], desc: "Intenso, distinguido y fresco" }
];

export default function ProjectForm({
  project,
  onSave,
  onClose,
  initialServiceType,
  initialPackageId,
  isAdminContext = false
}: ProjectFormProps) {
  const [currency, setCurrency] = useState<CurrencyCode>("PEN");

  useEffect(() => {
    const { currency: detected } = detectUserCurrency();
    setCurrency(detected);
  }, []);

  // 1. Client Identity & Service State
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [selectedType, setSelectedType] = useState<ProjectType>(initialServiceType || ProjectType.BODA);
  const [selectedPackageId, setSelectedPackageId] = useState<string>(initialPackageId || "basico");
  const [serviceVariant, setServiceVariant] = useState<string>("");
  const [generalNotes, setGeneralNotes] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingProgressText, setUploadingProgressText] = useState("");

  // Common media files & Google Drive
  const [uploadedFiles, setUploadedFiles] = useState<ProjectMediaFile[]>([]);
  const [pendingFiles, setPendingFiles] = useState<PendingUploadFile[]>([]);
  const [googleDriveUrl, setGoogleDriveUrl] = useState("");
  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    if (project?.id && project.id.trim()) {
      return project.id.trim();
    }
    return typeof crypto !== "undefined" && crypto.randomUUID
      ? `proj_${crypto.randomUUID()}`
      : `proj_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  });
  const [activeDriveFolderId, setActiveDriveFolderId] = useState<string | undefined>(project?.driveFolderId);
  const [activeDriveFolderUrl, setActiveDriveFolderUrl] = useState<string | undefined>(project?.driveFolderUrl);
  const [activeDriveUploadsFolderId, setActiveDriveUploadsFolderId] = useState<string | undefined>(project?.driveUploadsFolderId);
  const [activeDriveReferencesFolderId, setActiveDriveReferencesFolderId] = useState<string | undefined>(project?.driveReferencesFolderId);
  const [activeDriveFinalFilesFolderId, setActiveDriveFinalFilesFolderId] = useState<string | undefined>(project?.driveFinalFilesFolderId);
  const [activeTrackingCode, setActiveTrackingCode] = useState<string>(() => {
    if (project?.trackingCode && project.trackingCode.trim()) {
      return project.trackingCode.trim();
    }
    return generateTrackingCode();
  });
  const [activeCreatedAt] = useState<string>(() => project?.createdAt || new Date().toISOString());
  const [uploadSuccessSummary, setUploadSuccessSummary] = useState<string>("");
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Prevenir cierre accidental si hay subida en curso
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isSubmitting) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isSubmitting]);

  const handleAttemptClose = () => {
    // Mientras se están subiendo archivos, no permitir cerrar de ninguna forma
    if (isSubmitting) {
      return;
    }
    const hasFailedFiles = pendingFiles.some((p) => p.status === "error");
    if (hasFailedFiles) {
      setShowExitConfirm(true);
      return;
    }
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isSubmitting) return; // Bloquear Escape si se están subiendo archivos
        if (showExitConfirm) {
          setShowExitConfirm(false);
        } else {
          handleAttemptClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting, pendingFiles, showExitConfirm]);

  // 2. Wedding Details State (Boda)
  const [weddingNovio, setWeddingNovio] = useState("");
  const [weddingNovia, setWeddingNovia] = useState("");
  const [weddingFecha, setWeddingFecha] = useState("");
  const [weddingHora, setWeddingHora] = useState("");
  const [weddingFrase, setWeddingFrase] = useState("");
  
  const [ceremoniaIglesia, setCeremoniaIglesia] = useState("");
  const [ceremoniaDireccion, setCeremoniaDireccion] = useState("");
  const [ceremoniaMaps, setCeremoniaMaps] = useState("");
  
  const [recepcionLocal, setRecepcionLocal] = useState("");
  const [recepcionDireccion, setRecepcionDireccion] = useState("");
  const [recepcionMaps, setRecepcionMaps] = useState("");
  
  const [confirmWeddingWhatsapp, setConfirmWeddingWhatsapp] = useState("");
  const [confirmWeddingLimite, setConfirmWeddingLimite] = useState("");
  
  const [weddingMusica, setWeddingMusica] = useState("");
  const [weddingYoutube, setWeddingYoutube] = useState("");
  
  const [isCustomPalette, setIsCustomPalette] = useState(false);
  const [weddingPaletteName, setWeddingPaletteName] = useState("Marfil & Champagne");
  const [weddingPaletteCustom, setWeddingPaletteCustom] = useState("");
  const [weddingVisualStyle, setWeddingVisualStyle] = useState<"Floral" | "Elegante" | "Moderno" | "Minimalista" | "Luxury" | "Boho">("Elegante");
  
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // 3. 15 Years Details State (XV años)
  const [xvName, setXvName] = useState("");
  const [xvFecha, setXvFecha] = useState("");
  const [xvHora, setXvHora] = useState("");
  const [xvLugar, setXvLugar] = useState("");
  const [xvDireccion, setXvDireccion] = useState("");
  const [xvMaps, setXvMaps] = useState("");
  const [xvMusica, setXvMusica] = useState("");
  const [xvYoutube, setXvYoutube] = useState("");
  const [xvPalette, setXvPalette] = useState("Rosa Pastel & Oro");
  const [xvTematica, setXvTematica] = useState("Princesa Floral");
  const [xvConfirmWhatsapp, setXvConfirmWhatsapp] = useState("");

  // 4. Cumpleaños
  const [bdayName, setBdayName] = useState("");
  const [bdayAge, setBdayAge] = useState("");
  const [bdayFecha, setBdayFecha] = useState("");
  const [bdayHora, setBdayHora] = useState("");
  const [bdayLugar, setBdayLugar] = useState("");
  const [bdayMaps, setBdayMaps] = useState("");
  const [bdayTematica, setBdayTematica] = useState("");
  const [bdayMusica, setBdayMusica] = useState("");
  const [bdayConfirmWhatsapp, setBdayConfirmWhatsapp] = useState("");

  // 5. Digital Menu Details State (Carta Digital)
  const [menuBusinessName, setMenuBusinessName] = useState("");
  const [menuLogoUrl, setMenuLogoUrl] = useState("");
  const [menuAddress, setMenuAddress] = useState("");
  const [menuWhatsapp, setMenuWhatsapp] = useState("");
  const [menuInstagram, setMenuInstagram] = useState("");
  const [menuTheme, setMenuTheme] = useState<"Moderno" | "Premium" | "Gourmet" | "Fast Food" | "Cafetería">("Gourmet");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tempItemName, setTempItemName] = useState("");
  const [tempItemDesc, setTempItemDesc] = useState("");
  const [tempItemPrice, setTempItemPrice] = useState("");
  const [tempItemCategory, setTempItemCategory] = useState<"Desayunos" | "Almuerzos" | "Bebidas" | "Postres" | "Otros">("Almuerzos");

  // 6. Landing Page
  const [landingBrand, setLandingBrand] = useState("");
  const [landingGoal, setLandingGoal] = useState("Captación de prospectos (Leads)");
  const [landingWhatsapp, setLandingWhatsapp] = useState("");
  const [landingSocials, setLandingSocials] = useState("");
  const [landingSections, setLandingSections] = useState("Hero, Beneficios, Servicios, Testimonios, FAQ, Formulario");

  // 7. Spot Publicitario / Locución
  const [spotCampaign, setSpotCampaign] = useState("");
  const [spotTargetMedia, setSpotTargetMedia] = useState("Redes Sociales (Reels/TikTok)");
  const [spotDuration, setSpotDuration] = useState("30 Segundos");
  const [spotTone, setSpotTone] = useState("Comercial enérgico");
  const [spotVoiceType, setSpotVoiceType] = useState("Voz Masculina");
  const [spotScript, setSpotScript] = useState("");

  // 8. Audiovisual / Video
  const [videoProjectName, setVideoProjectName] = useState("");
  const [videoFormat, setVideoFormat] = useState("Vertical 9:16 (Reels/TikTok)");
  const [videoDuration, setVideoDuration] = useState("60 Segundos");
  const [videoStyle, setVideoStyle] = useState("Cinematográfico dinámico");
  const [videoInstructions, setVideoInstructions] = useState("");

  // 9. Branding / Diseño Gráfico
  const [brandingBrandName, setBrandingBrandName] = useState("");
  const [brandingIndustry, setBrandingIndustry] = useState("");
  const [brandingPersonality, setBrandingPersonality] = useState("Minimalista y Lujoso");
  const [brandingColors, setBrandingColors] = useState("");
  const [brandingRequirements, setBrandingRequirements] = useState("");

  // 10. Artes Multimedia
  const [artPieceType, setArtPieceType] = useState("Flyer Promocional / Evento");
  const [artDimensions, setArtDimensions] = useState("Vertical 9:16 (Stories / Reels / TikTok)");
  const [artTitle, setArtTitle] = useState("");
  const [artCopy, setArtCopy] = useState("");
  const [artStyle, setArtStyle] = useState("Moderno & Publicitario");
  const [artColors, setArtColors] = useState("");

  // 11. General Other Details State
  const [otherDescription, setOtherDescription] = useState("");
  const [otherRequirements, setOtherRequirements] = useState("");

  // Catalog configuration for current service
  const currentCatalogItem: ServiceCatalogItem = SERVICES_CATALOG_DATA.find((s) => s.type === selectedType) || SERVICES_CATALOG_DATA[0];
  const packages: PackageItem[] = currentCatalogItem.packages || [];
  const currentPackage = packages.find((p) => p.id === selectedPackageId) || packages[0];

  const isInitialMount = useRef(true);

  // Sync initialPackageId if prop updates from parent
  useEffect(() => {
    if (initialPackageId && currentCatalogItem.packages.some((p) => p.id === initialPackageId)) {
      setSelectedPackageId(initialPackageId);
    }
  }, [initialPackageId]);

  // When selectedType changes, DO NOT aggressively reset if packageId is valid or coming from initial/existing
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (initialPackageId && currentCatalogItem.packages.some((p) => p.id === initialPackageId)) {
        setSelectedPackageId(initialPackageId);
        return;
      }
      if (project?.packageId && currentCatalogItem.packages.some((p) => p.id === project.packageId)) {
        setSelectedPackageId(project.packageId);
        return;
      }
    }

    // Only switch package if the currently selected package is invalid for the new service type
    const packageExistsInCurrent = currentCatalogItem.packages.some((p) => p.id === selectedPackageId);
    if (!packageExistsInCurrent && currentCatalogItem.packages.length > 0) {
      setSelectedPackageId(currentCatalogItem.packages[0].id);
    }

    if (currentCatalogItem.variants && currentCatalogItem.variants.length > 0) {
      if (!serviceVariant || !currentCatalogItem.variants.some((v) => v.label === serviceVariant)) {
        setServiceVariant(currentCatalogItem.variants[0].label);
      }
    } else {
      setServiceVariant("");
    }
    const validAddonIds = currentCatalogItem.addons.map((a) => a.id);
    setSelectedAddons((prev) => prev.filter((id) => validAddonIds.includes(id)));
  }, [selectedType]);

  // Load existing project block if available
  useEffect(() => {
    if (project) {
      if (project.id && project.id.trim()) {
        setActiveProjectId(project.id.trim());
      }
      setActiveDriveFolderId(project.driveFolderId);
      setActiveDriveFolderUrl(project.driveFolderUrl);
      setActiveDriveUploadsFolderId(project.driveUploadsFolderId);
      setActiveDriveReferencesFolderId(project.driveReferencesFolderId);
      setActiveDriveFinalFilesFolderId(project.driveFinalFilesFolderId);
      setActiveTrackingCode(project.trackingCode);
      setClientName(project.clientName || "");
      setClientPhone(project.clientPhone || "");
      setClientEmail(project.clientEmail || "");
      setSelectedType(project.type);
      setGeneralNotes(project.generalNotes || "");
      if (project.packageId) {
        setSelectedPackageId(project.packageId);
      }
      if (project.serviceVariant) {
        setServiceVariant(project.serviceVariant);
      }
      if (project.selectedAddonIds && project.selectedAddonIds.length > 0) {
        setSelectedAddons(project.selectedAddonIds);
      }
      if (project.uploadedFiles && Array.isArray(project.uploadedFiles)) {
        // Only keep valid lightweight URL references, strip any legacy base64
        const sanitizedUploaded = project.uploadedFiles.filter(
          (f) => f && f.url && !f.url.startsWith("data:")
        );
        setUploadedFiles(sanitizedUploaded);
      }
      if (project.googleDriveUrl) {
        setGoogleDriveUrl(project.googleDriveUrl);
      }

      if (project.weddingDetails) {
        const w = project.weddingDetails;
        setWeddingNovia(w.noviaName || "");
        setWeddingNovio(w.novioName || "");
        setWeddingFecha(w.fecha || "");
        setWeddingHora(w.hora || "");
        setWeddingFrase(w.fraseEspecial || "");
        setCeremoniaIglesia(w.ceremoniaIglesia || "");
        setCeremoniaDireccion(w.ceremoniaDireccion || "");
        setCeremoniaMaps(w.ceremoniaMapsUrl || "");
        setRecepcionLocal(w.recepcionLocal || "");
        setRecepcionDireccion(w.recepcionDireccion || "");
        setRecepcionMaps(w.recepcionMapsUrl || "");
        setConfirmWeddingWhatsapp(w.confirmacionWhatsapp || "");
        setConfirmWeddingLimite(w.confirmacionFechaLimite || "");
        setWeddingMusica(w.multimediaMusicaNombre || "");
        setWeddingYoutube(w.youtubeUrl || w.multimediaVideoUrl || "");
        setWeddingPaletteName(w.colorPalette || "Marfil & Champagne");
        setWeddingPaletteCustom(w.colorPaleteCustomValue || "");
        setWeddingVisualStyle(w.visualStyle || "Elegante");
      }

      if (project.xvDetails) {
        const x = project.xvDetails;
        setXvName(x.quinceaneraName || "");
        setXvFecha(x.fecha || "");
        setXvHora(x.hora || "");
        setXvLugar(x.lugar || "");
        setXvMaps(x.mapsUrl || "");
        setXvMusica(x.musicaNombre || "");
        setXvPalette(x.colorPalette || "Rosa Pastel & Oro");
        setXvTematica(x.tematica || "");
        setXvConfirmWhatsapp(x.confirmacionWhatsapp || "");
      }

      if (project.menuDetails) {
        const m = project.menuDetails;
        setMenuBusinessName(m.businessName || "");
        setMenuLogoUrl(m.logoUrl || "");
        setMenuAddress(m.address || "");
        setMenuWhatsapp(m.whatsapp || "");
        setMenuItems(m.items || []);
        setMenuTheme(m.designTheme || "Gourmet");
      }

      if (project.otherDetails) {
        const o = project.otherDetails;
        setOtherDescription(o.description || "");
        setOtherRequirements(o.requirements || "");
      }
    }
  }, [project]);

  // Calculate total price: DO NOT double charge if included in package!
  const basePrice = currentPackage?.priceInPEN ?? (currentCatalogItem.packages[0]?.priceInPEN ?? 0);
  const addonsTotal = selectedAddons.reduce((sum, addId) => {
    if (isFeatureActive(addId, currentPackage, [])) return sum;
    const addon = currentCatalogItem.addons.find((a) => a.id === addId);
    return sum + (addon ? addon.priceInPEN : 0);
  }, 0);
  const totalPricePEN = basePrice + addonsTotal;

  // Add menu item helper
  const handleAddMenuItem = () => {
    if (!tempItemName.trim() || !tempItemPrice) return;
    const newItem: MenuItem = {
      id: `item_${Date.now()}`,
      name: tempItemName.trim(),
      description: tempItemDesc.trim(),
      price: parseFloat(tempItemPrice) || 0,
      category: tempItemCategory
    };
    setMenuItems([...menuItems, newItem]);
    setTempItemName("");
    setTempItemDesc("");
    setTempItemPrice("");
  };

  const handleRemoveMenuItem = (id: string) => {
    setMenuItems(menuItems.filter((i) => i.id !== id));
  };

  // Google Maps search helper
  const openGoogleMapsSearch = (query: string) => {
    if (!query.trim()) return;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, "_blank", "noopener,noreferrer");
  };

  // YouTube search helper
  const openYouTubeSearch = (query: string) => {
    if (!query.trim()) return;
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, "_blank", "noopener,noreferrer");
  };

  // Helper to ensure Drive folder exists
  const ensureDriveFolder = async (): Promise<string | undefined> => {
    let targetFolderId = activeDriveUploadsFolderId || activeDriveFolderId;
    if (targetFolderId) return targetFolderId;

    try {
      setUploadingProgressText("Preparando carpeta en Google Drive...");
      const now = new Date().toISOString();
      const driveResult = await createOrGetDriveFolderForProject({
        id: activeProjectId,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail.trim(),
        type: selectedType,
        status: project?.status || ProjectStatus.PENDIENTE,
        createdAt: activeCreatedAt,
        updatedAt: now,
        trackingCode: activeTrackingCode,
        serviceVariant: serviceVariant || undefined
      });

      if (driveResult.ok && driveResult.folderId) {
        setActiveDriveFolderId(driveResult.folderId);
        setActiveDriveFolderUrl(driveResult.folderUrl);
        setActiveDriveUploadsFolderId(driveResult.uploadsFolderId);
        setActiveDriveReferencesFolderId(driveResult.referencesFolderId);
        setActiveDriveFinalFilesFolderId(driveResult.finalFilesFolderId);
        return driveResult.uploadsFolderId || driveResult.folderId;
      }
    } catch (err) {
      console.warn("Error creating/retrieving drive folder:", err);
    }
    return undefined;
  };

  // Helper to construct clean Project object
  const constructProjectData = (
    currentUploadedMedia: ProjectMediaFile[],
    currentDriveStatus: "pending" | "ready" | "error" = "ready"
  ): Project => {
    const now = new Date().toISOString();
    
    // Extract only clean URLs (never data: base64) for wedding details
    const cleanPhotoUrls = currentUploadedMedia
      .map((f) => f.url)
      .filter((u) => u && !u.startsWith("data:"));

    let weddingDetailsObj: WeddingDetails | undefined = undefined;
    let xvDetailsObj: XvDetails | undefined = undefined;
    let menuDetailsObj: DigitalMenuDetails | undefined = undefined;
    let otherDetailsObj: OtherDetails | undefined = undefined;

    if (selectedType === ProjectType.BODA) {
      weddingDetailsObj = {
        novioName: weddingNovio,
        noviaName: weddingNovia,
        fecha: weddingFecha,
        hora: weddingHora,
        fraseEspecial: weddingFrase,
        ceremoniaIglesia,
        ceremoniaDireccion,
        ceremoniaMapsUrl: ceremoniaMaps,
        recepcionLocal,
        recepcionDireccion,
        recepcionMapsUrl: recepcionMaps,
        confirmacionWhatsapp: confirmWeddingWhatsapp,
        confirmacionFechaLimite: confirmWeddingLimite,
        multimediaFotos: cleanPhotoUrls,
        multimediaVideoUrl: weddingYoutube,
        multimediaMusicaNombre: weddingMusica,
        youtubeUrl: weddingYoutube,
        colorPalette: isCustomPalette ? "Personalizado" : weddingPaletteName,
        colorPaleteCustomValue: isCustomPalette ? weddingPaletteCustom : undefined,
        visualStyle: weddingVisualStyle,
        extras: {
          cuentaRegresiva: isFeatureActive("cuenta_regresiva", currentPackage, selectedAddons),
          galeriaFotos: isFeatureActive("galeria_fotos", currentPackage, selectedAddons),
          historiaAmor: isFeatureActive("historia_amor", currentPackage, selectedAddons),
          confirmacionWhatsapp: isFeatureActive("confirmacion_whatsapp", currentPackage, selectedAddons),
          mesaRegalos: isFeatureActive("mesa_regalos", currentPackage, selectedAddons),
          dressCode: isFeatureActive("dress_code", currentPackage, selectedAddons),
          videoFondo: isFeatureActive("video_slideshow", currentPackage, selectedAddons),
          animacionesPremium: isFeatureActive("animaciones_premium", currentPackage, selectedAddons)
        }
      };
    } else if (selectedType === ProjectType.XV_ANOS) {
      const hasMusica = isFeatureActive("musica", currentPackage, selectedAddons);
      const hasGaleria = isFeatureActive("galeria_fotos", currentPackage, selectedAddons);
      const hasCuentaRegresiva = isFeatureActive("cuenta_regresiva", currentPackage, selectedAddons);
      const hasMaps = isFeatureActive("google_maps", currentPackage, selectedAddons);
      const hasWhatsapp = isFeatureActive("confirmacion_whatsapp", currentPackage, selectedAddons);
      const hasDressCode = isFeatureActive("dress_code", currentPackage, selectedAddons);
      const hasMesaRegalos = isFeatureActive("mesa_regalos", currentPackage, selectedAddons);
      const hasVideo = isFeatureActive("video_slideshow", currentPackage, selectedAddons);
      const hasAnimaciones = isFeatureActive("animaciones_premium", currentPackage, selectedAddons);

      xvDetailsObj = {
        quinceaneraName: xvName,
        fecha: xvFecha,
        hora: xvHora,
        lugar: xvLugar,
        mapsUrl: hasMaps ? xvMaps : "",
        musicaNombre: hasMusica ? xvMusica : "",
        galleryEnabled: hasGaleria,
        videoEnabled: hasVideo,
        videoUrl: hasVideo ? xvYoutube : "",
        colorPalette: xvPalette,
        tematica: xvTematica,
        confirmacionWhatsapp: hasWhatsapp ? xvConfirmWhatsapp : "",
        cuentaRegresiva: hasCuentaRegresiva,
        extras: { 
          mesaRegalos: hasMesaRegalos, 
          dressCode: hasDressCode, 
          animacionesPremium: hasAnimaciones 
        }
      };
    } else if (selectedType === ProjectType.CARTA_DIGITAL) {
      menuDetailsObj = {
        businessName: menuBusinessName || clientName,
        logoUrl: menuLogoUrl,
        address: menuAddress,
        whatsapp: menuWhatsapp || clientPhone,
        instagramUrl: menuInstagram,
        items: menuItems,
        designTheme: menuTheme
      };
    } else if (selectedType === ProjectType.CUMPLEANOS) {
      otherDetailsObj = {
        description: `Cumpleaños de ${bdayName || clientName} (${bdayAge || "Festejo"}). Fecha: ${bdayFecha} ${bdayHora}. Temática: ${bdayTematica}`,
        requirements: `Lugar: ${bdayLugar}. Maps: ${bdayMaps}. Música: ${bdayMusica}. WhatsApp RSVP: ${bdayConfirmWhatsapp}`,
        colorPalette: "Festivo",
        attachmentsInfo: googleDriveUrl
      };
    } else if (selectedType === ProjectType.LANDING_PAGE) {
      otherDetailsObj = {
        description: `Landing Page para ${landingBrand || clientName}. Objetivo: ${landingGoal}`,
        requirements: `WhatsApp: ${landingWhatsapp}. Redes: ${landingSocials}. Secciones: ${landingSections}`,
        colorPalette: "Corporativo",
        attachmentsInfo: googleDriveUrl
      };
    } else if (selectedType === ProjectType.SPOT) {
      otherDetailsObj = {
        description: `Spot Publicitario para ${spotCampaign || clientName}. Medio: ${spotTargetMedia}. Duración: ${spotDuration}`,
        requirements: `Tono: ${spotTone}. Locutor: ${spotVoiceType}. Guion: ${spotScript}`,
        colorPalette: "Publicidad",
        attachmentsInfo: googleDriveUrl
      };
    } else if (selectedType === ProjectType.FOTO_VIDEO) {
      otherDetailsObj = {
        description: `Producción de Video: ${videoProjectName || clientName}. Formato: ${videoFormat}. Duración: ${videoDuration}`,
        requirements: `Estilo: ${videoStyle}. Instrucciones: ${videoInstructions}`,
        colorPalette: "Cinematográfico",
        attachmentsInfo: googleDriveUrl
      };
    } else if (selectedType === ProjectType.DISENO_GRAFICO) {
      otherDetailsObj = {
        description: `Identidad & Branding: ${brandingBrandName || clientName}. Rubro: ${brandingIndustry}. Personalidad: ${brandingPersonality}`,
        requirements: `Colores: ${brandingColors}. Requerimientos: ${brandingRequirements}`,
        colorPalette: brandingColors || "Elegante",
        attachmentsInfo: googleDriveUrl
      };
    } else if (selectedType === ProjectType.ARTES_MULTIMEDIA) {
      otherDetailsObj = {
        description: `Diseño / Artes Multimedia: ${artPieceType} (${artDimensions}). Titular: ${artTitle || clientName}. Estilo: ${artStyle}`,
        requirements: `Textos / Copy: ${artCopy}. Formato: ${artDimensions}. Estilo visual: ${artStyle}. Colores: ${artColors || "A criterio del diseñador"}.`,
        colorPalette: artColors || "Publicitario",
        attachmentsInfo: googleDriveUrl
      };
    } else {
      otherDetailsObj = {
        description: otherDescription || `Solicitud para ${currentCatalogItem.title}`,
        requirements: otherRequirements,
        colorPalette: "Estándar",
        attachmentsInfo: googleDriveUrl
      };
    }

    const finalProjectId = (activeProjectId && activeProjectId.trim())
      || (project?.id && project.id.trim())
      || (typeof crypto !== "undefined" && crypto.randomUUID ? `proj_${crypto.randomUUID()}` : `proj_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`);

    if (!activeProjectId || activeProjectId !== finalProjectId) {
      setActiveProjectId(finalProjectId);
    }

    return {
      id: finalProjectId,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim(),
      type: selectedType,
      status: project?.status || ProjectStatus.PENDIENTE,
      createdAt: activeCreatedAt,
      updatedAt: now,
      packageId: currentPackage?.id || selectedPackageId,
      packageName: currentPackage?.name || "Básico",
      totalPrice: totalPricePEN,
      selectedAddonIds: selectedAddons,
      serviceVariant: serviceVariant || undefined,
      uploadedFiles: currentUploadedMedia,
      googleDriveUrl: googleDriveUrl,
      trackingCode: activeTrackingCode,
      driveFolderId: activeDriveFolderId,
      driveFolderUrl: activeDriveFolderUrl,
      driveUploadsFolderId: activeDriveUploadsFolderId,
      driveReferencesFolderId: activeDriveReferencesFolderId,
      driveFinalFilesFolderId: activeDriveFinalFilesFolderId,
      driveStatus: currentDriveStatus,
      weddingDetails: weddingDetailsObj,
      xvDetails: xvDetailsObj,
      menuDetails: menuDetailsObj,
      otherDetails: otherDetailsObj,
      generalNotes: isAdminContext ? generalNotes : (project?.generalNotes || "")
    };
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setUploadSuccessSummary("");

    if (!clientName.trim()) {
      setFormError("Por favor, introduce el nombre completo del cliente o contacto.");
      return;
    }
    if (!clientPhone.trim() && !clientEmail.trim()) {
      setFormError("Introduce al menos un teléfono/WhatsApp o correo de contacto.");
      return;
    }

    setIsSubmitting(true);
    setUploadingProgressText("");

    let currentUploaded = [...uploadedFiles.filter((f) => f && f.url && !f.url.startsWith("data:"))];
    let currentPending = [...pendingFiles];

    try {
      let targetFolderId = await ensureDriveFolder();

      if (currentPending.length > 0) {
        if (targetFolderId) {
          setUploadingProgressText(`Subiendo archivos (1 de ${currentPending.length})...`);

          for (let i = 0; i < currentPending.length; i++) {
            const item = currentPending[i];

            // Si ya está subido exitosamente con fileId real, reutilizarlo
            if (item.status === "success" && item.uploadedResult?.driveFileId) {
              if (!currentUploaded.some((u) => u.driveFileId === item.uploadedResult!.driveFileId || u.id === item.uploadedResult!.id)) {
                currentUploaded.push(item.uploadedResult);
              }
              continue;
            }

            setUploadingProgressText(`Subiendo archivo ${i + 1} de ${currentPending.length}... (${item.name})`);
            currentPending = currentPending.map((p) => (p.id === item.id ? { ...p, status: "uploading" } : p));
            setPendingFiles([...currentPending]);

            const result = await uploadFileToDrive(targetFolderId, item.file, item.id);

            if (result.ok && result.file && result.file.driveFileId) {
              const uploadedFile = result.file;
              currentUploaded = [
                ...currentUploaded.filter((f) => f.id !== uploadedFile.id && f.driveFileId !== uploadedFile.driveFileId),
                uploadedFile
              ];
              currentPending = currentPending.map((p) =>
                p.id === item.id
                  ? { ...p, status: "success" as const, uploadedResult: uploadedFile, errorMessage: undefined }
                  : p
              );
            } else {
              currentPending = currentPending.map((p) =>
                p.id === item.id
                  ? { ...p, status: "error" as const, errorMessage: result.error || "No se obtuvo un fileId válido de Drive" }
                  : p
              );
            }
            setPendingFiles([...currentPending]);
            setUploadedFiles([...currentUploaded]);
          }
        } else {
          // El servidor de subida no respondió
          currentPending = currentPending.map((p) => ({
            ...p,
            status: "error" as const,
            errorMessage: "Error de conexión al subir archivo"
          }));
          setPendingFiles([...currentPending]);
        }
      }

      setUploadingProgressText("Guardando pedido...");

      const failedCount = currentPending.filter((p) => p.status === "error").length;
      const allDone = currentPending.length === 0 || currentPending.every((p) => p.status === "success");

      const savedProject = constructProjectData(currentUploaded, allDone ? "ready" : "pending");
      if (!savedProject.id || !savedProject.id.trim()) {
        savedProject.id = activeProjectId || (project?.id && project.id.trim()) || `proj_${Date.now()}`;
      }
      await onSave(savedProject);

      if (allDone) {
        if (currentPending.length > 0) {
          setUploadSuccessSummary(`¡Pedido registrado correctamente! ${currentPending.length} de ${currentPending.length} archivos subidos con éxito.`);
          setTimeout(() => {
            onClose();
          }, 1200);
        } else {
          onClose();
        }
      } else {
        const successCount = currentPending.filter((p) => p.status === "success").length;
        setFormError(`Pedido registrado. ${successCount} de ${currentPending.length} archivos subidos correctamente. ${failedCount} archivo(s) necesita(n) reintentarse.`);
      }
    } catch (err: any) {
      console.error("Error saving project:", err);
      const msg = err?.message || "Ocurrió un error al guardar el pedido. Por favor intenta nuevamente.";
      setFormError(msg);
      // Mantener todos los archivos subidos y pendientes intactos en el estado para permitir reintento
      setUploadedFiles([...currentUploaded]);
      setPendingFiles([...currentPending]);
    } finally {
      setIsSubmitting(false);
      setUploadingProgressText("");
    }
  };

  // Reintentar un archivo específico fallido
  const handleRetrySingleFile = async (fileId: string) => {
    const item = pendingFiles.find((p) => p.id === fileId);
    if (!item) return;

    setIsSubmitting(true);
    setFormError("");
    setUploadSuccessSummary("");
    setUploadingProgressText(`Reintentando subida de "${item.name}"...`);

    try {
      const targetFolderId = await ensureDriveFolder();
      if (!targetFolderId) {
        setPendingFiles((prev) =>
          prev.map((p) =>
            p.id === fileId ? { ...p, status: "error", errorMessage: "Error de conexión al subir archivo" } : p
          )
        );
        setFormError(`No se pudo conectar con el servidor para subir "${item.name}".`);
        setIsSubmitting(false);
        setUploadingProgressText("");
        return;
      }

      setPendingFiles((prev) =>
        prev.map((p) => (p.id === fileId ? { ...p, status: "uploading" } : p))
      );

      const result = await uploadFileToDrive(targetFolderId, item.file, item.id);

      if (result.ok && result.file && result.file.driveFileId) {
        const uploadedFile = result.file;
        const updatedUploaded = [
          ...uploadedFiles.filter((f) => f.id !== uploadedFile.id && f.driveFileId !== uploadedFile.driveFileId),
          uploadedFile
        ];
        setUploadedFiles(updatedUploaded);

        const updatedPending = pendingFiles.map((p) =>
          p.id === fileId
            ? { ...p, status: "success" as const, uploadedResult: uploadedFile, errorMessage: undefined }
            : p
        );
        setPendingFiles(updatedPending);

        const remainingErrors = updatedPending.filter((p) => p.status === "error").length;
        const allCompleted = updatedPending.every((p) => p.status === "success");

        const updatedProj = constructProjectData(
          updatedUploaded,
          allCompleted ? "ready" : "pending"
        );
        if (!updatedProj.id || !updatedProj.id.trim()) {
          updatedProj.id = activeProjectId || (project?.id && project.id.trim()) || `proj_${Date.now()}`;
        }
        await onSave(updatedProj);

        if (allCompleted) {
          setUploadSuccessSummary(`¡Excelente! Todos los archivos (${updatedPending.length} de ${updatedPending.length}) se subieron con éxito.`);
          setTimeout(() => {
            onClose();
          }, 1200);
        } else {
          setFormError(`Archivo "${item.name}" subido con éxito. Quedan ${remainingErrors} archivo(s) por reintentar.`);
        }
      } else {
        setPendingFiles((prev) =>
          prev.map((p) =>
            p.id === fileId ? { ...p, status: "error", errorMessage: result.error || "No se obtuvo un fileId válido de Drive" } : p
          )
        );
        setFormError(`Error al reintentar "${item.name}": ${result.error || "No se obtuvo un fileId válido"}`);
      }
    } catch (err: any) {
      setPendingFiles((prev) =>
        prev.map((p) =>
          p.id === fileId ? { ...p, status: "error", errorMessage: err?.message || "Error al subir" } : p
        )
      );
      setFormError(`Error al subir o guardar "${item.name}": ${err?.message || "Fallo inesperado"}`);
    } finally {
      setIsSubmitting(false);
      setUploadingProgressText("");
    }
  };

  // Reintentar todos los archivos pendientes/fallidos
  const handleRetryAllFailed = async () => {
    const filesToRetry = pendingFiles.filter((p) => p.status !== "success");
    if (filesToRetry.length === 0) return;

    setIsSubmitting(true);
    setFormError("");
    setUploadSuccessSummary("");

    let currentUploaded = [...uploadedFiles];
    let currentPending = [...pendingFiles];

    try {
      const targetFolderId = await ensureDriveFolder();
      if (!targetFolderId) {
        setFormError("No se pudo conectar con el servidor de subida. Por favor verifica la conexión.");
        setIsSubmitting(false);
        return;
      }

      setUploadingProgressText(`Reintentando subida de ${filesToRetry.length} archivo(s)...`);

      for (let i = 0; i < filesToRetry.length; i++) {
        const item = filesToRetry[i];
        
        // Si ya está subido exitosamente con fileId real, no duplicar ni volver a subir
        if (item.status === "success" && item.uploadedResult?.driveFileId) {
          if (!currentUploaded.some((u) => u.driveFileId === item.uploadedResult!.driveFileId || u.id === item.uploadedResult!.id)) {
            currentUploaded.push(item.uploadedResult);
          }
          continue;
        }

        setUploadingProgressText(`Subiendo archivo ${i + 1} de ${filesToRetry.length}... (${item.name})`);
        
        currentPending = currentPending.map((p) => (p.id === item.id ? { ...p, status: "uploading" } : p));
        setPendingFiles([...currentPending]);

        const result = await uploadFileToDrive(targetFolderId, item.file, item.id);

        if (result.ok && result.file && result.file.driveFileId) {
          const uploadedFile = result.file;
          currentUploaded = [
            ...currentUploaded.filter((f) => f.id !== uploadedFile.id && f.driveFileId !== uploadedFile.driveFileId),
            uploadedFile
          ];
          currentPending = currentPending.map((p) =>
            p.id === item.id
              ? { ...p, status: "success" as const, uploadedResult: uploadedFile, errorMessage: undefined }
              : p
          );
        } else {
          currentPending = currentPending.map((p) =>
            p.id === item.id
              ? { ...p, status: "error" as const, errorMessage: result.error || "No se obtuvo un fileId válido de Drive" }
              : p
          );
        }
        setPendingFiles([...currentPending]);
        setUploadedFiles([...currentUploaded]);
      }

      const failedCount = currentPending.filter((p) => p.status === "error").length;
      const allDone = currentPending.every((p) => p.status === "success");

      const savedProject = constructProjectData(currentUploaded, allDone ? "ready" : "pending");
      if (!savedProject.id || !savedProject.id.trim()) {
        savedProject.id = activeProjectId || (project?.id && project.id.trim()) || `proj_${Date.now()}`;
      }
      await onSave(savedProject);

      if (allDone) {
        setUploadSuccessSummary(`¡Pedido registrado correctamente! ${currentPending.length} de ${currentPending.length} archivos subidos con éxito.`);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        const successCount = currentPending.filter((p) => p.status === "success").length;
        setFormError(`Pedido registrado. ${successCount} de ${currentPending.length} archivos subidos correctamente. ${failedCount} archivo(s) necesita(n) reintentarse.`);
      }
    } catch (err: any) {
      console.error("Error retrying uploads:", err);
      setFormError(err?.message || "Ocurrió un error al reintentar la subida.");
      // Mantener archivos en el estado para no perderlos
      setUploadedFiles([...currentUploaded]);
      setPendingFiles([...currentPending]);
    } finally {
      setIsSubmitting(false);
      setUploadingProgressText("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative max-w-6xl w-full bg-[#FAF9F5] dark:bg-[#121110] text-stone-900 dark:text-stone-100 rounded-3xl shadow-2xl border border-stone-200/80 dark:border-stone-800 flex flex-col max-h-[92vh] animate-fade-in overflow-hidden">
        
        {/* HEADER BAR */}
        <div className="px-6 py-5 border-b border-stone-200/80 dark:border-stone-800 flex items-center justify-between bg-white dark:bg-[#161412]">
          <div className="space-y-0.5">
            <span className="text-[10px] font-space font-bold uppercase tracking-[0.25em] text-amber-700 dark:text-amber-400">
              {project ? "Modificar Ficha de Pedido" : "Nuevo Pedido de Alta Costura"}
            </span>
            <h2 className="font-serif font-bold text-2xl text-stone-950 dark:text-stone-50">
              {currentCatalogItem.title}
            </h2>
          </div>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleAttemptClose}
            className={`p-2 rounded-full transition-colors ${
              isSubmitting
                ? "opacity-30 cursor-not-allowed bg-stone-100 dark:bg-stone-800 text-stone-400"
                : "bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 cursor-pointer"
            }`}
            title={isSubmitting ? "Subida de archivos en curso..." : "Cerrar formulario"}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM CONTENT & STICKY SUMMARY GRID */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-stone-200 dark:divide-stone-800">
          
          {/* LEFT 8 COLS: Progressive Sections */}
          <div className="lg:col-span-8 p-6 sm:p-8 space-y-10 overflow-y-auto">
            
            {formError && (
              <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-2xl text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
                <span>{formError}</span>
              </div>
            )}

            {/* SECTION 1: SELECCIÓN DE SERVICIO Y PAQUETE */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <span className="w-5 h-px bg-amber-500" />
                <h3 className="text-xs uppercase font-space font-bold tracking-[0.2em] text-amber-700 dark:text-amber-400">
                  1. Servicio y Paquete Elegido
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">
                    Tipo de Servicio
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as ProjectType)}
                    className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-sm focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  >
                    {SERVICES_CATALOG_DATA.map((srv) => (
                      <option key={srv.type} value={srv.type}>
                        {srv.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">
                    Paquete Seleccionado
                  </label>
                  <select
                    value={selectedPackageId}
                    onChange={(e) => setSelectedPackageId(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-sm focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  >
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} — S/ {pkg.priceInPEN} ({pkg.delivery})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Variantes del servicio si aplican (ej. Spot Publicitario / Locución) */}
                {currentCatalogItem.variants && currentCatalogItem.variants.length > 0 && (
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">
                      Variante o Formato de Servicio
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {currentCatalogItem.variants.map((v) => {
                        const isSelected = serviceVariant === v.label;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setServiceVariant(v.label)}
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

                {/* Resumen del paquete actual */}
                <div className="sm:col-span-2 p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-space font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      Alcance del Paquete {currentPackage?.name}
                    </span>
                    <span className="font-mono text-stone-500">
                      Entrega: {currentPackage?.delivery}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 font-normal">
                    {currentPackage?.description}
                  </p>
                </div>

                {/* Servicios bajo cotización especial si aplican */}
                {currentCatalogItem.quotesOnlyFeatures && currentCatalogItem.quotesOnlyFeatures.length > 0 && (
                  <div className="sm:col-span-2 p-3 bg-stone-100/60 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-space font-bold text-amber-700 dark:text-amber-400 block">
                      Servicios Especiales Disponibles (A cotizar):
                    </span>
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {currentCatalogItem.quotesOnlyFeatures.map((qf, i) => (
                        <span key={i} className="text-[11px] bg-white dark:bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-normal">
                          • {qf}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 2: DATOS DE CONTACTO */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <span className="w-5 h-px bg-amber-500" />
                <h3 className="text-xs uppercase font-space font-bold tracking-[0.2em] text-amber-700 dark:text-amber-400">
                  Datos de contacto
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ej. Sofía Alejandra"
                    className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-sm focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Ej. +51 912 345 678"
                    className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-sm focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-sm focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: CAMPOS ESPECÍFICOS SEGÚN SERVICIO */}
            {/* 3A: BODA */}
            {selectedType === ProjectType.BODA && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                  <span className="w-5 h-px bg-amber-500" />
                  <h3 className="text-xs uppercase font-space font-bold tracking-[0.2em] text-amber-700 dark:text-amber-400">
                    Detalles de la boda
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Nombre del Novio</label>
                    <input
                      type="text"
                      value={weddingNovio}
                      onChange={(e) => setWeddingNovio(e.target.value)}
                      placeholder="Ej. Alejandro"
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Nombre de la Novia</label>
                    <input
                      type="text"
                      value={weddingNovia}
                      onChange={(e) => setWeddingNovia(e.target.value)}
                      placeholder="Ej. Sofía"
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Fecha del Evento</label>
                    <input
                      type="date"
                      value={weddingFecha}
                      onChange={(e) => setWeddingFecha(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Hora</label>
                    <input
                      type="text"
                      value={weddingHora}
                      onChange={(e) => setWeddingHora(e.target.value)}
                      placeholder="Ej. 17:00 hrs"
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">WhatsApp para RSVP</label>
                    <input
                      type="text"
                      value={confirmWeddingWhatsapp}
                      onChange={(e) => setConfirmWeddingWhatsapp(e.target.value)}
                      placeholder="Ej. +51 932350348"
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                {/* Ceremonia & Google Maps Helper */}
                <div className="space-y-3 p-4 bg-stone-50 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800">
                  <h4 className="text-xs font-bold uppercase font-space text-amber-700 dark:text-amber-400">Ceremonia Religiosa / Civil</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={ceremoniaIglesia}
                      onChange={(e) => setCeremoniaIglesia(e.target.value)}
                      placeholder="Nombre del Templo o Lugar"
                      className="w-full h-11 px-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={ceremoniaMaps}
                        onChange={(e) => setCeremoniaMaps(e.target.value)}
                        placeholder="Enlace Google Maps"
                        className="flex-1 h-11 px-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => openGoogleMapsSearch(ceremoniaIglesia || ceremoniaDireccion)}
                        className="px-3 h-11 bg-stone-900 text-white dark:bg-amber-400 dark:text-stone-950 rounded-xl text-xs font-bold font-space shrink-0 cursor-pointer"
                        title="Buscar en Google Maps"
                      >
                        Buscar Maps
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recepción */}
                <div className="space-y-3 p-4 bg-stone-50 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800">
                  <h4 className="text-xs font-bold uppercase font-space text-amber-700 dark:text-amber-400">Recepción / Fiesta</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={recepcionLocal}
                      onChange={(e) => setRecepcionLocal(e.target.value)}
                      placeholder="Nombre del Salón o Hacienda"
                      className="w-full h-11 px-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={recepcionMaps}
                        onChange={(e) => setRecepcionMaps(e.target.value)}
                        placeholder="Enlace Google Maps"
                        className="flex-1 h-11 px-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => openGoogleMapsSearch(recepcionLocal || recepcionDireccion)}
                        className="px-3 h-11 bg-stone-900 text-white dark:bg-amber-400 dark:text-stone-950 rounded-xl text-xs font-bold font-space shrink-0 cursor-pointer"
                        title="Buscar en Google Maps"
                      >
                        Buscar Maps
                      </button>
                    </div>
                  </div>
                </div>

                {/* Palette Cards Selector */}
                <div className="space-y-3">
                  <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300 block">
                    Paleta de Colores de Alta Costura
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {WEDDING_PALETTES.map((pal) => {
                      const isSelected = !isCustomPalette && weddingPaletteName === pal.name;
                      return (
                        <button
                          key={pal.name}
                          type="button"
                          onClick={() => {
                            setIsCustomPalette(false);
                            setWeddingPaletteName(pal.name);
                          }}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
                            isSelected
                              ? "border-amber-500 bg-amber-500/10 shadow-sm"
                              : "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-serif font-bold text-stone-900 dark:text-stone-100">{pal.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                          </div>
                          <div className="flex gap-1">
                            {pal.colors.map((c, idx) => (
                              <span key={idx} className="w-5 h-5 rounded-full border border-stone-300 shadow-xs" style={{ backgroundColor: c }} />
                            ))}
                          </div>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 font-normal">{pal.desc}</p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCustomPalette(!isCustomPalette)}
                      className="text-xs font-space font-bold text-amber-700 dark:text-amber-400 underline cursor-pointer"
                    >
                      {isCustomPalette ? "← Elegir paleta prediseñada" : "+ Crear mi propia paleta personalizada"}
                    </button>
                    {isCustomPalette && (
                      <input
                        type="text"
                        value={weddingPaletteCustom}
                        onChange={(e) => setWeddingPaletteCustom(e.target.value)}
                        placeholder="Ej. Rosa cuarzo, Dorado antiguo y Marfil"
                        className="mt-2 w-full h-11 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs"
                      />
                    )}
                  </div>
                </div>

                {/* Music & YouTube Helper */}
                <div className="space-y-3 p-4 bg-stone-50 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800">
                  <h4 className="text-xs font-bold uppercase font-space text-amber-700 dark:text-amber-400">Música de Fondo (YouTube)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={weddingMusica}
                      onChange={(e) => setWeddingMusica(e.target.value)}
                      placeholder="Nombre de canción y artista"
                      className="w-full h-11 px-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={weddingYoutube}
                        onChange={(e) => setWeddingYoutube(e.target.value)}
                        placeholder="Enlace YouTube"
                        className="flex-1 h-11 px-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => openYouTubeSearch(weddingMusica)}
                        className="px-3 h-11 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold font-space shrink-0 cursor-pointer"
                        title="Buscar en YouTube"
                      >
                        Buscar YouTube
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3B: XV AÑOS */}
            {selectedType === ProjectType.XV_ANOS && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                  <span className="w-5 h-px bg-amber-500" />
                  <h3 className="text-xs uppercase font-space font-bold tracking-[0.2em] text-amber-700 dark:text-amber-400">
                    Detalles de los XV Años
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Nombre de la Quinceañera</label>
                    <input
                      type="text"
                      value={xvName}
                      onChange={(e) => setXvName(e.target.value)}
                      placeholder="Ej. Valeria Nicole"
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Temática de la Fiesta</label>
                    <input
                      type="text"
                      value={xvTematica}
                      onChange={(e) => setXvTematica(e.target.value)}
                      placeholder="Ej. Princesa Floral, Euphoria, Alicia..."
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Fecha del Evento</label>
                    <input
                      type="date"
                      value={xvFecha}
                      onChange={(e) => setXvFecha(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Hora</label>
                    <input
                      type="text"
                      value={xvHora}
                      onChange={(e) => setXvHora(e.target.value)}
                      placeholder="Ej. 19:30 hrs"
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">WhatsApp para Asistencia</label>
                    <input
                      type="text"
                      value={xvConfirmWhatsapp}
                      onChange={(e) => setXvConfirmWhatsapp(e.target.value)}
                      placeholder="Ej. +51 987654321"
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                {/* Salón de Eventos & Maps */}
                <div className="space-y-3 p-4 bg-stone-50 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800">
                  <h4 className="text-xs font-bold uppercase font-space text-amber-700 dark:text-amber-400">Salón o Local de Fiesta</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={xvLugar}
                      onChange={(e) => setXvLugar(e.target.value)}
                      placeholder="Nombre del Salón / Hacienda"
                      className="w-full h-11 px-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={xvMaps}
                        onChange={(e) => setXvMaps(e.target.value)}
                        placeholder="Enlace Google Maps"
                        className="flex-1 h-11 px-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => openGoogleMapsSearch(xvLugar || xvDireccion)}
                        className="px-3 h-11 bg-stone-900 text-white dark:bg-amber-400 dark:text-stone-950 rounded-xl text-xs font-bold font-space shrink-0 cursor-pointer"
                        title="Buscar en Google Maps"
                      >
                        Buscar Maps
                      </button>
                    </div>
                  </div>
                </div>

                {/* Palette Cards for XV */}
                <div className="space-y-3">
                  <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300 block">
                    Paleta de Color para XV
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {XV_PALETTES.map((pal) => (
                      <button
                        key={pal.name}
                        type="button"
                        onClick={() => setXvPalette(pal.name)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                          xvPalette === pal.name
                            ? "border-amber-500 bg-amber-500/10 shadow-sm"
                            : "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-serif font-bold text-stone-900 dark:text-stone-100">{pal.name}</span>
                          {xvPalette === pal.name && <Check className="w-3.5 h-3.5 text-amber-600" />}
                        </div>
                        <div className="flex gap-1">
                          {pal.colors.map((c, idx) => (
                            <span key={idx} className="w-4 h-4 rounded-full border border-stone-300 shadow-xs" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Música */}
                <div className="space-y-3 p-4 bg-stone-50 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800">
                  <h4 className="text-xs font-bold uppercase font-space text-amber-700 dark:text-amber-400">Canción de Entrada / Vals</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={xvMusica}
                      onChange={(e) => setXvMusica(e.target.value)}
                      placeholder="Nombre de canción y artista"
                      className="w-full h-11 px-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={xvYoutube}
                        onChange={(e) => setXvYoutube(e.target.value)}
                        placeholder="Enlace YouTube"
                        className="flex-1 h-11 px-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => openYouTubeSearch(xvMusica)}
                        className="px-3 h-11 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold font-space shrink-0 cursor-pointer"
                        title="Buscar en YouTube"
                      >
                        Buscar YouTube
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3C: CUMPLEAÑOS */}
            {selectedType === ProjectType.CUMPLEANOS && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                  <span className="w-5 h-px bg-amber-500" />
                  <h3 className="text-xs uppercase font-space font-bold tracking-[0.2em] text-amber-700 dark:text-amber-400">
                    Detalles del Cumpleaños
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Nombre del Festejado</label>
                    <input
                      type="text"
                      value={bdayName}
                      onChange={(e) => setBdayName(e.target.value)}
                      placeholder="Ej. Mateo"
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Edad que Cumple</label>
                    <input
                      type="text"
                      value={bdayAge}
                      onChange={(e) => setBdayAge(e.target.value)}
                      placeholder="Ej. 30 años / 5 añitos"
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Temática / Estilo</label>
                    <input
                      type="text"
                      value={bdayTematica}
                      onChange={(e) => setBdayTematica(e.target.value)}
                      placeholder="Ej. Retro 90s, Selva, Neón..."
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Fecha</label>
                    <input
                      type="date"
                      value={bdayFecha}
                      onChange={(e) => setBdayFecha(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Hora</label>
                    <input
                      type="text"
                      value={bdayHora}
                      onChange={(e) => setBdayHora(e.target.value)}
                      placeholder="Ej. 16:00 hrs"
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">WhatsApp RSVP</label>
                    <input
                      type="text"
                      value={bdayConfirmWhatsapp}
                      onChange={(e) => setBdayConfirmWhatsapp(e.target.value)}
                      placeholder="Ej. +51 932350348"
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                {/* Lugar & Maps */}
                <div className="space-y-3 p-4 bg-stone-50 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800">
                  <h4 className="text-xs font-bold uppercase font-space text-amber-700 dark:text-amber-400">Lugar del Festejo</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={bdayLugar}
                      onChange={(e) => setBdayLugar(e.target.value)}
                      placeholder="Dirección o nombre del local"
                      className="w-full h-11 px-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={bdayMaps}
                        onChange={(e) => setBdayMaps(e.target.value)}
                        placeholder="Enlace Google Maps"
                        className="flex-1 h-11 px-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => openGoogleMapsSearch(bdayLugar)}
                        className="px-3 h-11 bg-stone-900 text-white dark:bg-amber-400 dark:text-stone-950 rounded-xl text-xs font-bold font-space shrink-0 cursor-pointer"
                      >
                        Buscar Maps
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3D: CARTA / MENÚ DIGITAL */}
            {selectedType === ProjectType.CARTA_DIGITAL && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                  <span className="w-5 h-px bg-amber-500" />
                  <h3 className="text-xs uppercase font-space font-bold tracking-[0.2em] text-amber-700 dark:text-amber-400">
                    Detalles del Menú Digital
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Nombre del Restaurante / Bar</label>
                    <input
                      type="text"
                      value={menuBusinessName}
                      onChange={(e) => setMenuBusinessName(e.target.value)}
                      placeholder="Ej. Osteria Di Nonna"
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Dirección Comercial</label>
                    <input
                      type="text"
                      value={menuAddress}
                      onChange={(e) => setMenuAddress(e.target.value)}
                      placeholder="Ej. Av. Larco 450, Miraflores"
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">WhatsApp de Pedidos / Comandas</label>
                    <input
                      type="text"
                      value={menuWhatsapp}
                      onChange={(e) => setMenuWhatsapp(e.target.value)}
                      placeholder="Ej. +51 987654321"
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Instagram / Redes</label>
                    <input
                      type="text"
                      value={menuInstagram}
                      onChange={(e) => setMenuInstagram(e.target.value)}
                      placeholder="@turestaurante"
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                {/* Constructor de Platillos */}
                <div className="space-y-3 p-4 bg-stone-50 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase font-space text-amber-700 dark:text-amber-400">
                      Platillos y Bebidas ({menuItems.length})
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
                    <input
                      type="text"
                      value={tempItemName}
                      onChange={(e) => setTempItemName(e.target.value)}
                      placeholder="Nombre del plato"
                      className="h-10 px-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs"
                    />
                    <input
                      type="text"
                      value={tempItemDesc}
                      onChange={(e) => setTempItemDesc(e.target.value)}
                      placeholder="Descripción / Ingredientes"
                      className="h-10 px-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs"
                    />
                    <input
                      type="number"
                      step="0.5"
                      value={tempItemPrice}
                      onChange={(e) => setTempItemPrice(e.target.value)}
                      placeholder="Precio (S/)"
                      className="h-10 px-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddMenuItem}
                      className="h-10 bg-stone-900 text-white dark:bg-amber-400 dark:text-stone-950 rounded-xl text-xs font-bold font-space flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Agregar</span>
                    </button>
                  </div>

                  {menuItems.length > 0 && (
                    <div className="space-y-1.5 pt-2 max-h-40 overflow-y-auto">
                      {menuItems.map((item) => (
                        <div key={item.id} className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-stone-900 dark:text-stone-100">{item.name}</span>
                            <span className="text-stone-400 ml-2 font-mono">{formatCurrencyPrice(item.price, currency)}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveMenuItem(item.id)}
                            className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3E: LANDING PAGE */}
            {selectedType === ProjectType.LANDING_PAGE && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                  <span className="w-5 h-px bg-amber-500" />
                  <h3 className="text-xs uppercase font-space font-bold tracking-[0.2em] text-amber-700 dark:text-amber-400">
                    Detalles de la Landing Page
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Nombre de la Empresa / Marca</label>
                    <input
                      type="text"
                      value={landingBrand}
                      onChange={(e) => setLandingBrand(e.target.value)}
                      placeholder="Ej. Nova Clean Studio"
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Objetivo Principal</label>
                    <select
                      value={landingGoal}
                      onChange={(e) => setLandingGoal(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    >
                      <option value="Captación de prospectos (Leads)">Captación de prospectos (Leads)</option>
                      <option value="Venta directa de producto o servicio">Venta directa de producto o servicio</option>
                      <option value="Lanzamiento de nueva marca / app">Lanzamiento de nueva marca / app</option>
                      <option value="Portafolio profesional de autor">Portafolio profesional de autor</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">WhatsApp de Conversión</label>
                    <input
                      type="text"
                      value={landingWhatsapp}
                      onChange={(e) => setLandingWhatsapp(e.target.value)}
                      placeholder="Ej. +51 912 345 678"
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Redes Sociales o Web Actual</label>
                    <input
                      type="text"
                      value={landingSocials}
                      onChange={(e) => setLandingSocials(e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Secciones Deseadas</label>
                  <input
                    type="text"
                    value={landingSections}
                    onChange={(e) => setLandingSections(e.target.value)}
                    placeholder="Hero, Beneficios, Servicios, Testimonios, FAQ, Formulario"
                    className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* 3F: SPOT PUBLICITARIO / LOCUCIÓN */}
            {selectedType === ProjectType.SPOT && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                  <span className="w-5 h-px bg-amber-500" />
                  <h3 className="text-xs uppercase font-space font-bold tracking-[0.2em] text-amber-700 dark:text-amber-400">
                    Detalles del Spot Publicitario
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Campaña o Producto</label>
                    <input
                      type="text"
                      value={spotCampaign}
                      onChange={(e) => setSpotCampaign(e.target.value)}
                      placeholder="Ej. Promoción de Aniversario"
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Medio de Difusión</label>
                    <select
                      value={spotTargetMedia}
                      onChange={(e) => setSpotTargetMedia(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    >
                      <option value="Redes Sociales (Reels/TikTok/Instagram)">Redes Sociales (Reels/TikTok/Instagram)</option>
                      <option value="Radio Comercial">Radio Comercial</option>
                      <option value="Perifoneo / Altavoz">Perifoneo / Altavoz</option>
                      <option value="YouTube / Podcast Ads">YouTube / Podcast Ads</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Duración Estimada</label>
                    <select
                      value={spotDuration}
                      onChange={(e) => setSpotDuration(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    >
                      <option value="20 Segundos">20 Segundos (Flash)</option>
                      <option value="30 Segundos">30 Segundos (Estándar)</option>
                      <option value="45 Segundos">45 Segundos</option>
                      <option value="60 Segundos">60 Segundos</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Tono de Voz</label>
                    <input
                      type="text"
                      value={spotTone}
                      onChange={(e) => setSpotTone(e.target.value)}
                      placeholder="Ej. Enérgico, Convincente, Cálido..."
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Tipo de Locutor</label>
                    <select
                      value={spotVoiceType}
                      onChange={(e) => setSpotVoiceType(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    >
                      <option value="Voz Masculina">Voz Masculina</option>
                      <option value="Voz Femenina">Voz Femenina</option>
                      <option value="Diálogo (Ambas voces)">Diálogo (Ambas voces)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">
                    Guion Base o Puntos Clave a Mencionar
                  </label>
                  <textarea
                    rows={4}
                    value={spotScript}
                    onChange={(e) => setSpotScript(e.target.value)}
                    placeholder="Escribe el texto a locutar o los puntos que no pueden faltar en el spot..."
                    className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* 3G: PRODUCCIÓN AUDIOVISUAL / VIDEO */}
            {selectedType === ProjectType.FOTO_VIDEO && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                  <span className="w-5 h-px bg-amber-500" />
                  <h3 className="text-xs uppercase font-space font-bold tracking-[0.2em] text-amber-700 dark:text-amber-400">
                    Detalles de la Producción Audiovisual
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Nombre del Proyecto</label>
                    <input
                      type="text"
                      value={videoProjectName}
                      onChange={(e) => setVideoProjectName(e.target.value)}
                      placeholder="Ej. Video Corporativo / Reel Promocional"
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Formato Principal</label>
                    <select
                      value={videoFormat}
                      onChange={(e) => setVideoFormat(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    >
                      <option value="Vertical 9:16 (Reels/TikTok/Shorts)">Vertical 9:16 (Reels/TikTok/Shorts)</option>
                      <option value="Horizontal 16:9 (YouTube/Pantallas)">Horizontal 16:9 (YouTube/Pantallas)</option>
                      <option value="Cuadrado 1:1 (Feed Instagram)">Cuadrado 1:1 (Feed Instagram)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Duración Aproximada</label>
                    <input
                      type="text"
                      value={videoDuration}
                      onChange={(e) => setVideoDuration(e.target.value)}
                      placeholder="Ej. 30 segundos, 1 minuto, 3 minutos..."
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Estilo de Edición</label>
                    <input
                      type="text"
                      value={videoStyle}
                      onChange={(e) => setVideoStyle(e.target.value)}
                      placeholder="Ej. Cinemático, Cortes rápidos, Corporativo sobrio..."
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">
                    Instrucciones de Montaje, Subtítulos o Textos
                  </label>
                  <textarea
                    rows={3}
                    value={videoInstructions}
                    onChange={(e) => setVideoInstructions(e.target.value)}
                    placeholder="Indica qué tomas priorizar, rótulos que deben aparecer, música sugerida..."
                    className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* 3H: IDENTIDAD GRÁFICA & BRANDING */}
            {selectedType === ProjectType.DISENO_GRAFICO && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                  <span className="w-5 h-px bg-amber-500" />
                  <h3 className="text-xs uppercase font-space font-bold tracking-[0.2em] text-amber-700 dark:text-amber-400">
                    Detalles de Identidad & Branding
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Nombre de la Marca</label>
                    <input
                      type="text"
                      value={brandingBrandName}
                      onChange={(e) => setBrandingBrandName(e.target.value)}
                      placeholder="Ej. Lumière Couture"
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Rubro o Industria</label>
                    <input
                      type="text"
                      value={brandingIndustry}
                      onChange={(e) => setBrandingIndustry(e.target.value)}
                      placeholder="Ej. Moda femenina, Gastronomía, Bienes Raíces..."
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Personalidad Deseada</label>
                    <input
                      type="text"
                      value={brandingPersonality}
                      onChange={(e) => setBrandingPersonality(e.target.value)}
                      placeholder="Ej. Minimalista, Sofisticado, Juvenil, Tecnológico..."
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Colores Preferidos o a Evitar</label>
                    <input
                      type="text"
                      value={brandingColors}
                      onChange={(e) => setBrandingColors(e.target.value)}
                      placeholder="Ej. Preferencia por negro y dorado. Evitar rojo."
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">
                    Requerimientos Específicos o Referencias
                  </label>
                  <textarea
                    rows={3}
                    value={brandingRequirements}
                    onChange={(e) => setBrandingRequirements(e.target.value)}
                    placeholder="Marcas que te inspiran, símbolos que te gustaría incorporar..."
                    className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* 3I: ARTES MULTIMEDIA */}
            {selectedType === ProjectType.ARTES_MULTIMEDIA && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                  <span className="w-5 h-px bg-amber-500" />
                  <h3 className="text-xs uppercase font-space font-bold tracking-[0.2em] text-amber-700 dark:text-amber-400">
                    Detalles de Artes Multimedia & Pieza Gráfica
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Tipo de Pieza</label>
                    <select
                      value={artPieceType}
                      onChange={(e) => setArtPieceType(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    >
                      <option value="Flyer Promocional / Evento">Flyer Promocional / Evento</option>
                      <option value="Post Cuadrado para Redes (1:1)">Post Cuadrado para Redes (1:1)</option>
                      <option value="Historia / Reel Cover (9:16)">Historia / Reel Cover (9:16)</option>
                      <option value="Banner Publicitario Web">Banner Publicitario Web</option>
                      <option value="Afiche Publicitario para Impresión">Afiche Publicitario para Impresión</option>
                      <option value="Fotomontaje / Arte Digital Complejo">Fotomontaje / Arte Digital Complejo</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Dimensiones / Formato</label>
                    <select
                      value={artDimensions}
                      onChange={(e) => setArtDimensions(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    >
                      <option value="Vertical 9:16 (Stories / Reels / TikTok)">Vertical 9:16 (Stories / Reels / TikTok)</option>
                      <option value="Cuadrado 1:1 (Feed Instagram / Facebook)">Cuadrado 1:1 (Feed Instagram / Facebook)</option>
                      <option value="Horizontal 16:9 (Banners / Web / YouTube)">Horizontal 16:9 (Banners / Web / YouTube)</option>
                      <option value="A4 / Carta (Para impresión física)">A4 / Carta (Para impresión física)</option>
                      <option value="Medida Personalizada">Medida Personalizada</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Titular o Mensaje Principal</label>
                    <input
                      type="text"
                      value={artTitle}
                      onChange={(e) => setArtTitle(e.target.value)}
                      placeholder="Ej. Gran Apertura / 50% Descuento / Concierto en Vivo"
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Estilo Visual Sugerido</label>
                    <input
                      type="text"
                      value={artStyle}
                      onChange={(e) => setArtStyle(e.target.value)}
                      placeholder="Ej. Neón, Sofisticado, Corporativo sobrio, Minimalista..."
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">
                    Textos, Información y Detalles que deben figurar
                  </label>
                  <textarea
                    rows={3}
                    value={artCopy}
                    onChange={(e) => setArtCopy(e.target.value)}
                    placeholder="Incluye fechas, lugares, ofertas, llamada a la acción, WhatsApp de contacto, etc."
                    className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">
                    Colores o lineamientos visuales
                  </label>
                  <input
                    type="text"
                    value={artColors}
                    onChange={(e) => setArtColors(e.target.value)}
                    placeholder="Ej. Tonos oscuros con acentos dorados y magenta"
                    className="w-full h-11 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* 3J: OTRO */}
            {selectedType === ProjectType.OTRO && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                  <span className="w-5 h-px bg-amber-500" />
                  <h3 className="text-xs uppercase font-space font-bold tracking-[0.2em] text-amber-700 dark:text-amber-400">
                    Detalles del Proyecto
                  </h3>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Descripción General</label>
                  <textarea
                    rows={3}
                    value={otherDescription}
                    onChange={(e) => setOtherDescription(e.target.value)}
                    placeholder="Explica detalladamente qué deseas crear..."
                    className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-space font-bold uppercase text-stone-700 dark:text-stone-300">Requerimientos Técnicos o Plazos</label>
                  <textarea
                    rows={2}
                    value={otherRequirements}
                    onChange={(e) => setOtherRequirements(e.target.value)}
                    placeholder="Formatos de entrega, plazos, requerimientos..."
                    className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* SECTION 4: FOTOGRAFÍAS Y ARCHIVOS (MEDIA UPLOADER) */}
            <MediaUploader
              serviceType={selectedType}
              existingFiles={uploadedFiles}
              onChangeExistingFiles={setUploadedFiles}
              pendingFiles={pendingFiles}
              onChangePendingFiles={setPendingFiles}
              googleDriveUrl={googleDriveUrl}
              onChangeGoogleDriveUrl={setGoogleDriveUrl}
              isUploading={isSubmitting}
              onRetryFile={handleRetrySingleFile}
              onRetryAllFailed={handleRetryAllFailed}
              uploadSummaryMessage={uploadSuccessSummary}
            />

            {/* SECTION 5: EXTRAS Y CARACTERÍSTICAS INCLUIDAS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <span className="w-5 h-px bg-amber-500" />
                <h3 className="text-xs uppercase font-space font-bold tracking-[0.2em] text-amber-700 dark:text-amber-400">
                  Características Incluidas y Extras Opcionales
                </h3>
              </div>

              <div className="space-y-2.5">
                {currentCatalogItem.addons.map((addon) => {
                  const isIncludedInPackage = isFeatureActive(addon.id, currentPackage, []);
                  const isSelected = isIncludedInPackage || selectedAddons.includes(addon.id);

                  const toggleAddon = () => {
                    if (isIncludedInPackage) return; // Cannot toggle included feature
                    if (selectedAddons.includes(addon.id)) {
                      setSelectedAddons(selectedAddons.filter((id) => id !== addon.id));
                    } else {
                      setSelectedAddons([...selectedAddons, addon.id]);
                    }
                  };

                  return (
                    <div
                      key={addon.id}
                      onClick={toggleAddon}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isIncludedInPackage
                          ? "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10 cursor-default"
                          : isSelected
                            ? "border-amber-500 bg-amber-500/5 dark:bg-amber-500/10"
                            : "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                          isSelected
                            ? isIncludedInPackage ? "bg-emerald-600 border-emerald-600 text-white" : "bg-amber-500 border-amber-500 text-stone-950"
                            : "border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <span className="text-sm font-serif font-bold text-stone-900 dark:text-stone-100 block">
                            {addon.label}
                          </span>
                          <p className="text-xs text-stone-600 dark:text-stone-300 font-normal">
                            {addon.description}
                          </p>
                        </div>
                      </div>

                      <span className={`text-xs font-mono font-bold shrink-0 px-2.5 py-1 rounded-lg ${
                        isIncludedInPackage
                          ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 uppercase text-[10px]"
                          : "text-amber-700 dark:text-amber-400"
                      }`}>
                        {isIncludedInPackage ? "Incluido en tu paquete" : `+ S/ ${addon.priceInPEN}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 6: NOTAS INTERNAS (ONLY ADMIN) */}
            {isAdminContext && (
              <div className="space-y-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                <label className="text-xs font-space font-bold uppercase text-amber-700 dark:text-amber-400 block">
                  Notas o comentarios del equipo de diseño (Interno de V.A.C.)
                </label>
                <textarea
                  rows={3}
                  value={generalNotes}
                  onChange={(e) => setGeneralNotes(e.target.value)}
                  placeholder="Instrucciones privadas para el equipo..."
                  className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs"
                />
              </div>
            )}

          </div>

          {/* RIGHT 4 COLS: Sticky Order Summary & Submit Actions */}
          <div className="lg:col-span-4 p-6 sm:p-8 bg-stone-50/70 dark:bg-[#151311] flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              
              <div className="space-y-2 border-b border-stone-200 dark:border-stone-800 pb-4">
                <span className="text-xs font-space font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                  Resumen del Pedido
                </span>
                <h4 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-50">
                  {currentCatalogItem.title}
                </h4>
                {serviceVariant && (
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                    Variante: <strong className="text-stone-900 dark:text-stone-100">{serviceVariant}</strong>
                  </p>
                )}
                <p className="text-xs text-stone-600 dark:text-stone-300 font-normal">
                  Paquete: <strong className="text-stone-900 dark:text-stone-100">{currentPackage?.name}</strong>
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-300 font-normal">
                  Entrega estimada: <strong className="text-stone-900 dark:text-stone-100">{currentPackage?.delivery || currentCatalogItem.deliveryTime}</strong>
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-stone-700 dark:text-stone-300">
                  <span>Precio Base ({currentPackage?.name})</span>
                  <span className="font-mono font-semibold">S/ {basePrice}</span>
                </div>

                {selectedAddons.filter(id => !currentPackage?.includedFeatureIds.includes(id)).length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-stone-200 dark:border-stone-800">
                    <span className="text-[11px] font-bold text-stone-500 uppercase font-space">Extras Seleccionados</span>
                    {selectedAddons
                      .filter(id => !currentPackage?.includedFeatureIds.includes(id))
                      .map((addId) => {
                        const addObj = currentCatalogItem.addons.find((a) => a.id === addId);
                        if (!addObj) return null;
                        return (
                          <div key={addId} className="flex items-center justify-between text-stone-600 dark:text-stone-300 text-xs">
                            <span className="truncate pr-2">• {addObj.label}</span>
                            <span className="font-mono font-medium">+ S/ {addObj.priceInPEN}</span>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Total Display */}
              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-500 uppercase font-space font-bold block">Inversión Total</span>
                </div>
                <div className="text-right">
                  <span className="font-serif font-bold text-2xl text-stone-950 dark:text-stone-50">
                    S/ {totalPricePEN}
                  </span>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-6 border-t border-stone-200 dark:border-stone-800">
              {uploadSuccessSummary && (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2 animate-fade-in">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{uploadSuccessSummary}</span>
                </div>
              )}

              {formError && (
                <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-2xl text-xs text-red-700 dark:text-red-400 flex items-start gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{formError}</span>
                </div>
              )}

              {pendingFiles.some((p) => p.status === "error") && !isSubmitting && (
                <button
                  type="button"
                  onClick={handleRetryAllFailed}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-bold font-space text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reintentar Archivos Fallidos ({pendingFiles.filter((p) => p.status === "error").length})</span>
                </button>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                id="submit-project-btn"
                className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-stone-950 font-bold font-space text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{uploadingProgressText || (project ? "Guardando cambios..." : "Registrando pedido...")}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{project ? "Guardar Cambios" : "Registrar Pedido"}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleAttemptClose}
                className="w-full py-3 bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold font-space text-xs uppercase tracking-wider rounded-2xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Cancelar
              </button>
            </div>

          </div>

        </form>

        {/* DIÁLOGO DE SEGURIDAD AL CERRAR SI QUEDAN ARCHIVOS CON ERROR */}
        {showExitConfirm && (
          <div className="absolute inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-[#191715] rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4 animate-fade-in text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                  ¿Deseas salir del formulario?
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1.5 leading-relaxed">
                  Tienes archivos que no se pudieron subir. Tu pedido ya está registrado, pero estos archivos pendientes no se han guardado. ¿Deseas salir de todos modos o volver para reintentar la subida?
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold font-space text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Volver y reintentar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowExitConfirm(false);
                    onClose();
                  }}
                  className="py-3 px-4 bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold font-space text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Cerrar de todos modos
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
