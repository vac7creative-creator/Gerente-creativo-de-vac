/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * CONFIGURACIÓN CENTRALIZADA DE CONTACTO Y COMUNICACIÓN V.A.C. CREATIVE
 * 
 * Centraliza el número comercial de WhatsApp y los generadores de mensajes
 * para evitar números ficticios hardcodeados (como +52) y duplicaciones.
 */
export const CONTACT_CONFIG = {
  brandName: "V.A.C. Creative Studio",
  // Número comercial oficial para Perú (+51)
  whatsappNumber: "51932350348",
  whatsappDisplay: "+51 932 350 348",
  contactEmail: "vac7creative@gmail.com",
  
  createWhatsAppUrl: (message: string) => {
    return `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  },

  getOrderQuoteMessage: (serviceTitle: string, packageName?: string, price?: number, variant?: string) => {
    const pkgText = packageName ? ` en el paquete *${packageName}*` : "";
    const variantText = variant ? ` [Variante: ${variant}]` : "";
    const priceText = price != null ? ` con inversión estimada de *S/ ${price}*` : "";
    return `¡Hola V.A.C. Creative! 👋 Deseo cotizar *${serviceTitle}*${variantText}${pkgText}${priceText}.\n\n¿Podrían brindarme asesoría para iniciar mi proyecto personalizado?`;
  },

  getTrackingQueryMessage: (trackingCode?: string) => {
    const codeText = trackingCode ? ` con código de seguimiento *${trackingCode}*` : "";
    return `¡Hola V.A.C. Creative! 👋 Deseo consultar el estado de avance de mi proyecto${codeText}.`;
  },

  getSampleInquiryMessage: (sampleTitle: string, serviceTitle: string, packageName?: string) => {
    const pkgText = packageName ? ` (Paquete ${packageName})` : "";
    return `¡Hola V.A.C. Creative! 👋 Me gustó mucho el estilo de referencia *"${sampleTitle}"* de *${serviceTitle}*${pkgText}.\n\nQuisiera solicitar un proyecto personalizado con una línea visual y características similares.`;
  }
};
