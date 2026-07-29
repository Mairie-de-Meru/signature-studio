/* =========================================================================
 * Signature Studio — app.js
 * Application 100 % statique : HTML5 + CSS3 + JavaScript natif.
 *
 * Organisation du fichier :
 *   1. Configuration (état par défaut, modèles, réseaux sociaux)
 *   2. Utilitaires (échappement, validation, etc.)
 *   3. État central + sauvegarde/restauration localStorage
 *   4. Génération du HTML compatible e-mail (tableaux + styles en ligne)
 *   5. Rendu de l'interface (aperçu, vignettes, avertissements…)
 *   6. Banque d'images (JSON + secours JS, import local, aperçu)
 *   7. Export (copie, sélection manuelle, code HTML, téléchargement)
 *   8. Liaison des événements et démarrage
 * ========================================================================= */

"use strict";

/* =======================================================================
 * 1. CONFIGURATION
 * ===================================================================== */

const STORAGE_KEY = "signature-studio:state:v1";
const IMPORTS_KEY = "signature-studio:imports:v1";

/** Données de démonstration : l'interface est testable immédiatement. */
const DEFAULT_STATE = {
  template: "classique",
  data: {
    firstName: "Camille",
    lastName: "Durand",
    role: "Directrice Marketing",
    company: "Lumea Studio",
    phone: "+33 6 12 34 56 78",
    email: "camille.durand@lumea.fr",
    website: "https://www.lumea.fr",
    address: "12 rue des Lilas, 75011 Paris",
    photo: "assets/images/avatars/avatar-1.svg",
    logo: "assets/images/entreprise/logo-entreprise.svg",
    banner: "assets/images/bannieres/banniere-1.svg",
    linkedin: "https://www.linkedin.com/in/camille-durand",
    instagram: "https://www.instagram.com/lumeastudio",
    facebook: "",
    x: "",
    youtube: "",
    legal: "🌱 Pensez à l'environnement : n'imprimez ce message que si nécessaire."
  },
  /* Visibilité individuelle de chaque information. */
  show: {
    photo: true, logo: true, banner: true,
    role: true, company: true, phone: true, email: true,
    website: true, address: true, social: true, legal: true
  },
  /* Personnalisation visuelle. */
  style: {
    font: "Arial, Helvetica, sans-serif",
    fontSize: 13,
    nameSize: 17,
    primary: "#1f5fbf",
    secondary: "#5b6673",
    text: "#333333",
    align: "left",
    spacing: 6,
    photoSize: 72,
    logoSize: 100,
    iconSize: 22
  }
};

/** Réseaux sociaux : pastilles colorées compatibles e-mail (pas d'images). */
const SOCIAL_NETWORKS = [
  { key: "linkedin",  label: "LinkedIn",  short: "in", color: "#0A66C2" },
  { key: "instagram", label: "Instagram", short: "Ig", color: "#E4405F" },
  { key: "facebook",  label: "Facebook",  short: "f",  color: "#1877F2" },
  { key: "x",         label: "X",         short: "X",  color: "#111111" },
  { key: "youtube",   label: "YouTube",   short: "YT", color: "#FF0000" }
];

/* =======================================================================
 * 2. UTILITAIRES
 * ===================================================================== */

