/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, ProjectType } from "../types";

/**
 * Genera un nombre descriptivo para el proyecto según su tipo y datos cargados.
 * Sigue la convención estándar del estudio V.A.C. Creative:
 * - BODA: "Boda - Higidio & María"
 * - XV: "XV Años - Camila Ytzel"
 * - CUMPLEAÑOS: "Cumpleaños - Pamela"
 * - CARTA DIGITAL: "Carta Digital - Nombre del negocio"
 * - LANDING: "Landing - Nombre de marca"
 * - SPOT: "Spot - Nombre de campaña"
 * - AUDIOVISUAL: "Audiovisual - Nombre del proyecto"
 * - ARTES MULTIMEDIA: "Arte Multimedia - Nombre del proyecto"
 * - BRANDING: "Branding - Nombre de marca"
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
        return `Boda - ${novio} & ${novia}`;
      } else if (novia) {
        return `Boda - ${novia}`;
      } else if (novio) {
        return `Boda - ${novio}`;
      }
      return `Boda - ${client}`;
    }

    case ProjectType.XV_ANOS: {
      const quince = project.xvDetails?.quinceaneraName?.trim();
      if (quince) {
        return `XV Años - ${quince}`;
      }
      return `XV Años - ${client}`;
    }

    case ProjectType.CUMPLEANOS: {
      return `Cumpleaños - ${client}`;
    }

    case ProjectType.CARTA_DIGITAL: {
      const business = project.menuDetails?.businessName?.trim();
      if (business) {
        return `Carta Digital - ${business}`;
      }
      return `Carta Digital - ${client}`;
    }

    case ProjectType.LANDING_PAGE: {
      return `Landing - ${client}`;
    }

    case ProjectType.SPOT: {
      return `Spot - ${client}`;
    }

    case ProjectType.FOTO_VIDEO: {
      return `Audiovisual - ${client}`;
    }

    case ProjectType.ARTES_MULTIMEDIA: {
      return `Arte Multimedia - ${client}`;
    }

    case ProjectType.DISENO_GRAFICO: {
      return `Branding - ${client}`;
    }

    default: {
      return `${project.type || "Proyecto"} - ${client}`;
    }
  }
}
