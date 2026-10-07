/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, ProjectType } from "../types";

/**
 * Genera un nombre descriptivo para el proyecto según su tipo y datos cargados.
 * Sigue la convención estándar del estudio V.A.C. Creative:
 * - BODA: "Invitación Virtual de Boda - Higidio y María"
 * - XV: "Invitación Virtual de 15 Años - Alejandra Quispe"
 * - CUMPLEAÑOS: "Invitación Virtual de Cumpleaños - Pamela Torres"
 * - CARTA DIGITAL: "Carta Digital - El Sabor Dora"
 * - LANDING: "Landing Page - Medical Cusco"
 * - SPOT: "Spot Publicitario - Municipalidad de Huayllati"
 * - AUDIOVISUAL: "Audiovisual - Aniversario Huayllati"
 * - ARTES MULTIMEDIA: "Diseño / Artes Multimedia - Evento Grauinas de Corazón"
 * - BRANDING: "Branding - Cusco Infinity Travel"
 * 
 * Si falta información específica, utiliza clientName como respaldo.
 */
export function getDescriptiveProjectName(project: Project): string {
  const client = (project.clientName || "").trim() || "Cliente";

  switch (project.type) {
    case ProjectType.BODA: {
      const novia = project.weddingDetails?.noviaName?.trim();
      const novio = project.weddingDetails?.novioName?.trim();
      if (novio && novia) {
        return `Invitación Virtual de Boda - ${novio} y ${novia}`;
      } else if (novia) {
        return `Invitación Virtual de Boda - ${novia}`;
      } else if (novio) {
        return `Invitación Virtual de Boda - ${novio}`;
      }
      return `Invitación Virtual de Boda - ${client}`;
    }

    case ProjectType.XV_ANOS: {
      const quince = project.xvDetails?.quinceaneraName?.trim();
      if (quince) {
        return `Invitación Virtual de 15 Años - ${quince}`;
      }
      return `Invitación Virtual de 15 Años - ${client}`;
    }

    case ProjectType.CUMPLEANOS: {
      return `Invitación Virtual de Cumpleaños - ${client}`;
    }

    case ProjectType.CARTA_DIGITAL: {
      const business = project.menuDetails?.businessName?.trim();
      if (business) {
        return `Carta Digital - ${business}`;
      }
      return `Carta Digital - ${client}`;
    }

    case ProjectType.LANDING_PAGE: {
      return `Landing Page - ${client}`;
    }

    case ProjectType.SPOT: {
      return `Spot Publicitario - ${client}`;
    }

    case ProjectType.FOTO_VIDEO: {
      return `Audiovisual - ${client}`;
    }

    case ProjectType.ARTES_MULTIMEDIA: {
      return `Diseño / Artes Multimedia - ${client}`;
    }

    case ProjectType.DISENO_GRAFICO: {
      return `Branding - ${client}`;
    }

    default: {
      return `${project.type || "Proyecto"} - ${client}`;
    }
  }
}