/** Échappe le HTML des saisies utilisateur. */
function esc(str) {
  return String(str || "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/** Vérifie une adresse e-mail (contrôle simple mais suffisant). */
function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

/** Vérifie qu'une URL est absolue et analysable. */
function isValidUrl(v) {
  try {
    const u = new URL(v.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch { return false; }
}

/** Rend une URL absolue (préfixe https:// si besoin) pour l'export. */
function absUrl(v) {
  const t = String(v || "").trim();
  if (!t) return "";
  return /^https?:\/\//i.test(t) ? t : "https://" + t;
}

/** Fusion profonde simple : complète `target` avec les clés de `defaults`. */
function mergeDefaults(target, defaults) {
  const out = { ...defaults };
  for (const k of Object.keys(target || {})) {
    if (typeof defaults[k] === "object" && defaults[k] !== null && !Array.isArray(defaults[k])) {
      out[k] = mergeDefaults(target[k], defaults[k]);
    } else {
      out[k] = target[k];
    }
  }
  return out;
}

/* =======================================================================
 * 3. ÉTAT CENTRAL + PERSISTANCE
 * ===================================================================== */

let state = loadState();
let importedImages = loadImports(); // [{ file: dataURL, alt, name }]
let saveTimer = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return mergeDefaults(JSON.parse(raw), DEFAULT_STATE);
  } catch { /* stockage indisponible : on continue en mémoire */ }
  return structuredClone(DEFAULT_STATE);
}

/** Sauvegarde différée (évite d'écrire à chaque frappe). */
function saveState() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch { showToast("Impossible d'enregistrer localement (stockage plein ou bloqué).", "error"); }
  }, 250);
}

function loadImports() {
  try { return JSON.parse(localStorage.getItem(IMPORTS_KEY)) || []; }
  catch { return []; }
}

function saveImports() {
  try { localStorage.setItem(IMPORTS_KEY, JSON.stringify(importedImages)); }
  catch { showToast("Image importée trop lourde pour être conservée après fermeture.", "error"); }
}

/** Met à jour l'état puis rafraîchit tout ce qui en dépend. */
function updateState(mutator) {
  mutator(state);
  saveState();
  renderAll();
}

/* =======================================================================
 * 4. GÉNÉRATION DU HTML COMPATIBLE E-MAIL
 *    Règles : tableaux, styles en ligne, pas de JS/formulaire/animation,
 *    polices web-safe, attributs alt, liens absolus.
 * ===================================================================== */

