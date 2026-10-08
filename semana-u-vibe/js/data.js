/* ============================================================
   CONFIGURACIÓN Y DATOS — edite aquí sin tocar el resto del código
   ============================================================ */
const CONFIG = {
  // Pegue aquí los enlaces reales:
  links: {
    inscripcion: "#",                        // TODO: link externo de inscripción
    whatsapp: ""                             // Opcional: https://wa.me/503XXXXXXXX (se muestra en el chat si hay número real)
  },
  // Opcional: clave de Gemini (Google AI Studio). Si está vacía, U-vi usa su motor local (fiel al documento).
  // Restrinja la clave por dominio HTTP en Google Cloud para que solo funcione en este sitio.
  ai: {
    geminiKey: "",
    model: "gemini-2.0-flash"
  }
};

/* Íconos SVG (trazo, heredan color lime) */
const ICONS = {
  compass:'<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  list:'<path d="m4 6 1.5 1.5L8 5M4 12l1.5 1.5L8 11M4 18l1.5 1.5L8 17M12 6h8M12 12h8M12 18h8"/>',
  user:'<circle cx="10" cy="8" r="4"/><path d="M3 20c0-4 3-6 7-6M18 14v6M15 17h6"/>',
  users:'<circle cx="12" cy="8" r="3.5"/><circle cx="5" cy="10" r="2.5"/><circle cx="19" cy="10" r="2.5"/><path d="M6 20c0-4 2.5-6 6-6s6 2 6 6"/>',
  clip:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12l1.5 1.5L13 11M9 17h6"/>',
  puzzle:'<path d="M10 4a2 2 0 1 1 4 0v2h4v4h-2a2 2 0 1 0 0 4h2v6h-6v-2a2 2 0 1 0-4 0v2H4v-6h2a2 2 0 1 0 0-4H4V6h6z"/>',
  badge:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="11" r="2.5"/><path d="M8 17c1-2 2.5-3 4-3s3 1 4 3"/>',
  book:'<path d="M12 7v13M12 7C10 5 7 5 4 5v13c3 0 6 0 8 2 2-2 5-2 8-2V5c-3 0-6 0-8 2zM9 2.5c1.7-1 4.3-1 6 0"/>',
  heart:'<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
  palette:'<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2s0-2 1.5-2h2a4 4 0 0 0 4-4c0-5-4-10-9-10z"/><circle cx="8" cy="11" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="16" cy="10" r="1"/>',
  chip:'<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6l3.5 2"/>',
  pin:'<path d="M12 21s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.2"/>',
  building:'<path d="M4 21h16M6 21V8l6-4 6 4v13M10 11h.01M14 11h.01M10 15h.01M14 15h.01M10 21v-3h4v3"/>'
};

/* buque de imagenes */
const RUBRO_IMG = {
  "Bien al 100": "img/rubros/yoga.jpg",
  "Express-Arte": "img/rubros/fotografia.jpg",
  "ImpulsaTech": "img/rubros/congreso de salud.jpg",
  "Vínculos con el mundo": "img/rubros/auxilios.jpg"
};

const STEPS = [
  {i:"compass",t:"Explora",d:"Explora las actividades y descubre lo que tenemos para ti."},
  {i:"list",t:"Elige",d:"Elige los talleres y conferencias que más te interesen."},
  {i:"user",t:"Inscríbete",d:"Realiza la inscripción desde el portal del estudiante UGB."},
  {i:"users",t:"Participa",d:"Completa las 16 horas requeridas participando activamente."},
  {i:"clip",t:"Evalúa",d:"Contesta la encuesta de satisfacción al finalizar."}
];

const BENEFITS = [
  {i:"user",t:"Red de contactos",d:"Amplía tu red conectando con profesionales y estudiantes."},
  {i:"puzzle",t:"Nuevas habilidades",d:"Aprende nuevas habilidades saliendo de tu zona de confort."},
  {i:"badge",t:"Perfil profesional",d:"Fortalece tu perfil profesional."},
  {i:"book",t:"Salir de lo cotidiano",d:"Disfruta experiencias diferentes."}
];

const CATEGORIES = [
  {id:"Bien al 100",i:"heart"},
  {id:"Express-Arte",i:"palette"},
  {id:"ImpulsaTech",i:"chip"},
  {id:"Vínculos con el mundo",i:"globe"}
];

/* Actividades. Las 2 primeras filas son las reales del documento; el resto es contenido de ejemplo. */
const A = (cat,name,day,time,place,seats,hours,campus)=>({cat,name,day,time,place,seats,hours,campus});
const ACTIVITIES = [
  A("ImpulsaTech","Congreso de Salud","Lunes","8:00 a.m. - 5:00 p.m.","Afuera de la UGB",350,16,"San Miguel"),
  A("Bien al 100","Taller de Primeros Auxilios Básicos","Martes","7:00 a.m. - 10:30 a.m.","MO-N1-02",40,4,"San Miguel"),
  A("Bien al 100","Yoga y manejo del estrés","Miércoles","8:00 a.m. - 12:00 m.","Auditorio B",30,4,"Usulután"),
  A("Bien al 100","Nutrición para universitarios","Jueves","1:00 p.m. - 5:00 p.m.","MO-N2-05",45,4,"San Miguel"),
  A("Bien al 100","Jornada de salud integral","Viernes","8:00 a.m. - 5:00 p.m.","Cancha UGB",120,8,"Usulután"),
  A("Express-Arte","Dibujo y caricatura","Lunes","1:00 p.m. - 5:00 p.m.","Aula de Arte 1",25,4,"San Miguel"),
  A("Express-Arte","Teatro y expresión corporal","Miércoles","8:00 a.m. - 5:00 p.m.","Auditorio A",35,8,"San Miguel"),
  A("Express-Arte","Fotografía con tu celular","Jueves","8:00 a.m. - 12:00 m.","MO-N1-04",30,4,"Usulután"),
  A("Express-Arte","Festival de música y talento","Viernes","8:00 a.m. - 5:00 p.m.","Plaza central",200,16,"San Miguel"),
  A("ImpulsaTech","Introducción a la Inteligencia Artificial","Martes","8:00 a.m. - 5:00 p.m.","Laboratorio 3",40,8,"San Miguel"),
  A("ImpulsaTech","Excel para el mundo laboral","Miércoles","1:00 p.m. - 5:00 p.m.","Laboratorio 1",35,4,"Usulután"),
  A("ImpulsaTech","Diseño de páginas web","Viernes","8:00 a.m. - 12:00 m.","Laboratorio 2",30,4,"San Miguel"),
  A("Vínculos con el mundo","Voluntariado ambiental","Lunes","7:00 a.m. - 11:00 a.m.","Parque central",80,4,"Usulután"),
  A("Vínculos con el mundo","Inglés conversacional","Martes","1:00 p.m. - 5:00 p.m.","MO-N2-01",30,4,"San Miguel"),
  A("Vínculos con el mundo","Liderazgo y proyección social","Jueves","8:00 a.m. - 5:00 p.m.","Auditorio A",60,8,"San Miguel"),
  A("Vínculos con el mundo","Feria de emprendimiento","Miércoles","8:00 a.m. - 5:00 p.m.","Afuera de la UGB",250,16,"Usulután")
];
