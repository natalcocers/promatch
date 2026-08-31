// Catálogo único de categorías y especialidades — fuente de verdad para
// Home, Category, Listing, Contact y RequestDetail. Evita repetir la
// misma lista (y que se desincronicen) en cada pantalla. "enabled" marca
// qué recorte ya tiene profesionales reales cargados (mapa de UX 2.1/2.2).

export interface Specialty {
  id: string;
  label: string;
  icon: string;
  enabled: boolean;
  // Chips de motivo específicos de la especialidad, para el formulario de
  // contacto (mapa de UX 2.5, docs/promatch_formulario_chips_plomeria.html).
  reasonChips: string[];
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  enabled: boolean;
  specialties: Specialty[];
}

export const categories: Category[] = [
  {
    id: "hogar",
    label: "Hogar",
    icon: "hammer",
    enabled: true,
    specialties: [
      {
        id: "plomeria",
        label: "Plomería",
        icon: "droplet",
        enabled: true,
        reasonChips: ["Pérdida de agua", "Destape de cañería", "Instalación de sanitarios", "Reparación de canilla", "Calefón"]
      },
      {
        id: "electricidad",
        label: "Electricidad",
        icon: "bolt",
        enabled: true,
        reasonChips: ["Cortocircuito", "Instalación de tablero", "Colocación de artefactos"]
      },
      {
        id: "gas",
        label: "Gas",
        icon: "flame",
        enabled: true,
        reasonChips: ["Pérdida de gas", "Instalación de gas natural", "Certificación de instalación"]
      },
      {
        id: "cerrajeria",
        label: "Cerrajería",
        icon: "key",
        enabled: true,
        reasonChips: ["Apertura de puerta", "Cambio de cerradura", "Duplicado de llaves"]
      },
      {
        id: "pintura",
        label: "Pintura",
        icon: "brush",
        enabled: true,
        reasonChips: ["Pintura de interiores", "Pintura de exteriores", "Impermeabilización"]
      },
      {
        id: "carpinteria",
        label: "Carpintería",
        icon: "hammer",
        enabled: true,
        reasonChips: ["Muebles a medida", "Reparación de puertas y ventanas", "Armado de muebles"]
      },
      {
        id: "jardineria",
        label: "Jardinería",
        icon: "plant",
        enabled: true,
        reasonChips: ["Mantenimiento de jardín", "Poda", "Diseño de espacios verdes", "Armado de huerta"]
      }
    ]
  },
  {
    id: "tecnologia",
    label: "Tecnología",
    icon: "device-laptop",
    enabled: true,
    specialties: [
      {
        id: "reparacion-celulares",
        label: "Reparación de celulares y notebooks",
        icon: "device-mobile",
        enabled: true,
        reasonChips: ["Cambio de pantalla", "Recuperación de datos", "Problema de batería"]
      },
      {
        id: "soporte-tecnico",
        label: "Soporte técnico y redes",
        icon: "router",
        enabled: true,
        reasonChips: ["Configuración de wifi", "Instalación de cámaras", "Virus y formateo"]
      },
      {
        id: "redes-wifi",
        label: "Redes y WiFi",
        icon: "wifi",
        enabled: true,
        reasonChips: ["Configuración de router", "Extensión de señal", "Problemas de conexión"]
      },
      {
        id: "smart-home",
        label: "Hogar inteligente",
        icon: "home-2",
        enabled: true,
        reasonChips: ["Instalación de asistente virtual", "Automatización de luces", "Enchufes inteligentes"]
      },
      {
        id: "recuperacion-datos",
        label: "Recuperación de datos",
        icon: "database",
        enabled: true,
        reasonChips: ["Archivos borrados", "Disco duro dañado", "Backup de datos"]
      },
      {
        id: "impresoras",
        label: "Impresoras",
        icon: "printer",
        enabled: true,
        reasonChips: ["Instalación de impresora", "Problemas de impresión", "Cambio de cartuchos"]
      },
      {
        id: "soporte-general",
        label: "Soporte técnico general",
        icon: "tools",
        enabled: true,
        reasonChips: ["Formateo", "Instalación de programas", "Configuración general"]
      },
      {
        id: "reparacion-pc",
        label: "Reparación de PC y notebooks",
        icon: "device-desktop",
        enabled: true,
        reasonChips: ["No enciende", "Cambio de componentes", "Limpieza y mantenimiento"]
      }
    ]
  },
  {
    id: "estetica",
    label: "Estética",
    icon: "sparkles",
    enabled: true,
    specialties: [
      {
        id: "manicura-pedicura",
        label: "Manicura y pedicura",
        icon: "sparkles",
        enabled: true,
        reasonChips: ["Esmaltado semipermanente", "Uñas esculpidas", "Pedicura spa"]
      },
      {
        id: "masajes",
        label: "Masajes y bienestar corporal",
        icon: "activity",
        enabled: true,
        reasonChips: ["Masaje descontracturante", "Drenaje linfático", "Masaje deportivo"]
      },
      {
        id: "depilacion",
        label: "Depilación",
        icon: "sparkles",
        enabled: false,
        reasonChips: ["Depilación facial", "Depilación de piernas", "Depilación de axilas"]
      }
    ]
  },
  {
    id: "educacion",
    label: "Educación",
    icon: "school",
    enabled: true,
    specialties: [
      {
        id: "matematica",
        label: "Clases de matemática",
        icon: "school",
        enabled: true,
        reasonChips: ["Nivel primario", "Nivel secundario", "Preparación para ingreso universitario"]
      },
      {
        id: "ingles",
        label: "Clases de inglés",
        icon: "language",
        enabled: true,
        reasonChips: ["Conversación", "Preparación para examen internacional", "Inglés para negocios"]
      },
      {
        id: "apoyo-escolar",
        label: "Apoyo escolar",
        icon: "school",
        enabled: true,
        reasonChips: ["Ayuda con tareas", "Repaso de materias", "Técnicas de estudio"]
      },
      {
        id: "musica",
        label: "Música",
        icon: "music",
        enabled: true,
        reasonChips: ["Guitarra", "Piano", "Iniciación musical"]
      },
      {
        id: "tutorias-universitarias",
        label: "Tutorías universitarias",
        icon: "school",
        enabled: true,
        reasonChips: ["Matemática", "Física", "Ingeniería"]
      },
      {
        id: "programacion",
        label: "Programación y tecnología",
        icon: "code",
        enabled: true,
        reasonChips: ["Desde cero", "Python", "Desarrollo web"]
      },
      {
        id: "preparacion-examenes",
        label: "Preparación de exámenes",
        icon: "clipboard-check",
        enabled: true,
        reasonChips: ["CBC", "Ingreso universitario"]
      },
      {
        id: "arte-pintura",
        label: "Arte y pintura",
        icon: "palette",
        enabled: true,
        reasonChips: ["Óleo", "Acrílico", "Dibujo artístico"]
      }
    ]
  },
  {
    id: "cuidados",
    label: "Cuidados",
    icon: "heart",
    enabled: true,
    specialties: [
      {
        id: "cuidado-mascotas",
        label: "Cuidado de mascotas",
        icon: "paw",
        enabled: true,
        reasonChips: ["Cuidado en casa del cuidador", "Cuidado en tu casa", "Caminatas diarias"]
      },
      {
        id: "paseo-perros",
        label: "Paseo de perros",
        icon: "walk",
        enabled: true,
        reasonChips: ["Paseo individual", "Paseo grupal", "Zona sur", "Zona norte"]
      }
    ]
  },
  {
    id: "salud",
    label: "Salud",
    icon: "stethoscope",
    enabled: true,
    specialties: [
      {
        id: "enfermeria",
        label: "Enfermería a domicilio",
        icon: "stethoscope",
        enabled: true,
        reasonChips: ["Curaciones", "Aplicación de inyectables", "Control de signos vitales"]
      },
      {
        id: "nutricion",
        label: "Nutrición",
        icon: "apple",
        enabled: true,
        reasonChips: ["Plan de alimentación", "Seguimiento de peso", "Nutrición deportiva"]
      }
    ]
  }
];

const specialtyIndex = new Map<string, { specialty: Specialty; category: Category }>();
for (const category of categories) {
  for (const specialty of category.specialties) {
    specialtyIndex.set(specialty.id, { specialty, category });
  }
}

export function getSpecialty(specialtyId: string | undefined) {
  if (!specialtyId) return undefined;
  return specialtyIndex.get(specialtyId);
}

export function specialtyLabel(specialtyId: string | undefined) {
  return getSpecialty(specialtyId)?.specialty.label ?? specialtyId ?? "";
}

export function categoryLabel(specialtyId: string | undefined) {
  return getSpecialty(specialtyId)?.category.label ?? "";
}