/** Construit les « briques » réutilisées par tous les modèles. */
function buildParts(st, editable) {
  const d = st.data, s = st.style, v = st.show;
  // Attribut d'édition WYSIWYG : présent uniquement dans l'aperçu.
  const at = (k) => (editable ? ` data-edit="${k}"` : "");
  const base = `font-family:${s.font};font-size:${s.fontSize}px;color:${s.text};line-height:1.5;`;
  const link = `color:${s.primary};text-decoration:none;`;
  const fullName = [d.firstName, d.lastName].filter(Boolean).join(" ");

  const parts = { at, base, link, fullName, d, s, v };

  parts.name = `<span${at("firstName")} style="font-family:${s.font};font-size:${s.nameSize}px;font-weight:bold;color:${s.primary};">${esc(fullName)}</span>`;

  parts.role = (v.role && d.role)
    ? `<span${at("role")} style="${base}">${esc(d.role)}</span>` : "";

  parts.company = (v.company && d.company)
    ? `<span${at("company")} style="font-family:${s.font};font-size:${s.fontSize}px;font-weight:bold;color:${s.secondary};">${esc(d.company)}</span>` : "";

  // Lignes de coordonnées (chacune masquable).
  const contact = [];
  if (v.phone && d.phone) {
    contact.push(`<a${at("phone")} href="tel:${esc(d.phone.replace(/[^+\d]/g, ""))}" style="${base}${link}">${esc(d.phone)}</a>`);
  }
  if (v.email && d.email) {
    contact.push(`<a${at("email")} href="mailto:${esc(d.email.trim())}" style="${base}${link}">${esc(d.email.trim())}</a>`);
  }
  if (v.website && d.website) {
    contact.push(`<a${at("website")} href="${esc(absUrl(d.website))}" target="_blank" style="${base}${link}">${esc(d.website.replace(/^https?:\/\//i, ""))}</a>`);
  }
  if (v.address && d.address) {
    contact.push(`<span${at("address")} style="${base}">${esc(d.address)}</span>`);
  }
  parts.contactList = contact;
  /** Coordonnées empilées (une par ligne). */
  parts.contactBlock = contact
    .map((c) => `<div style="padding-top:2px;">${c}</div>`).join("");
  /** Coordonnées sur une ligne, séparées par des puces. */
  parts.contactInline = contact
    .join(`<span style="${base}color:${s.secondary};">&nbsp;&nbsp;&bull;&nbsp;&nbsp;</span>`);

  // Pastilles réseaux sociaux (tableau : fiable dans tous les clients mail).
  const activeSocial = SOCIAL_NETWORKS.filter((n) => v.social && d[n.key]);
  parts.social = activeSocial.length
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0"${at("linkedin")} style="border-collapse:collapse;"><tr>` +
      activeSocial.map((n) =>
        `<td style="padding:0 ${Math.round(s.iconSize * 0.28)}px 0 0;">` +
        `<a href="${esc(absUrl(d[n.key]))}" target="_blank" ` +
        `style="display:block;width:${s.iconSize}px;height:${s.iconSize}px;background-color:${n.color};border-radius:4px;` +
        `color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:${Math.round(s.iconSize * 0.48)}px;font-weight:bold;` +
        `line-height:${s.iconSize}px;text-align:center;text-decoration:none;" title="${n.label}">${n.short}</a></td>`
      ).join("") +
      `</tr></table>`
    : "";

  // Images (attributs alt systématiques).
  parts.photo = (v.photo && d.photo)
    ? `<img${at("photo")} src="${esc(d.photo)}" alt="Photo de ${esc(fullName) || "profil"}" width="${s.photoSize}" height="${s.photoSize}" style="display:block;width:${s.photoSize}px;height:${s.photoSize}px;border-radius:50%;object-fit:cover;">`
    : "";
  parts.logo = (v.logo && d.logo)
    ? `<img${at("logo")} src="${esc(d.logo)}" alt="Logo ${esc(d.company) || "de l'entreprise"}" width="${s.logoSize}" style="display:block;width:${s.logoSize}px;height:auto;">`
    : "";
  parts.banner = (v.banner && d.banner)
    ? `<img${at("banner")} src="${esc(d.banner)}" alt="Bannière ${esc(d.company) || "promotionnelle"}" width="480" style="display:block;width:100%;max-width:480px;height:auto;border-radius:4px;">`
    : "";

  parts.legal = (v.legal && d.legal)
    ? `<span${at("legal")} style="font-family:${s.font};font-size:${Math.max(10, s.fontSize - 3)}px;color:#8a949e;">${esc(d.legal)}</span>`
    : "";

  return parts;
}

/**
 * Modèles de signature.
 * Pour AJOUTER UN MODÈLE : dupliquez une entrée, changez `label`
 * et la fonction `render(p)` qui reçoit les briques de buildParts().
 */
