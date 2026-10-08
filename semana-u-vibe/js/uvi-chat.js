/* Semana U-Vibe — chat de U-vi (modal + motor local + Gemini opcional) */
(() => {
  const K = UVI_KNOWLEDGE;
  const $ = (s, c = document) => c.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const norm = s => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const DAYS = ["lunes", "martes", "miercoles", "jueves", "viernes"];
  const DAY_LABEL = { lunes: "Lunes", martes: "Martes", miercoles: "Miércoles", jueves: "Jueves", viernes: "Viernes" };
  const CHIPS = [
    "¿Qué es U-Vibe?",
    "¿Cómo me inscribo?",
    "¿Cuántas horas debo cumplir?",
    "Actividades en San Miguel",
    "Actividades en Usulután"
  ];

  const state = { campus: "", day: "", cat: "", hours: 0, history: [] };
  let lastFocus = null;
  let sending = false;

  /* ---------- Contexto de la pregunta ---------- */
  function parseQuery(raw) {
    const q = norm(raw);
    const found = { campus: "", day: "", cat: "", hours: 0, text: q };

    if (/\busulut/.test(q)) found.campus = "Usulután";
    else if (/\bsan miguel\b|\bsm\b/.test(q)) found.campus = "San Miguel";

    DAYS.forEach(d => { if (q.includes(d)) found.day = DAY_LABEL[d]; });

    if (/\bbien al 100\b|\bbienestar\b|\byoga\b|\bnutricion\b|\bprimeros auxilios\b/.test(q)) found.cat = "Bien al 100";
    if (/\bexpress-?arte\b|\bdibujo\b|\bteatro\b|\bmusica\b|\bfotograf|\bcaricatura\b/.test(q)) found.cat = "Express-Arte";
    if (/\bimpulsatech\b|\binteligencia artificial\b|\bexcel\b|\bpaginas web\b|\bcongreso de salud\b/.test(q)) found.cat = "ImpulsaTech";
    if (/\bvinculos\b|\bvoluntariado\b|\bingles\b|\bliderazgo\b|\bemprend/.test(q)) found.cat = "Vínculos con el mundo";

    const hm = q.match(/\b(4|8|16)\s*h/);
    if (hm) found.hours = +hm[1];
    else if (/\bjornada completa\b|\b16 horas\b/.test(q)) found.hours = 16;

    return found;
  }

  function remember(parsed) {
    if (parsed.campus) state.campus = parsed.campus;
    if (parsed.day) state.day = parsed.day;
    if (parsed.cat) state.cat = parsed.cat;
    if (parsed.hours) state.hours = parsed.hours;
  }

  function filterActivities(parsed) {
    const campus = parsed.campus || state.campus;
    const day = parsed.day || (parsed.campus || parsed.cat || parsed.hours ? "" : state.day);
    const cat = parsed.cat || "";
    const hours = parsed.hours || 0;
    const tokens = parsed.text.split(/\s+/).filter(w => w.length > 3 && !/^(como|cual|cuales|donde|cuando|quiero|necesito|tienen|actividad|actividades|taller|talleres|sobre|para|este|esta|estos|estas|horario|horarios)$/.test(w));

    return ACTIVITIES.filter(a => {
      if (campus && a.campus !== campus) return false;
      if (day && a.day !== day) return false;
      if (cat && a.cat !== cat) return false;
      if (hours && a.hours !== hours) return false;
      if (tokens.length) {
        const blob = norm(`${a.name} ${a.cat} ${a.place} ${a.campus}`);
        return tokens.some(t => blob.includes(t));
      }
      return true;
    });
  }

  function formatAct(a) {
    return `• ${a.name} (${a.cat}) — ${a.day}, ${a.time}, ${a.place}, campus ${a.campus}. ${a.hours} h, ${a.seats} cupos.`;
  }

  function listActs(list, max = 5) {
    const shown = list.slice(0, max).map(formatAct).join("\n");
    const more = list.length > max ? `\n…y ${list.length - max} más. Puedes filtrar por día, campus o categoría.` : "";
    return shown + more;
  }

  function hasGemini() {
    return !!(CONFIG.ai && CONFIG.ai.geminiKey);
  }

  function hasWhatsApp() {
    const u = (CONFIG.links && CONFIG.links.whatsapp) || "";
    return /^https:\/\/wa\.me\/\d+/.test(u) && !u.includes("50300000000");
  }

  function catalogSummary() {
    return ACTIVITIES.map(a =>
      `${a.name} | ${a.cat} | ${a.day} | ${a.time} | ${a.place} | ${a.campus} | ${a.hours}h | ${a.seats} cupos`
    ).join("\n");
  }

  function knowledgeBlock() {
    const e = K.event;
    return [
      `Evento: ${e.name}. ${e.slogan}. ${e.tagline}.`,
      `Universidad: ${e.university}. Campus: ${e.campuses.join(" y ")}.`,
      e.summary,
      `Estadísticas: ${e.stats.workshops}; ${e.stats.hoursRequired} horas requeridas; ${e.stats.skills}.`,
      "Cómo funciona: " + K.howItWorks.map(s => `${s.step}. ${s.title}: ${s.detail}`).join(" "),
      `Horas: ${K.hours.note}`,
      `Inscripción: ${K.inscription.where}. ${K.inscription.note}`,
      "Categorías: " + K.categories.map(c => `${c.id}: ${c.about}`).join(" "),
      "Beneficios: " + K.benefits.join(" "),
      "Facultades: " + K.faculties.join(", "),
      K.limits,
      K.extraNotes.join(" "),
      "Catálogo de actividades (fuente de horarios y cupos):\n" + catalogSummary()
    ].join("\n");
  }

  /* ---------- Motor local (respuestas fieles al documento) ---------- */
  function localReply(raw) {
    const parsed = parseQuery(raw);
    remember(parsed);
    const q = parsed.text;
    const name = K.assistant.name;

    if (/^(hola|buenas|buen dia|buenos dias|hey|que tal|saludos)\b/.test(q) && q.split(/\s+/).length < 6) {
      return `¡Hola! Soy ${name}, tu asistente de la Semana U-Vibe. Pregúntame por actividades, horarios, campus, horas o cómo inscribirte.`;
    }
    if (/gracias|muy amable|perfecto|genial|ok$|vale$/.test(q) && q.split(/\s+/).length < 8) {
      return "¡Con gusto! Si quieres, te ayudo a armar tus 16 horas según campus o categoría.";
    }
    if (/^(adios|chao|hasta luego|nos vemos)/.test(q)) {
      return "¡Nos vemos en la Semana U-Vibe! Conecta. Aprende. Cuida. Exprésate.";
    }

    if (/que eres|quien eres|uvi|u-vi/.test(q) && /quien|que eres|asistente|mascota/.test(q)) {
      return `Soy ${name}, el asistente virtual de la Semana U-Vibe en la ${K.event.university}. Te oriento con info general, horarios, actividades, horas y ubicaciones.`;
    }

    if (/que es|que significa|para que sirve|uvibe|u-vibe|semana/.test(q) && /que es|significa|consiste|trata|uvibe|u-vibe/.test(q)) {
      return `${K.event.summary}\n\nLema: ${K.event.slogan}. ${K.event.tagline}.\nEn cifras: ${K.event.stats.workshops}, ${K.event.stats.hoursRequired} horas de actividades y ${K.event.stats.skills}.`;
    }

    if (/inscri|matricul|portal|como participo|como me anoto/.test(q)) {
      const extra = CONFIG.links.inscripcion && CONFIG.links.inscripcion !== "#"
        ? " El botón Inscribirme del sitio te lleva al trámite."
        : " Cuando publiquen el enlace, úsalo desde Inscribirme en esta página.";
      return `${K.inscription.note}${extra}\n\nRecuerda el recorrido: explora, elige, inscríbete, participa (16 h) y evalúa con la encuesta.`;
    }

    if (/como funciona|pasos|proceso|que debo hacer/.test(q)) {
      return "Así funciona la Semana U-Vibe:\n" + K.howItWorks.map(s => `${s.step}. ${s.title}: ${s.detail}`).join("\n");
    }

    if (/hora|acumul|cumplir|completar|cuantas hora|16 hora|duracion/.test(q) && !/horario|a que hora|que hora/.test(q)) {
      return `${K.hours.note}\nCampus disponibles: ${K.event.campuses.join(" y ")}.`;
    }

    if (/beneficio|para que me sirve|por que participar|vale la pena/.test(q)) {
      return "Participar te deja esto:\n" + K.benefits.map(b => `• ${b}`).join("\n");
    }

    if (/categor/.test(q) && !parsed.cat) {
      return "Hay 4 categorías:\n" + K.categories.map(c => `• ${c.id}: ${c.about}`).join("\n") + "\n¿Cuál te late? Te listo actividades.";
    }

    if (/campus|sede|ubicacion|donde es|en que lugar|lugares/.test(q) && !parsed.campus && !/actividad/.test(q)) {
      return `Las actividades son en ${K.event.campuses.join(" y ")}. Dime el campus y te muestro opciones con lugar y horario.`;
    }

    if (/cupo|espacio|capacidad/.test(q)) {
      const list = filterActivities(parsed);
      if (list.length) {
        return "Cupos según el catálogo:\n" + list.slice(0, 6).map(a => `• ${a.name}: ${a.seats} cupos (${a.campus}).`).join("\n");
      }
      return "Cada actividad tiene cupos limitados. Dime el taller o el campus y te digo la capacidad publicada.";
    }

    const wantsList = /actividad|taller|conferenc|horario|que hay|recomend|mostrar|listar|opcion|disponible|buscar/.test(q)
      || parsed.campus || parsed.day || parsed.cat || parsed.hours
      || ACTIVITIES.some(a => q.includes(norm(a.name).slice(0, 12)));

    if (wantsList) {
      let list = filterActivities(parsed);
      if (!list.length && (parsed.campus || parsed.day || parsed.cat || parsed.hours)) {
        list = ACTIVITIES.filter(a =>
          (!parsed.campus || a.campus === parsed.campus) &&
          (!parsed.day || a.day === parsed.day) &&
          (!parsed.cat || a.cat === parsed.cat) &&
          (!parsed.hours || a.hours === parsed.hours)
        );
      }
      if (!list.length) {
        const hint = [parsed.campus, parsed.day, parsed.cat, parsed.hours ? parsed.hours + " h" : ""].filter(Boolean).join(", ");
        return `No encontré actividades${hint ? " para " + hint : " con esa búsqueda"}. Prueba otro día, campus o categoría (Bien al 100, Express-Arte, ImpulsaTech o Vínculos con el mundo).`;
      }
      const bits = [];
      if (parsed.campus || state.campus) bits.push("campus " + (parsed.campus || state.campus));
      if (parsed.day) bits.push(parsed.day);
      if (parsed.cat) bits.push(parsed.cat);
      const head = bits.length ? `Esto encontré (${bits.join(", ")}):\n` : `Te recomiendo estas ${list.length} opciones:\n`;
      return head + listActs(list) + "\n\n¿Quieres filtrar por otro día o por 4, 8 o 16 horas?";
    }

    return `Puedo ayudarte con ${K.helpTopics.join(", ").toLowerCase()}.\nPrueba con: “talleres el martes en San Miguel” o “¿cómo me inscribo?”.`;
  }

  async function geminiReply(raw) {
    const key = CONFIG.ai.geminiKey;
    const model = CONFIG.ai.model || "gemini-2.0-flash";
    const turns = state.history.slice(-8).map(m => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));
    const body = {
      systemInstruction: {
        parts: [{
          text: `Eres ${K.assistant.name}. ${K.assistant.role}. ${K.assistant.tone}
Responde en español, máximo 120 palabras, con viñetas cortas si listas actividades.
Usa SOLO esta información. Si no está el dato, dilo y no inventes.

${knowledgeBlock()}`
        }]
      },
      contents: turns.concat([{ role: "user", parts: [{ text: raw }] }]),
      generationConfig: { temperature: 0.4, maxOutputTokens: 350 }
    };
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
    );
    if (!res.ok) throw new Error("gemini");
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.map(p => p.text).join("").trim();
    if (!text) throw new Error("empty");
    return text;
  }

  async function answer(raw) {
    parseQuery(raw);
    remember(parseQuery(raw));
    if (hasGemini()) {
      try { return await geminiReply(raw); } catch { /* motor local si la IA no responde */ }
    }
    return localReply(raw);
  }

  /* ---------- UI ---------- */
  function panelHtml() {
    const wa = hasWhatsApp()
      ? `<a class="uvi__wa" href="${esc(CONFIG.links.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a>`
      : "";
    return `
      <div class="uvi__back" data-uvi-close></div>
      <section class="uvi__box" role="dialog" aria-modal="true" aria-labelledby="uvi-title">
        <header class="uvi__head">
          <img src="img/viby-chat.webp" alt="" width="44" height="44">
          <div>
            <h2 id="uvi-title">U-vi</h2>
            <p>Asistente Semana U-Vibe</p>
          </div>
          ${wa}
          <button type="button" class="uvi__x" data-uvi-close aria-label="Cerrar chat">×</button>
        </header>
        <div class="uvi__log" id="uvi-log" role="log" aria-live="polite"></div>
        <div class="uvi__chips" id="uvi-chips">${CHIPS.map(c => `<button type="button" class="uvi__chip">${esc(c)}</button>`).join("")}</div>
        <form class="uvi__form" id="uvi-form">
          <label class="skip" for="uvi-input">Mensaje para U-vi</label>
          <input id="uvi-input" type="text" autocomplete="off" maxlength="400" placeholder="Escribe tu pregunta…">
          <button class="btn btn--sm" type="submit">Enviar</button>
        </form>
      </section>`;
  }

  function addMsg(role, text) {
    const log = $("#uvi-log");
    const el = document.createElement("div");
    el.className = "uvi__msg uvi__msg--" + role;
    el.innerHTML = esc(text).replace(/\n/g, "<br>");
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  }

  function addTyping() {
    const log = $("#uvi-log");
    const el = document.createElement("div");
    el.className = "uvi__msg uvi__msg--bot uvi__typing";
    el.id = "uvi-typing";
    el.innerHTML = "<span></span><span></span><span></span>";
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  }

  function clearTyping() { $("#uvi-typing")?.remove(); }

  async function send(text) {
    const msg = text.trim();
    if (!msg || sending) return;
    sending = true;
    $("#uvi-input").value = "";
    addMsg("user", msg);
    state.history.push({ role: "user", text: msg });
    addTyping();
    const wait = Math.min(900 + msg.length * 8, 1600);
    const [out] = await Promise.all([answer(msg), new Promise(r => setTimeout(r, wait))]);
    clearTyping();
    addMsg("bot", out);
    state.history.push({ role: "bot", text: out });
    sending = false;
    $("#uvi-input")?.focus();
  }

  function openChat(e) {
    e?.preventDefault();
    lastFocus = document.activeElement;
    const root = $("#uvi-root");
    root.hidden = false;
    requestAnimationFrame(() => root.classList.add("is-open"));
    document.body.classList.add("uvi-lock");
    $(".fab").setAttribute("aria-expanded", "true");
    if (!$("#uvi-log").children.length) {
      addMsg("bot", `¡Hola! Soy ${K.assistant.name}. Estoy aquí para ayudarte con la Semana U-Vibe: actividades, horarios, campus, horas e inscripción. ¿Qué necesitas?`);
    }
    setTimeout(() => $("#uvi-input")?.focus(), 50);
  }

  function closeChat() {
    const root = $("#uvi-root");
    root.classList.remove("is-open");
    document.body.classList.remove("uvi-lock");
    $(".fab").setAttribute("aria-expanded", "false");
    setTimeout(() => { root.hidden = true; lastFocus?.focus(); }, 220);
  }

  function init() {
    const root = document.createElement("div");
    root.id = "uvi-root";
    root.className = "uvi";
    root.hidden = true;
    root.innerHTML = panelHtml();
    document.body.appendChild(root);

    document.addEventListener("click", e => {
      const open = e.target.closest("[data-open-chat]");
      if (open) { e.preventDefault(); openChat(e); return; }
      if (e.target.closest("[data-uvi-close]")) closeChat();
      const chip = e.target.closest(".uvi__chip");
      if (chip) send(chip.textContent);
    });
    $("#uvi-form").addEventListener("submit", e => { e.preventDefault(); send($("#uvi-input").value); });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && $("#uvi-root").classList.contains("is-open")) closeChat();
    });
  }

  init();
})();
