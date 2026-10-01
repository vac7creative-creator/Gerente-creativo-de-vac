/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Project, 
  ProjectType, 
  ProjectStatus, 
  MenuItem, 
  WeddingDetails, 
  XvDetails, 
  DigitalMenuDetails, 
  OtherDetails 
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
  FileBadge
} from "lucide-react";

interface ProjectFormProps {
  project?: Project; // If provided, we're editing
  onSave: (project: Project) => void;
  onClose: () => void;
}

export default function ProjectForm({
  project,
  onSave,
  onClose
}: ProjectFormProps) {
  
  // 1. Client Identity State
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [selectedType, setSelectedType] = useState<ProjectType>(ProjectType.BODA);
  const [generalNotes, setGeneralNotes] = useState("");
  const [formError, setFormError] = useState("");

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
  const [weddingFotosCsv, setWeddingFotosCsv] = useState(""); // comma separated image URLs
  
  const [weddingPalette, setWeddingPalette] = useState<"Dorado" | "Rose Gold" | "Azul Marino" | "Verde Eucalipto" | "Terracota" | "Blanco" | "Personalizado">("Dorado");
  const [weddingPaletteCustom, setWeddingPaletteCustom] = useState("");
  const [weddingVisualStyle, setWeddingVisualStyle] = useState<"Floral" | "Elegante" | "Moderno" | "Minimalista" | "Luxury" | "Boho">("Elegante");
  
  const [weddingExtras, setWeddingExtras] = useState({
    cuentaRegresiva: true,
    galeriaFotos: true,
    historiaAmor: false,
    confirmacionWhatsapp: true,
    mesaRegalos: false,
    dressCode: true,
    videoFondo: false,
    animacionesPremium: false
  });

  // 3. 15 Years Details State (XV años)
  const [xvName, setXvName] = useState("");
  const [xvFecha, setXvFecha] = useState("");
  const [xvHora, setXvHora] = useState("");
  const [xvLugar, setXvLugar] = useState("");
  const [xvMaps, setXvMaps] = useState("");
  const [xvMusica, setXvMusica] = useState("");
  const [xvGalleryEnabled, setXvGalleryEnabled] = useState(true);
  const [xvVideoEnabled, setXvVideoEnabled] = useState(false);
  const [xvVideoUrl, setXvVideoUrl] = useState("");
  const [xvPalette, setXvPalette] = useState("Rose Gold & Dorado");
  const [xvTematica, setXvTematica] = useState("Princesa Floral");
  const [xvConfirmWhatsapp, setXvConfirmWhatsapp] = useState("");
  const [xvCuentaRegresiva, setXvCuentaRegresiva] = useState(true);
  const [xvExtras, setXvExtras] = useState({
    mesaRegalos: true,
    dressCode: true,
    animacionesPremium: false
  });

  // 4. Digital Menu Details State (Carta Digital)
  const [menuBusinessName, setMenuBusinessName] = useState("");
  const [menuLogoUrl, setMenuLogoUrl] = useState("");
  const [menuAddress, setMenuAddress] = useState("");
  const [menuWhatsapp, setMenuWhatsapp] = useState("");
  const [menuInstagram, setMenuInstagram] = useState("");
  const [menuFacebook, setMenuFacebook] = useState("");
  const [menuTheme, setMenuTheme] = useState<"Moderno" | "Premium" | "Gourmet" | "Fast Food" | "Cafetería">("Gourmet");
  
  // Food items list builder
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  // Individual food item fields
  const [tempItemName, setTempItemName] = useState("");
  const [tempItemDesc, setTempItemDesc] = useState("");
  const [tempItemPrice, setTempItemPrice] = useState("");
  const [tempItemCategory, setTempItemCategory] = useState<"Desayunos" | "Almuerzos" | "Bebidas" | "Postres" | "Otros">("Almuerzos");

  // 5. General Other Details State
  const [otherDescription, setOtherDescription] = useState("");
  const [otherRequirements, setOtherRequirements] = useState("");
  const [otherPaletteBox, setOtherPaletteBox] = useState("");
  const [otherAttachments, setOtherAttachments] = useState("");

  // Load existing project block if available
  useEffect(() => {
    if (project) {
      setClientName(project.clientName || "");
      setClientPhone(project.clientPhone || "");
      setClientEmail(project.clientEmail || "");
      setSelectedType(project.type);
      setGeneralNotes(project.generalNotes || "");

      // Lod weddings
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
        setWeddingYoutube(w.youtubeUrl || "");
        setWeddingFotosCsv(w.multimediaFotos ? w.multimediaFotos.join(", ") : "");
        setWeddingPalette(w.colorPalette || "Dorado");
        setWeddingPaletteCustom(w.colorPaleteCustomValue || "");
        setWeddingVisualStyle(w.visualStyle || "Elegante");
        if (w.extras) {
          setWeddingExtras({ ...w.extras });
        }
      }

      // Load XV years
      if (project.xvDetails) {
        const x = project.xvDetails;
        setXvName(x.quinceaneraName || "");
        setXvFecha(x.fecha || "");
        setXvHora(x.hora || "");
        setXvLugar(x.lugar || "");
        setXvMaps(x.mapsUrl || "");
        setXvMusica(x.musicaNombre || "");
        setXvGalleryEnabled(x.galleryEnabled ?? true);
        setXvVideoEnabled(x.videoEnabled ?? false);
        setXvVideoUrl(x.videoUrl || "");
        setXvPalette(x.colorPalette || "");
        setXvTematica(x.tematica || "");
        setXvConfirmWhatsapp(x.confirmacionWhatsapp || "");
        setXvCuentaRegresiva(x.cuentaRegresiva ?? true);
        if (x.extras) {
          setXvExtras({ ...x.extras });
        }
      }

      // Load Menu details
      if (project.menuDetails) {
        const m = project.menuDetails;
        setMenuBusinessName(m.businessName || "");
        setMenuLogoUrl(m.logoUrl || "");
        setMenuAddress(m.address || "");
        setMenuWhatsapp(m.whatsapp || "");
        setMenuInstagram(m.instagramUrl || "");
        setMenuFacebook(m.facebookUrl || "");
        setMenuTheme(m.designTheme || "Gourmet");
        setMenuItems(m.items || []);
      }

      // Load general items
      if (project.otherDetails) {
        const o = project.otherDetails;
        setOtherDescription(o.description || "");
        setOtherRequirements(o.requirements || "");
        setOtherPaletteBox(o.colorPalette || "");
        setOtherAttachments(o.attachmentsInfo || "");
      }
    }
  }, [project]);

  // Handle dynamic additions to the food items array
  const handleAddFoodItem = () => {
    if (!tempItemName.trim()) {
      alert("Por favor ingrese el nombre del producto.");
      return;
    }
    const priceNum = parseFloat(tempItemPrice) || 0;
    
    const newItem: MenuItem = {
      id: "item-" + Date.now(),
      name: tempItemName.trim(),
      description: tempItemDesc.trim(),
      category: tempItemCategory,
      price: priceNum
    };

    setMenuItems([...menuItems, newItem]);
    
    // reset inputs
    setTempItemName("");
    setTempItemDesc("");
    setTempItemPrice("");
  };

  const handleRemoveFoodItem = (id: string) => {
    setMenuItems(menuItems.filter(i => i.id !== id));
  };

  const fillDemoData = () => {
    setFormError("");
    setClientName("Camila & Mateo Torres");
    setClientPhone("+52 55 8765 4321");
    setClientEmail("boda.torres@gmail.com");
    setGeneralNotes("Solicitan enlace optimizado para WhatsApp con paleta de tonos dorados y confirmación directa.");
    if (selectedType === ProjectType.BODA) {
      setWeddingNovia("Camila Valenzuela");
      setWeddingNovio("Mateo Torres");
      setWeddingFecha("2026-11-21");
      setWeddingHora("17:30");
      setWeddingFrase("En este día y para siempre, decidimos caminar juntos bajo la misma estrella.");
      setCeremoniaIglesia("Parroquia de Santa Prisca");
      setCeremoniaDireccion("Plaza Borda s/n, Centro Histórico");
      setCeremoniaMaps("https://maps.google.com/?q=Santa+Prisca+Taxco");
      setRecepcionLocal("Hacienda San Gabriel de las Palmas");
      setRecepcionDireccion("Km 41.8 Carretera Federal, Amacuzac");
      setRecepcionMaps("https://maps.google.com/?q=Hacienda+San+Gabriel");
      setConfirmWeddingWhatsapp("+525587654321");
      setConfirmWeddingLimite("2026-10-30");
      setWeddingMusica("Can't Help Falling in Love - Kina Grannis");
      setWeddingYoutube("https://youtube.com/watch?v=sample-torres");
      setWeddingFotosCsv("https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800, https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800");
      setWeddingPalette("Dorado");
      setWeddingVisualStyle("Elegante");
    } else if (selectedType === ProjectType.XV_ANOS) {
      setXvName("Valeria Gómez");
      setXvFecha("2026-10-15");
      setXvHora("19:00");
      setXvLugar("Salón Cristal Palace");
      setXvMaps("https://maps.google.com/?q=Salon+Cristal+Palace");
      setXvMusica("A Thousand Years - Christina Perri");
      setXvPalette("Rose Gold & Dorado");
      setXvTematica("Noche de Estrellas Glamour");
      setXvConfirmWhatsapp("+525587654321");
    } else if (selectedType === ProjectType.CARTA_DIGITAL) {
      setMenuBusinessName("Trattoria del Bosque Gourmet");
      setMenuAddress("Av. Insurgentes Sur 1420, CDMX");
      setMenuWhatsapp("+525587654321");
      setMenuTheme("Gourmet");
      if (menuItems.length === 0) {
        setMenuItems([
          { id: "item-1", name: "Carpaccio de Res Trufado", description: "Finas láminas de filete con aceite de trufa blanca, alcaparras y parmesano reggiano.", price: 240, category: "Almuerzos" },
          { id: "item-2", name: "Risotto ai Frutti di Mare", description: "Arroz arborio cocido lentamente en caldo de mariscos, camarones y azafrán.", price: 320, category: "Almuerzos" },
          { id: "item-3", name: "Tiramisú Tradizionale", description: "Bizcochos savoiardi bañados en espresso italiano, mascarpone y cacao amargo.", price: 150, category: "Postres" }
        ]);
      }
    }
  };

  // Compile full object and fire save callback
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName.trim()) {
      setFormError("Por favor introduce el nombre del cliente o contacto.");
      return;
    }
    setFormError("");

    const compiledProject: Project = {
      id: project?.id || "proj-" + Math.floor(100000 + Math.random() * 900000),
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim() || "+52 55 1234 5678",
      clientEmail: clientEmail.trim() || "vacstudio@gmail.com",
      type: selectedType,
      status: project?.status || ProjectStatus.PENDIENTE,
      createdAt: project?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      generalNotes: generalNotes.trim()
    };

    // Embed form fields depending on category
    if (selectedType === ProjectType.BODA) {
      compiledProject.weddingDetails = {
        noviaName: weddingNovia.trim() || "Novia Ejemplo",
        novioName: weddingNovio.trim() || "Novio Ejemplo",
        fecha: weddingFecha || "2026-12-25",
        hora: weddingHora || "18:00",
        fraseEspecial: weddingFrase.trim() || "Un amor escrito en las estrellas habita hoy en nosotros.",
        ceremoniaIglesia: ceremoniaIglesia.trim() || "Iglesia Católica del Rosario",
        ceremoniaDireccion: ceremoniaDireccion.trim() || "Av. Hidalgo s/n, Centro Histórico",
        ceremoniaMapsUrl: ceremoniaMaps.trim() || "https://maps.google.com/?q=Iglesia+del+Rosario",
        recepcionLocal: recepcionLocal.trim() || "Hacienda del Sol",
        recepcionDireccion: recepcionDireccion.trim() || "Km 12 Entrada al Valle, Centro",
        recepcionMapsUrl: recepcionMaps.trim() || "https://maps.google.com/?q=Hacienda+del+Sol",
        confirmacionWhatsapp: confirmWeddingWhatsapp.trim() || "+525512345678",
        confirmacionFechaLimite: confirmWeddingLimite || "2026-11-20",
        multimediaFotos: weddingFotosCsv ? weddingFotosCsv.split(",").map(f => f.trim()).filter(Boolean) : [],
        multimediaVideoUrl: "",
        multimediaMusicaNombre: weddingMusica.trim() || "Perfect - Ed Sheeran",
        youtubeUrl: weddingYoutube.trim(),
        colorPalette: weddingPalette,
        colorPaleteCustomValue: weddingPaletteCustom.trim(),
        visualStyle: weddingVisualStyle,
        extras: { ...weddingExtras }
      };
    } else if (selectedType === ProjectType.XV_ANOS) {
      compiledProject.xvDetails = {
        quinceaneraName: xvName.trim() || "Quinceañera",
        fecha: xvFecha || "2026-09-12",
        hora: xvHora || "20:00",
        lugar: xvLugar.trim() || "Salón Diamante",
        mapsUrl: xvMaps.trim() || "https://maps.google.com",
        musicaNombre: xvMusica.trim() || "Christina Perri - A Thousand Years",
        galleryEnabled: xvGalleryEnabled,
        videoEnabled: xvVideoEnabled,
        videoUrl: xvVideoUrl.trim(),
        colorPalette: xvPalette.trim() || "Rose Gold",
        tematica: xvTematica.trim() || "Elegante Princesa",
        confirmacionWhatsapp: xvConfirmWhatsapp.trim() || "+525544332211",
        cuentaRegresiva: xvCuentaRegresiva,
        extras: { ...xvExtras }
      };
    } else if (selectedType === ProjectType.CARTA_DIGITAL) {
      compiledProject.menuDetails = {
        businessName: menuBusinessName.trim() || "Bistro Gourmet",
        logoUrl: menuLogoUrl.trim() || "https://images.unsplash.com/photo-1543508282-5c1cf72ad7c4?auto=format&fit=crop&q=80&w=200",
        address: menuAddress.trim() || "Centro comercial Las Terrazas",
        whatsapp: menuWhatsapp.trim() || "+525599887766",
        instagramUrl: menuInstagram.trim(),
        facebookUrl: menuFacebook.trim(),
        designTheme: menuTheme,
        items: menuItems
      };
    } else {
      // General others
      compiledProject.otherDetails = {
        description: otherDescription.trim() || "Diseño creativo a medida solicitado.",
        requirements: otherRequirements.trim() || "No especificados.",
        colorPalette: otherPaletteBox.trim() || "No especificada.",
        attachmentsInfo: otherAttachments.trim() || "Sin archivos adjuntos."
      };
    }

    onSave(compiledProject);
  };

  const handleExtraChange = (key: keyof typeof weddingExtras) => {
    setWeddingExtras({
      ...weddingExtras,
      [key]: !weddingExtras[key]
    });
  };

  const handleXvExtraChange = (key: "mesaRegalos" | "dressCode" | "animacionesPremium") => {
    setXvExtras({
      ...xvExtras,
      [key]: !xvExtras[key]
    });
  };

  // Color palettes list tags
  const palettesList: { name: typeof weddingPalette; colorClass: string }[] = [
    { name: "Dorado", colorClass: "bg-amber-100 text-amber-800 border-amber-300" },
    { name: "Rose Gold", colorClass: "bg-pink-100 text-pink-800 border-pink-300" },
    { name: "Azul Marino", colorClass: "bg-blue-900 text-blue-100 border-blue-900" },
    { name: "Verde Eucalipto", colorClass: "bg-emerald-100 text-emerald-800 border-emerald-350" },
    { name: "Terracota", colorClass: "bg-orange-100 text-orange-850 border-orange-350" },
    { name: "Blanco", colorClass: "bg-zinc-50 text-zinc-900 border-zinc-300" },
    { name: "Personalizado", colorClass: "bg-zinc-800 text-white border-zinc-900" }
  ];

  const stylesList: typeof weddingVisualStyle[] = [
    "Floral", "Elegante", "Moderno", "Minimalista", "Luxury", "Boho"
  ];

  // List of XV Años themes suggestions
  const xvThemesList = [
    "Princesa & Cuento de Hadas",
    "Bosque Encantado / Floral",
    "Gala & Elegancia Dorado",
    "Hollywood / Alfombra Roja",
    "Noche de Estrellas / Galaxia",
    "Vintage / Shabby Chic",
    "Neón & Party Night",
    "Mariposas / Primavera"
  ];

  // List of XV Años color palette presets
  const xvPalettesList: { name: string; colorDot: string }[] = [
    { name: "Rose Gold & Blanco", colorDot: "bg-pink-300" },
    { name: "Rosa Pastel & Dorado", colorDot: "bg-pink-200" },
    { name: "Azul Noche & Plata", colorDot: "bg-blue-900" },
    { name: "Lila & Lavanda", colorDot: "bg-purple-300" },
    { name: "Verde Esmeralda & Oro", colorDot: "bg-emerald-600" },
    { name: "Vino / Borgoña & Dorado", colorDot: "bg-rose-900" },
    { name: "Negro & Neón / Glam", colorDot: "bg-zinc-900" },
    { name: "Blanco / Plata / Cristal", colorDot: "bg-slate-300" }
  ];

  return (
    <div id="project-form-container-modal" className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-end">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl h-full flex flex-col shadow-2xl overflow-hidden border-l border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-right duration-200">
        
        {/* Form header */}
        <div className="p-5 border-b border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
              <FileBadge className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white font-space">
                {project ? "Modificar Ficha de Pedido" : "Registrar Nuevo Proyecto"}
              </h2>
              <p className="text-xs text-zinc-500">
                Llene los campos para estructurar automáticamente las configuraciones del cliente.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!project && (
              <button
                type="button"
                onClick={fillDemoData}
                className="px-2.5 py-1 text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                title="Llenar formulario con datos de prueba realistas"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-llenar Demo</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {formError && (
          <div className="mx-6 mt-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 rounded-xl text-xs flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Form body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 text-zinc-750 dark:text-zinc-200">
          
          {/* SECTION 1: Client and Core Service Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
              <span className="text-xs font-bold text-zinc-400 font-mono">1. DATOS FISCALES & CONTACTO</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-650 dark:text-zinc-300">Nombre del Cliente / Propietario *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    required
                    placeholder="Sofia Rodriguez Gomez"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-850"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-650 dark:text-zinc-300">Teléfono (WhatsApp internacional) *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="+525544332211"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-850"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-650 dark:text-zinc-300">Correo electrónico *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="email"
                    placeholder="cliente@sitio.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-850"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-655 dark:text-zinc-300">Servicio de V.A.C. Creative Contratado *</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as ProjectType)}
                  className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-850 cursor-pointer"
                >
                  {Object.values(ProjectType).map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* DYNAMIC FORMS ACCORDING TO SELECTION */}

          {/* 1. WEDDING COMPONENT FORM */}
          {selectedType === ProjectType.BODA && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
                <span className="text-xs font-bold text-zinc-400 font-mono">2. FORMULARIO INTELIGENTE DE BODAS</span>
              </div>

              {/* Novios Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Nombre del novio *</label>
                  <input
                    required={selectedType === ProjectType.BODA}
                    type="text"
                    placeholder="Alejandro Gomez"
                    value={weddingNovio}
                    onChange={(e) => setWeddingNovio(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Nombre de la novia *</label>
                  <input
                    required={selectedType === ProjectType.BODA}
                    type="text"
                    placeholder="Sofia Rodriguez"
                    value={weddingNovia}
                    onChange={(e) => setWeddingNovia(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              {/* Ceremony specifics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Fecha del evento *</label>
                  <input
                    type="date"
                    value={weddingFecha}
                    onChange={(e) => setWeddingFecha(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 text-sand-custom border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Hora de la recepción *</label>
                  <input
                    type="time"
                    value={weddingHora}
                    onChange={(e) => setWeddingHora(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 text-sand shadow-xs border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Mensaje de Frase especial</label>
                  <input
                    type="text"
                    placeholder="Por toda la eternidad..."
                    value={weddingFrase}
                    onChange={(e) => setWeddingFrase(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              {/* Sección ceremonia iglesias */}
              <div className="space-y-3.5 bg-zinc-50/50 dark:bg-zinc-950/20 p-4 rounded-xl border border-zinc-105 dark:border-zinc-850">
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                  ⛪ SECCIÓN CEREMONIA RELIGIOSA
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-500">Nombre de la iglesia</label>
                    <input
                      type="text"
                      placeholder="Catedral de la Asunción"
                      value={ceremoniaIglesia}
                      onChange={(e) => setCeremoniaIglesia(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-500">Dirección física</label>
                    <input
                      type="text"
                      placeholder="Calle Mayoristas #22"
                      value={ceremoniaDireccion}
                      onChange={(e) => setCeremoniaDireccion(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-500">Enlace de Google Maps</label>
                    <input
                      type="text"
                      placeholder="https://maps.google.com/?q=..."
                      value={ceremoniaMaps}
                      onChange={(e) => setCeremoniaMaps(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* Local Ceremonia de Recepción */}
              <div className="space-y-3.5 bg-zinc-50/50 dark:bg-zinc-950/20 p-4 rounded-xl border border-zinc-105 dark:border-zinc-850">
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                  🎉 SECCIÓN RECEPCIÓN / SALÓN
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-500">Nombre del local</label>
                    <input
                      type="text"
                      placeholder="Jardín Las Flores Hermosas"
                      value={recepcionLocal}
                      onChange={(e) => setRecepcionLocal(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-500">Dirección física</label>
                    <input
                      type="text"
                      placeholder="Calzada Real de las Rosas #90"
                      value={recepcionDireccion}
                      onChange={(e) => setRecepcionDireccion(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-500">Enlace Google Maps</label>
                    <input
                      type="text"
                      placeholder="https://maps.google.com/?q=..."
                      value={recepcionMaps}
                      onChange={(e) => setRecepcionMaps(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* Confirmación y Contacto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Teléfono WhatsApp de Invitados *</label>
                  <input
                    type="text"
                    placeholder="+525511223344"
                    value={confirmWeddingWhatsapp}
                    onChange={(e) => setConfirmWeddingWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Fecha límite de confirmación (RSVP) *</label>
                  <input
                    type="date"
                    value={confirmWeddingLimite}
                    onChange={(e) => setConfirmWeddingLimite(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              {/* Diseño y Estética Wedding Palette */}
              <div className="p-4 bg-zinc-50/50 dark:bg-zinc-950/20 rounded-xl border border-zinc-105 dark:border-zinc-850 space-y-4">
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">🎨 PALETA DE COLORES Y ESTILO</span>
                
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 block">Elija la Paleta Visual de Referencia:</label>
                  <div className="flex flex-wrap gap-2">
                    {palettesList.map((p) => (
                      <button
                        type="button"
                        key={p.name}
                        onClick={() => setWeddingPalette(p.name)}
                        className={`text-xs px-3 py-1.5 border rounded-lg font-medium transition-all ${p.colorClass} ${
                          weddingPalette === p.name 
                            ? "ring-2 ring-indigo-500 font-bold" 
                            : "opacity-60 hover:opacity-100"
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                  
                  {weddingPalette === "Personalizado" && (
                    <div className="pt-2">
                      <input
                        type="text"
                        placeholder="Ej. Borgoña y Champán Metálico"
                        value={weddingPaletteCustom}
                        onChange={(e) => setWeddingPaletteCustom(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-500 block">Estilo visual general:</label>
                    <select
                      value={weddingVisualStyle}
                      onChange={(e) => setWeddingVisualStyle(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-zinc-950 border border-zinc-250 rounded-lg cursor-pointer focus:outline-none"
                    >
                      {stylesList.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-zinc-500 block">Música de fondo:</label>
                    <input
                      type="text"
                      placeholder="A Thousand Years - Christina Perri"
                      value={weddingMusica}
                      onChange={(e) => setWeddingMusica(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-zinc-950 border border-zinc-250 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1 pt-1.5">
                  <label className="text-xs text-zinc-505 block">Fotografías Referencia (URLs separadas por comas o información descriptiva)</label>
                  <input
                    type="text"
                    placeholder="https://images.com/foto1.jpg, https://images.com/foto2.jpg"
                    value={weddingFotosCsv}
                    onChange={(e) => setWeddingFotosCsv(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-zinc-950 border border-zinc-250 rounded-lg"
                  />
                </div>
              </div>

              {/* Extras checkbox */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-zinc-400 font-mono block">✨ EXTRAS O CARACTERÍSTICAS ADICIONALES</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.keys(weddingExtras).map((key) => {
                    const extraKey = key as keyof typeof weddingExtras;
                    return (
                      <label 
                        key={key} 
                        className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 rounded-lg cursor-pointer text-xs transition-colors hover:border-zinc-300 dark:hover:border-zinc-700"
                      >
                        <input
                          type="checkbox"
                          checked={weddingExtras[extraKey]}
                          onChange={() => handleExtraChange(extraKey)}
                          className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4 accent-amber-500"
                        />
                        <div className="space-y-0.5">
                          <span className="font-bold capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <p className="text-[10px] text-zinc-400">Habilitar en renderizado</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* 2. 15 YEARS INTERACTIVE FORM */}
          {selectedType === ProjectType.XV_ANOS && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
                <span className="text-xs font-bold text-zinc-400 font-mono">2. FORMULARIO PARA 15 AÑOS</span>
              </div>

              {/* Quinceañera Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold">Nombre de la quinceañera *</label>
                <input
                  required={selectedType === ProjectType.XV_ANOS}
                  type="text"
                  placeholder="Valentina Fernandez"
                  value={xvName}
                  onChange={(e) => setXvName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg"
                />
              </div>

              {/* Temática del Evento con sugerencias + edición manual */}
              <div className="space-y-2 bg-zinc-50/70 dark:bg-zinc-950/30 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    👑 Temática del Evento
                  </label>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    Selecciona una sugerencia o escribe tu temática personal
                  </span>
                </div>
                
                {/* Sugerencias clicables */}
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {xvThemesList.map((theme) => {
                    const isSelected = xvTematica === theme;
                    return (
                      <button
                        type="button"
                        key={theme}
                        onClick={() => setXvTematica(theme)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "bg-amber-400 text-zinc-950 border-amber-500 font-bold shadow-xs scale-102"
                            : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400"
                        }`}
                      >
                        {theme}
                      </button>
                    );
                  })}
                </div>

                {/* Campo manual */}
                <div className="pt-1">
                  <input
                    type="text"
                    placeholder="Escribe o personaliza la temática manualmente..."
                    value={xvTematica}
                    onChange={(e) => setXvTematica(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              {/* Paleta de Colores de Referencia con opciones preestablecidas + campo manual */}
              <div className="space-y-2 bg-zinc-50/70 dark:bg-zinc-950/30 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    🎨 Paleta de Colores de Referencia
                  </label>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    Elige una paleta preestablecida o escribe los colores exactos
                  </span>
                </div>

                {/* Opciones preestablecidas */}
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {xvPalettesList.map((p) => {
                    const isSelected = xvPalette === p.name;
                    return (
                      <button
                        type="button"
                        key={p.name}
                        onClick={() => setXvPalette(p.name)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? "bg-amber-400 text-zinc-950 border-amber-500 font-bold shadow-xs scale-102"
                            : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-amber-400"
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${p.colorDot} border border-black/10`} />
                        <span>{p.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Campo de texto manual de paleta */}
                <div className="pt-1">
                  <input
                    type="text"
                    placeholder="Escribe o ajusta la paleta de colores manualmente..."
                    value={xvPalette}
                    onChange={(e) => setXvPalette(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              {/* Fecha y Hora */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Fecha del Evento *</label>
                  <input
                    type="date"
                    value={xvFecha}
                    onChange={(e) => setXvFecha(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Hora de Apertura *</label>
                  <input
                    type="time"
                    value={xvHora}
                    onChange={(e) => setXvHora(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Salón o Lugar del evento *</label>
                  <input
                    type="text"
                    placeholder="Salón Real Palace s/n"
                    value={xvLugar}
                    onChange={(e) => setXvLugar(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Enlace de Ubicación Maps</label>
                  <input
                    type="text"
                    placeholder="https://maps.google.com/?q=..."
                    value={xvMaps}
                    onChange={(e) => setXvMaps(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Música / Vals solicitado</label>
                  <input
                    type="text"
                    placeholder="Enlace o nombre de canción de vals"
                    value={xvMusica}
                    onChange={(e) => setXvMusica(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">WhatsApp de confirmación invitados *</label>
                  <input
                    type="text"
                    placeholder="+5255455667788"
                    value={xvConfirmWhatsapp}
                    onChange={(e) => setXvConfirmWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-zinc-50 dark:bg-zinc-950/40 p-4 rounded-xl border">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={xvGalleryEnabled}
                    onChange={() => setXvGalleryEnabled(!xvGalleryEnabled)}
                    className="accent-amber-500 rounded"
                  />
                  <span>Habilitar Galería de Fotos</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={xvCuentaRegresiva}
                    onChange={() => setXvCuentaRegresiva(!xvCuentaRegresiva)}
                    className="accent-amber-500 rounded"
                  />
                  <span>Habilitar Cuenta Regresiva</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={xvVideoEnabled}
                    onChange={() => setXvVideoEnabled(!xvVideoEnabled)}
                    className="accent-amber-500 rounded"
                  />
                  <span>Habilitar Sección de Vídeo</span>
                </label>
              </div>

              {xvVideoEnabled && (
                <div className="space-y-1 animate-in slide-in-from-top-1">
                  <label className="text-xs text-zinc-500">Enlace de Vídeo de Quinceañera (YouTube o Vimeo)</label>
                  <input
                    type="text"
                    placeholder="https://youtube.com/watch?v=..."
                    value={xvVideoUrl}
                    onChange={(e) => setXvVideoUrl(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200"
                  />
                </div>
              )}

              {/* Xv extras */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 uppercase font-mono font-bold block">Extras Adicionales 15 años</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer p-2.5 bg-zinc-50 dark:bg-zinc-950 border rounded-lg text-xs">
                    <input 
                      type="checkbox" 
                      accent-amber-500="true"
                      checked={xvExtras.mesaRegalos}
                      onChange={() => handleXvExtraChange("mesaRegalos")}
                    />
                    <span>Mesa de Regalos</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-2.5 bg-zinc-50 dark:bg-zinc-950 border rounded-lg text-xs">
                    <input 
                      type="checkbox" 
                      accent-amber-500="true"
                      checked={xvExtras.dressCode}
                      onChange={() => handleXvExtraChange("dressCode")}
                    />
                    <span>Dress Code</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-2.5 bg-zinc-50 dark:bg-zinc-950 border rounded-lg text-xs">
                    <input 
                      type="checkbox" 
                      accent-amber-500="true"
                      checked={xvExtras.animacionesPremium}
                      onChange={() => handleXvExtraChange("animacionesPremium")}
                    />
                    <span>Animación Premium</span>
                  </label>
                </div>
              </div>

            </div>
          )}

          {/* 3. DIGITAL CARD / MENU COMPONENT FORM */}
          {selectedType === ProjectType.CARTA_DIGITAL && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
                <span className="text-xs font-bold text-zinc-400 font-mono">2. FORMULARIO PARA CARTA / MENÚ DIGITAL</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Nombre comercial del negocio *</label>
                  <input
                    required={selectedType === ProjectType.CARTA_DIGITAL}
                    type="text"
                    placeholder="Bistro Gourmet Sabor Único"
                    value={menuBusinessName}
                    onChange={(e) => setMenuBusinessName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Dirección física del restaurante *</label>
                  <input
                    type="text"
                    placeholder="Av. Juárez #22 Col. Centro"
                    value={menuAddress}
                    onChange={(e) => setMenuAddress(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">WhatsApp de Pedidos *</label>
                  <input
                    type="text"
                    placeholder="+525599887766"
                    value={menuWhatsapp}
                    onChange={(e) => setMenuWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Instagram URL (Opcional)</label>
                  <input
                    type="text"
                    placeholder="https://instagram.com/nombre"
                    value={menuInstagram}
                    onChange={(e) => setMenuInstagram(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Facebook URL (Opcional)</label>
                  <input
                    type="text"
                    placeholder="https://facebook.com/pagina"
                    value={menuFacebook}
                    onChange={(e) => setMenuFacebook(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Enlace o URL de Logo</label>
                  <input
                    type="text"
                    placeholder="https://unsplash.com/.../logo.png"
                    value={menuLogoUrl}
                    onChange={(e) => setMenuLogoUrl(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Estilo / Concepto de Menú *</label>
                  <select
                    value={menuTheme}
                    onChange={(e) => setMenuTheme(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border rounded-lg cursor-pointer focus:outline-none"
                  >
                    <option value="Moderno">Moderno</option>
                    <option value="Premium">Premium</option>
                    <option value="Gourmet">Gourmet</option>
                    <option value="Fast Food">Fast Food</option>
                    <option value="Cafetería">Cafetería</option>
                  </select>
                </div>
              </div>

              {/* IN-FORM PRODUCTS LIST BUILDER */}
              <div className="p-4 bg-zinc-50/50 dark:bg-zinc-950/20 rounded-xl border border-zinc-150 space-y-4">
                <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200 text-xs font-bold">
                  <Utensils className="w-4 h-4 text-emerald-500" />
                  <span>AÑADIR PRODUCTO A LA CARTA / MENÚ</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1 col-span-2">
                    <label className="text-[11px] text-zinc-500">Nombre del platillo/bebida *</label>
                    <input
                      type="text"
                      placeholder="Hamburguesa Rústica con Trufa"
                      value={tempItemName}
                      onChange={(e) => setTempItemName(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-zinc-950 border rounded-md focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-500">Precio (en MXN) *</label>
                    <input
                      type="number"
                      placeholder="180"
                      value={tempItemPrice}
                      onChange={(e) => setTempItemPrice(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-zinc-950 border rounded-md focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1 col-span-2">
                    <label className="text-[11px] text-zinc-500">Descripción rústica de ingredientes</label>
                    <input
                      type="text"
                      placeholder="Carne de res premium con queso cheddar fundido y arúgula..."
                      value={tempItemDesc}
                      onChange={(e) => setTempItemDesc(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-zinc-950 border rounded-md"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-500">Categoría *</label>
                    <select
                      value={tempItemCategory}
                      onChange={(e) => setTempItemCategory(e.target.value as any)}
                      className="w-full px-2 py-1.5 text-xs bg-white dark:bg-zinc-950 border rounded-md cursor-pointer focus:outline-none"
                    >
                      <option value="Desayunos">Breakfast (Desayunos)</option>
                      <option value="Almuerzos">Lunch (Almuerzos)</option>
                      <option value="Bebidas">Drinks (Bebidas)</option>
                      <option value="Postres">Desserts (Postres)</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleAddFoodItem}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Registrar Platillo en Lista
                  </button>
                </div>

                {/* Grid of already registered menu items */}
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 space-y-2">
                  <span className="text-[11px] font-bold text-zinc-450 block">Lista de productos agregados ({menuItems.length})</span>
                  {menuItems.length === 0 ? (
                    <p className="text-[11px] text-zinc-400 italic">No hay productos añadidos al menú todavía. Agregue arriba.</p>
                  ) : (
                    <div className="space-y-2 max-h-[171px] overflow-y-auto pr-1">
                      {menuItems.map((item, index) => (
                        <div key={item.id} className="p-2 sm:p-2.5 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-150 dark:border-zinc-850 flex items-center justify-between gap-3 text-xs">
                          <div className="min-w-0 pr-3">
                            <span className="text-[9.5px] font-bold bg-zinc-150 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-350 px-1 py-0.5 rounded truncate mr-1.5">
                              {item.category}
                            </span>
                            <span className="font-extrabold text-zinc-900 dark:text-white">{item.name}</span>
                            <span className="text-[10px] text-zinc-400 block truncate">{item.description || "Sin descripción."}</span>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">${item.price}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFoodItem(item.id)}
                              className="p-1 rounded hover:bg-red-50 text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* 4. OTHER GENERIC FORM COMPONENT */}
          {selectedType !== ProjectType.BODA && selectedType !== ProjectType.XV_ANOS && selectedType !== ProjectType.CARTA_DIGITAL && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
                <span className="text-xs font-bold text-zinc-400 font-mono">2. FORMULARIO GENERAL DEL CLIENTE</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Descripción del encargo de diseño o servicio *</label>
                <textarea
                  required={selectedType !== ProjectType.BODA && selectedType !== ProjectType.XV_ANOS && selectedType !== ProjectType.CARTA_DIGITAL}
                  rows={4}
                  placeholder="Ingrese el contexto, objetivos, cantidad de pantallas del sitio web o spot publicitario..."
                  value={otherDescription}
                  onChange={(e) => setOtherDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Requerimientos técnicos obligatorios</label>
                  <input
                    type="text"
                    placeholder="Ej. Hosting propio, vídeo 4K, formato vertical, tipografía específica"
                    value={otherRequirements}
                    onChange={(e) => setOtherRequirements(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Paleta de color y vibración visual</label>
                  <input
                    type="text"
                    placeholder="Ej. Minimalista tecnológico, grises lona y amarillo neón"
                    value={otherPaletteBox}
                    onChange={(e) => setOtherPaletteBox(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Referencias multimedia / carpetas Drive / Canales de YouTube</label>
                <input
                  type="text"
                  placeholder="Ej. https://drive.google.com/drive/folders/..., video de ejemplo o carpeta de fotos"
                  value={otherAttachments}
                  onChange={(e) => setOtherAttachments(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200"
                />
              </div>
            </div>
          )}

          {/* Global general internal comments / notes */}
          <div className="space-y-1.5 pt-3">
            <label className="text-xs font-semibold text-zinc-500 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-zinc-400" />
              <span>Notas o comentarios del equipo de diseño (Interno de V.A.C.)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Notas de prioridad o información técnica recabada en llamadas de seguimiento preliminares..."
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-zinc-55 dark:bg-zinc-950 border border-zinc-200 rounded-lg text-zinc-650"
            />
          </div>

        </form>

        {/* Footer actions */}
        <div className="p-4 border-t border-zinc-150 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-150 rounded-lg text-xs font-semibold transition-all cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="submit"
            onClick={(e) => handleSubmit(e)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm hover:-translate-y-0.5"
          >
            <Save className="w-4 h-4 text-white" />
            {project ? "Guardar Modificaciones" : "Registrar Proyecto"}
          </button>
        </div>

      </div>
    </div>
  );
}