const TEMPLATES = {
  classique: {
    label: "Classique",
    render(p) {
      const { s } = p, pad = s.spacing;
      const left = p.photo
        ? `<td valign="top" style="padding:0 ${pad + 8}px 0 0;">${p.photo}</td>` : "";
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
<tr>${left}<td valign="top" style="border-left:2px solid ${s.primary};padding-left:${pad + 8}px;text-align:${s.align};">
<div>${p.name}</div>
${p.role ? `<div style="padding-top:1px;">${p.role}</div>` : ""}
${p.company ? `<div style="padding-top:1px;">${p.company}</div>` : ""}
${p.contactBlock ? `<div style="padding-top:${pad}px;">${p.contactBlock}</div>` : ""}
${p.social ? `<div style="padding-top:${pad}px;">${p.social}</div>` : ""}
${p.logo ? `<div style="padding-top:${pad}px;">${p.logo}</div>` : ""}
</td></tr>
${p.legal ? `<tr><td colspan="2" style="padding-top:${pad + 4}px;text-align:${s.align};">${p.legal}</td></tr>` : ""}
</table>`;
    }
  },

  moderne: {
    label: "Moderne",
    render(p) {
      const { s } = p, pad = s.spacing;
      const header = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>
${p.photo ? `<td valign="middle" style="padding:0 ${pad + 6}px 0 0;">${p.photo}</td>` : ""}
<td valign="middle" style="text-align:${s.align};">
<div>${p.name}</div>
${p.role || p.company ? `<div style="padding-top:1px;">${[p.role, p.company].filter(Boolean).join(`<span style="${p.base}color:${s.secondary};">&nbsp;&bull;&nbsp;</span>`)}</div>` : ""}
</td>
${p.logo ? `<td valign="middle" style="padding-left:${pad + 14}px;">${p.logo}</td>` : ""}
</tr></table>`;
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
<tr><td>${header}</td></tr>
<tr><td style="padding-top:${pad}px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;"><tr><td style="border-top:2px solid ${s.primary};font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>
${p.contactInline ? `<tr><td style="padding-top:${pad}px;text-align:${s.align};">${p.contactInline}</td></tr>` : ""}
${p.social ? `<tr><td style="padding-top:${pad}px;">${p.social}</td></tr>` : ""}
${p.legal ? `<tr><td style="padding-top:${pad + 4}px;text-align:${s.align};">${p.legal}</td></tr>` : ""}
</table>`;
    }
  },

  compact: {
    label: "Compact",
    render(p) {
      const { s } = p, pad = Math.max(2, s.spacing - 2);
      const sep = `<span style="${p.base}color:${s.secondary};">&nbsp;|&nbsp;</span>`;
      const line1 = [p.name, [p.role, p.company].filter(Boolean).join(`<span style="${p.base}">, </span>`)]
        .filter(Boolean).join(`<span style="${p.base}color:${s.secondary};"> — </span>`);
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
<tr><td style="text-align:${s.align};">
<div>${line1}</div>
${p.contactList.length ? `<div style="padding-top:${pad}px;">${p.contactList.join(sep)}</div>` : ""}
${p.social ? `<div style="padding-top:${pad}px;">${p.social}</div>` : ""}
${p.legal ? `<div style="padding-top:${pad + 2}px;">${p.legal}</div>` : ""}
</td></tr></table>`;
    }
  },

  banniere: {
    label: "Avec bannière",
    render(p) {
      const { s } = p, pad = s.spacing;
      const left = p.photo
        ? `<td valign="top" style="padding:0 ${pad + 8}px 0 0;">${p.photo}</td>` : "";
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;max-width:480px;">
${p.logo ? `<tr><td style="padding-bottom:${pad + 2}px;">${p.logo}</td></tr>` : ""}
<tr><td><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>
${left}<td valign="top" style="text-align:${s.align};">
<div>${p.name}</div>
${p.role ? `<div style="padding-top:1px;">${p.role}</div>` : ""}
${p.company ? `<div style="padding-top:1px;">${p.company}</div>` : ""}
${p.contactBlock ? `<div style="padding-top:${pad}px;">${p.contactBlock}</div>` : ""}
${p.social ? `<div style="padding-top:${pad}px;">${p.social}</div>` : ""}
</td></tr></table></td></tr>
${p.banner ? `<tr><td style="padding-top:${pad + 4}px;">${p.banner}</td></tr>` : ""}
${p.legal ? `<tr><td style="padding-top:${pad + 2}px;text-align:${s.align};">${p.legal}</td></tr>` : ""}
</table>`;
    }
  }
};

/** Génère le HTML de la signature (aperçu si editable, export sinon). */
function buildSignatureHtml(st, { editable = false } = {}) {
  const tpl = TEMPLATES[st.template] || TEMPLATES.classique;
  return tpl.render(buildParts(st, editable));
}

/** Version texte brut (utilisée pour le presse-papiers). */
function buildPlainText(st) {
  const d = st.data, v = st.show;
  const lines = [
    [d.firstName, d.lastName].filter(Boolean).join(" "),
    v.role ? d.role : "", v.company ? d.company : "",
    v.phone ? d.phone : "", v.email ? d.email : "",
    v.website ? d.website : "", v.address ? d.address : "",
    v.legal ? d.legal : ""
  ];
  return lines.filter(Boolean).join("\n");
}

/** Document HTML complet pour le téléchargement. */
function buildEmailDocument(st) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Signature e-mail — ${esc([st.data.firstName, st.data.lastName].filter(Boolean).join(" "))}</title>
<!--
  Signature générée par Signature Studio.
  IMPORTANT : hébergez les images publiquement (https://…) et remplacez
  les chemins locaux ou data: avant d'installer la signature.
-->
</head>
<body>
${buildSignatureHtml(st)}
</body>
</html>`;
}

/* =======================================================================
 * 5. RENDU DE L'INTERFACE
 * ===================================================================== */

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/** Rafraîchit tout ce qui dépend de l'état. */
function renderAll() {
  renderPreview();
  renderTemplateList();
  renderImageSlots();
  renderWarnings();
}

function renderPreview() {
  $("#preview-signature").innerHTML = buildSignatureHtml(state, { editable: true });
}

/** Vignettes des modèles : mini-aperçus réels réduits par transformation. */
function renderTemplateList() {
  const list = $("#template-list");
  list.innerHTML = "";
  for (const [id, tpl] of Object.entries(TEMPLATES)) {
    const selected = state.template === id;
    const card = document.createElement("button");
    card.type = "button";
    card.className = "template-card" + (selected ? " is-selected" : "");
    card.setAttribute("role", "radio");
    card.setAttribute("aria-checked", String(selected));
    card.title = "Changer de modèle ne supprime aucune information saisie.";
    const mini = { ...state, template: id };
    card.innerHTML =
      `<div class="tpl-thumb" aria-hidden="true"><div class="tpl-thumb-inner">${buildSignatureHtml(mini)}</div></div>` +
      `<span class="tpl-name">${tpl.label}</span>`;
    card.addEventListener("click", () => updateState((s) => { s.template = id; }));
    list.appendChild(card);
  }
}

/** Met à jour les miniatures photo / logo / bannière du formulaire. */
function renderImageSlots() {
  $("#slot-photo").src = state.data.photo || "";
  $("#slot-logo").src = state.data.logo || "";
  $("#slot-banner").src = state.data.banner || "";
}

/** Validation : champs incomplets, liens invalides, images non hébergées. */
function renderWarnings() {
  const d = state.data, v = state.show;
  const warnings = []; // { text, level: "error"|"info", field }

  $$("#signature-form input").forEach((i) => i.classList.remove("is-invalid"));

  if (!d.firstName && !d.lastName) {
    warnings.push({ text: "Renseignez au moins un prénom ou un nom.", level: "error", field: "firstName" });
  }
  if (v.email && d.email && !isValidEmail(d.email)) {
    warnings.push({ text: "L'adresse e-mail semble invalide.", level: "error", field: "email" });
  }
  if (v.website && d.website && !isValidUrl(absUrl(d.website))) {
    warnings.push({ text: "L'URL du site web semble invalide.", level: "error", field: "website" });
  }
  for (const n of SOCIAL_NETWORKS) {
    if (v.social && d[n.key] && !isValidUrl(absUrl(d[n.key]))) {
      warnings.push({ text: `Le lien ${n.label} semble invalide.`, level: "error", field: n.key });
    }
  }

  // Champs affichés mais vides = incomplets (simple information).
  const missing = [];
  if (v.email && !d.email) missing.push("e-mail");
  if (v.phone && !d.phone) missing.push("téléphone");
  if (v.role && !d.role) missing.push("fonction");
  if (v.company && !d.company) missing.push("entreprise");
  if (missing.length) {
    warnings.push({ text: "Champs affichés mais incomplets : " + missing.join(", ") + ".", level: "info" });
  }

  // Images locales ou intégrées : rappel d'hébergement public.
  const localImgs = ["photo", "logo", "banner"].filter(
    (k) => v[k] && d[k] && !/^https?:\/\//i.test(d[k])
  );
  if (localImgs.length) {
    warnings.push({
      text: "Images non hébergées publiquement (" + localImgs.join(", ") +
        ") : elles risquent de ne pas s'afficher chez vos destinataires. Hébergez-les en https:// (voir README).",
      level: "info"
    });
  }

  const box = $("#warnings");
  box.innerHTML = warnings.length
    ? warnings.map((w) =>
        `<div class="warning-item${w.level === "info" ? " is-info" : ""}">${w.level === "info" ? "ℹ️" : "⚠️"} ${esc(w.text)}</div>`
      ).join("")
    : `<span class="warnings-ok">✓ Aucun problème détecté.</span>`;

  // Marque visuellement les champs en erreur.
  for (const w of warnings) {
    if (w.level === "error" && w.field) {
      const input = document.querySelector(`[data-field="${w.field}"]`);
      if (input) { input.classList.add("is-invalid"); input.setAttribute("aria-invalid", "true"); }
    }
  }
}

/** Reporte l'état dans les champs du formulaire (au chargement / reset). */
function syncFormFromState() {
  $$("[data-field]").forEach((el) => { el.value = state.data[el.dataset.field] ?? ""; });
  $$("[data-show]").forEach((el) => { el.checked = state.show[el.dataset.show] !== false; });
  $$("[data-style]").forEach((el) => {
    el.value = state.style[el.dataset.style];
    updateRangeOutput(el);
  });
}

/** Affiche la valeur des curseurs (ex. « 13 px »). */
function updateRangeOutput(el) {
  if (el.type !== "range") return;
  const out = document.getElementById("out-" + el.dataset.style);
  if (out) out.textContent = el.value + " px";
}

let toastTimer = null;
/** Message clair après copie, téléchargement ou erreur. */
function showToast(message, type = "success") {
  const t = $("#toast");
  t.textContent = message;
  t.className = "toast is-" + type;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 3500);
}

/* =======================================================================
 * 6. BANQUE D'IMAGES
 * ===================================================================== */

let imageBank = { categories: [] };
let currentCategory = "entreprise";
let selectedBankImage = null; // { file, alt }

/** Charge images.json ; en cas de blocage (file://), utilise images-data.js. */
async function loadImageBank() {
  try {
    const res = await fetch("assets/images.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    imageBank = await res.json();
  } catch {
    imageBank = window.IMAGE_BANK || { categories: [] };
  }
  renderBankTabs();
  renderBankGrid();
}

/** Catégories = celles du JSON + « Mes imports ». */
function getBankCategories() {
  const cats = imageBank.categories.slice();
  cats.push({
    id: "imports",
    label: "Mes imports",
    description: "Images importées depuis votre ordinateur (stockées localement).",
    images: importedImages
  });
  return cats;
}

function renderBankTabs() {
  const nav = $("#bank-tabs");
  nav.innerHTML = "";
  for (const cat of getBankCategories()) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "bank-tab" + (cat.id === currentCategory ? " is-active" : "");
    b.textContent = cat.label;
    b.title = cat.description || "";
    b.addEventListener("click", () => {
      currentCategory = cat.id;
      renderBankTabs();
      renderBankGrid();
    });
    nav.appendChild(b);
  }
}

function renderBankGrid() {
  const grid = $("#bank-grid");
  grid.innerHTML = "";
  const cat = getBankCategories().find((c) => c.id === currentCategory);
  if (!cat || !cat.images.length) {
    grid.innerHTML = `<p class="bank-empty">Aucune image dans cette catégorie.</p>`;
    return;
  }
  for (const img of cat.images) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "bank-item";
    b.title = img.alt || "";
    b.innerHTML = `<img src="${esc(img.file)}" alt="${esc(img.alt || "")}" loading="lazy">`;
    b.addEventListener("click", () => openBankPreview(img, b));
    grid.appendChild(b);
  }
}

