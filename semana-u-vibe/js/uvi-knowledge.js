/* ============================================================
   BASE DE CONOCIMIENTO DE U-VI
   Pegue o actualice aquí la información oficial del documento
   del proyecto. El chatbot responde solo con estos datos +
   las actividades de data.js (no inventa horarios ni cupos).
   ============================================================ */
const UVI_KNOWLEDGE = {
  assistant: {
    name: "U-vi",
    role: "Asistente virtual de la Semana U-Vibe en la Universidad Gerardo Barrios",
    tone: "Amable, cercana, clara y breve. Tutea al estudiante. No promete lo que no está en el documento."
  },

  event: {
    name: "Semana U-Vibe",
    slogan: "Muchas formas de vivir la U",
    tagline: "Conecta. Aprende. Cuida. Exprésate.",
    university: "Universidad Gerardo Barrios (UGB)",
    campuses: ["San Miguel", "Usulután"],
    summary:
      "U-Vibe es una experiencia universitaria que complementa tu formación académica mediante talleres, actividades y espacios de aprendizaje que impulsan tu desarrollo personal y profesional.",
    stats: {
      workshops: "+200 talleres diferentes",
      hoursRequired: 16,
      skills: "+100 habilidades por descubrir"
    }
  },

  howItWorks: [
    { step: 1, title: "Explora", detail: "Explora las actividades y descubre lo que tenemos para ti." },
    { step: 2, title: "Elige", detail: "Elige los talleres y conferencias que más te interesen." },
    { step: 3, title: "Inscríbete", detail: "Realiza la inscripción desde el portal del estudiante UGB." },
    { step: 4, title: "Participa", detail: "Completa las 16 horas requeridas participando activamente." },
    { step: 5, title: "Evalúa", detail: "Contesta la encuesta de satisfacción al finalizar." }
  ],

  hours: {
    required: 16,
    options: [4, 8, 16],
    note: "Cada actividad indica su duración (4, 8 o 16 horas). Debes acumular 16 horas participando de forma activa. Puedes combinar varias actividades cortas o tomar una de jornada completa."
  },

  inscription: {
    where: "Portal del estudiante UGB",
    note: "La inscripción se hace desde el portal del estudiante. En el sitio usa el botón Inscribirme o Inscripción cuando el enlace esté publicado."
  },

  categories: [
    { id: "Bien al 100", about: "Bienestar, salud, autocuidado y equilibrio para tu vida universitaria." },
    { id: "Express-Arte", about: "Arte, talento, expresión creativa y cultura." },
    { id: "ImpulsaTech", about: "Tecnología, habilidades digitales y herramientas para el mundo laboral." },
    { id: "Vínculos con el mundo", about: "Idiomas, liderazgo, voluntariado, emprendimiento y proyección social." }
  ],

  benefits: [
    "Amplías tu red de contactos con profesionales y estudiantes.",
    "Aprendes nuevas habilidades saliendo de tu zona de confort.",
    "Fortaleces tu perfil profesional.",
    "Disfrutas experiencias diferentes y sales de lo cotidiano."
  ],

  faculties: [
    "Ciencias de la Salud",
    "Ciencias Empresariales",
    "Ciencias Jurídicas",
    "Ciencias y Humanidades",
    "Ciencia y Tecnología",
    "Ingeniería y Arquitectura"
  ],

  helpTopics: [
    "Información general de U-Vibe",
    "Horarios y días",
    "Actividades disponibles",
    "Horas acumuladas",
    "Ubicaciones y campus"
  ],

  limits:
    "U-vi solo responde sobre la Semana U-Vibe. Si no tiene el dato en este documento o en el listado de actividades, lo dice con honestidad y sugiere revisar el catálogo del sitio o el portal del estudiante.",

  extraNotes: [
    "Hay actividades en campus San Miguel y Usulután.",
    "Los cupos son limitados; cada actividad muestra su capacidad.",
    "El listado de actividades del sitio es la fuente de horarios, lugares y cupos."
  ]
};