/** Aperçu avant utilisation. */
function openBankPreview(img, btn) {
  selectedBankImage = img;
  $$(".bank-item").forEach((el) => el.classList.remove("is-selected"));
  if (btn) btn.classList.add("is-selected");
  $("#bank-preview-img").src = img.file;
  $("#bank-preview-img").alt = img.alt || "Aperçu";
  $("#bank-preview-name").textContent = img.alt || img.name || "";
  $("#bank-preview").hidden = false;
}

/** Import d'une image depuis l'ordinateur (convertie en données locales). */
function handleImportFile(file) {
  if (!file) return;
  if (file.size > 400 * 1024) {
    showToast("Image trop lourde (max 400 Ko conseillé pour une signature).", "error");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const entry = { file: reader.result, alt: file.name, name: file.name };
    importedImages.push(entry);
    saveImports();
    currentCategory = "imports";
    renderBankTabs();
    renderBankGrid();
    openBankPreview(entry);
    showToast("Image importée. Choisissez son usage dans l'aperçu.", "success");
  };
  reader.onerror = () => showToast("Impossible de lire ce fichier.", "error");
  reader.readAsDataURL(file);
}

/* =======================================================================
 * 7. EXPORT
 * ===================================================================== */

/** Copie la signature mise en forme (HTML + texte brut). */
async function copySignature() {
  const html = buildSignatureHtml(state);
  const plain = buildPlainText(state);
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([plain], { type: "text/plain" })
      })
    ]);
    showToast("Signature copiée ! Collez-la dans les réglages de votre messagerie.", "success");
  } catch {
    // Secours : copie via sélection de l'aperçu.
    if (copyBySelection()) {
      showToast("Signature copiée (méthode de secours).", "success");
    } else {
      selectSignature();
      showToast("Copie automatique impossible : signature sélectionnée, faites Ctrl+C / Cmd+C.", "error");
    }
  }
}

/** Sélectionne l'aperçu et tente execCommand('copy'). */
function copyBySelection() {
  selectSignature();
  try { return document.execCommand("copy"); }
  catch { return false; }
}

/** Solution de secours : sélection manuelle de la signature. */
function selectSignature() {
  const node = $("#preview-signature");
  const range = document.createRange();
  range.selectNodeContents(node);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  node.focus();
}

/** Copie le code HTML brut. */
async function copyHtmlCode() {
  const html = buildSignatureHtml(state);
  try {
    await navigator.clipboard.writeText(html);
    showToast("Code HTML copié.", "success");
  } catch {
    // Secours : zone de texte temporaire.
    const ta = document.createElement("textarea");
    ta.value = html;
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    showToast(ok ? "Code HTML copié." : "Copie impossible dans ce navigateur.", ok ? "success" : "error");
  }
}

/** Télécharge le fichier signature.html. */
function downloadHtml() {
  const blob = new Blob([buildEmailDocument(state)], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "signature.html";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast("Fichier signature.html téléchargé.", "success");
}

/* =======================================================================
 * 8. ÉVÉNEMENTS + DÉMARRAGE
 * ===================================================================== */

function bindEvents() {
  // --- Formulaire : informations ---
  $$("[data-field]").forEach((el) => {
    el.addEventListener("input", () => {
      updateState((s) => { s.data[el.dataset.field] = el.value; });
    });
  });

  // --- Formulaire : visibilité ---
  $$("[data-show]").forEach((el) => {
    el.addEventListener("change", () => {
      updateState((s) => { s.show[el.dataset.show] = el.checked; });
    });
  });

  // --- Formulaire : style ---
  $$("[data-style]").forEach((el) => {
    el.addEventListener("input", () => {
      updateRangeOutput(el);
      const num = ["fontSize", "nameSize", "spacing", "photoSize", "logoSize", "iconSize"];
      updateState((s) => {
        s.style[el.dataset.style] = num.includes(el.dataset.style) ? Number(el.value) : el.value;
      });
    });
  });

  // --- Édition WYSIWYG : cliquer un élément de l'aperçu focalise son champ ---
  $("#preview-signature").addEventListener("click", (e) => {
    const target = e.target.closest("[data-edit]");
    if (!target) return;
    e.preventDefault(); // évite de suivre les liens dans l'aperçu
    const input = document.querySelector(`[data-field="${target.dataset.edit}"]`);
    if (input) {
      input.scrollIntoView({ block: "center", behavior: "smooth" });
      input.focus({ preventScroll: true });
    }
  });

  // --- Aperçu : fond clair / sombre ---
  const frame = $("#email-frame");
  $("#btn-bg-light").addEventListener("click", () => setToggle(frame, "bg-light", "bg-dark", "#btn-bg-light", "#btn-bg-dark"));
  $("#btn-bg-dark").addEventListener("click", () => setToggle(frame, "bg-dark", "bg-light", "#btn-bg-dark", "#btn-bg-light"));
  // --- Aperçu : ordinateur / mobile ---
  $("#btn-dev-desktop").addEventListener("click", () => setToggle(frame, "device-desktop", "device-mobile", "#btn-dev-desktop", "#btn-dev-mobile"));
  $("#btn-dev-mobile").addEventListener("click", () => setToggle(frame, "device-mobile", "device-desktop", "#btn-dev-mobile", "#btn-dev-desktop"));

  function setToggle(el, addCls, removeCls, activeBtn, inactiveBtn) {
    el.classList.add(addCls);
    el.classList.remove(removeCls);
    $(activeBtn).classList.add("is-active");
    $(inactiveBtn).classList.remove("is-active");
  }

  // --- Banque d'images ---
  $("#import-file").addEventListener("change", (e) => {
    handleImportFile(e.target.files[0]);
    e.target.value = ""; // permet de réimporter le même fichier
  });
  $("#bank-preview-close").addEventListener("click", () => {
    $("#bank-preview").hidden = true;
    selectedBankImage = null;
    $$(".bank-item").forEach((el) => el.classList.remove("is-selected"));
  });
  $$("[data-use-as]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!selectedBankImage) return;
      const slot = btn.dataset.useAs; // photo | logo | banner
      updateState((s) => {
        s.data[slot] = selectedBankImage.file;
        s.show[slot] = true;
      });
      syncFormFromState();
      const labels = { photo: "photo", logo: "logo", banner: "bannière" };
      showToast(`Image appliquée comme ${labels[slot]}.`, "success");
    });
  });

  // --- Export ---
  $("#btn-copy").addEventListener("click", copySignature);
  $("#btn-select").addEventListener("click", () => {
    selectSignature();
    showToast("Signature sélectionnée : copiez avec Ctrl+C / Cmd+C.", "success");
  });
  $("#btn-copy-html").addEventListener("click", copyHtmlCode);
  $("#btn-download").addEventListener("click", downloadHtml);

  // --- Réinitialisations ---
  $("#btn-reset-style").addEventListener("click", () => {
    updateState((s) => { s.style = structuredClone(DEFAULT_STATE.style); });
    syncFormFromState();
    showToast("Style réinitialisé.", "success");
  });
  $("#btn-reset-all").addEventListener("click", () => {
    if (!confirm("Effacer toutes les informations et personnalisations ?")) return;
    localStorage.removeItem(STORAGE_KEY);
    state = structuredClone(DEFAULT_STATE);
    saveState();
    syncFormFromState();
    renderAll();
    showToast("Application réinitialisée avec les données de démonstration.", "success");
  });
}

/* --- Démarrage --- */
document.addEventListener("DOMContentLoaded", () => {
  syncFormFromState();
  bindEvents();
  renderAll();
  loadImageBank();
});
