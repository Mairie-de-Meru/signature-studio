"use strict";

const STORAGE_KEY = "signature-studio:state:v2";
const IMPORTS_KEY = "signature-studio:imports:v1";

const BASE_URL = window.location.origin +
  (window.location.pathname.replace(/\/[^/]*$/, '/') || '/');

function resolveImgUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  if (/^data:/i.test(path)) return path;
  return BASE_URL + path.replace(/^\.?\//, '');
}

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
    bannerTitle: "",
    bannerSubtitle: "",
    linkedin: "https://www.linkedin.com/in/camille-durand",
    instagram: "https://www.instagram.com/lumeastudio",
    facebook: "",
    x: "",
    youtube: "",
    legal: "🌱 Pensez à l'environnement : n'imprimez ce message que si nécessaire."
  },
  show: {
    photo: true, logo: true, banner: true,
    role: true, company: true, phone: true, email: true,
    website: true, address: true, social: true, legal: true
  },
  style: {
    font: "Arial, Helvetica, sans-serif",
    fontSize: 13, nameSize: 17,
    primary: "#1a5fb4", secondary: "#5b6e84", text: "#333333",
    align: "left", spacing: 6, photoSize: 72, logoSize: 100, iconSize: 22,
    bannerTextColor: "#ffffff", bannerTextSize: 22, bannerPos: "center", bannerAlign: "center"
  }
};

const SOCIAL_NETWORKS = [
  { key: "linkedin",  label: "LinkedIn",  short: "in", color: "#0A66C2" },
  { key: "instagram", label: "Instagram", short: "Ig", color: "#E4405F" },
  { key: "facebook",  label: "Facebook",  short: "f",  color: "#1877F2" },
  { key: "x",         label: "X",         short: "X",  color: "#111111" },
  { key: "youtube",   label: "YouTube",   short: "YT", color: "#FF0000" }
];

function esc(str) {
  return String(str || "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

function isValidUrl(v) {
  try {
    const u = new URL(v.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch { return false; }
}

function absUrl(v) {
  const t = String(v || "").trim();
  if (!t) return "";
  return /^https?:\/\//i.test(t) ? t : "https://" + t;
}

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

let state = loadState();
let importedImages = loadImports();
let saveTimer = null;
let bannerComposite = null;
let bannerCompositeWarned = false;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return mergeDefaults(JSON.parse(raw), DEFAULT_STATE);
  } catch {}
  return structuredClone(DEFAULT_STATE);
}

function saveState() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch { showToast("Impossible d'enregistrer localement.", "error"); }
  }, 300);
}

function loadImports() {
  try { return JSON.parse(localStorage.getItem(IMPORTS_KEY)) || []; }
  catch { return []; }
}

function saveImports() {
  try { localStorage.setItem(IMPORTS_KEY, JSON.stringify(importedImages)); }
  catch { showToast("Image trop lourde pour être conservée.", "error"); }
}

function updateState(mutator) {
  mutator(state);
  saveState();
  renderAll();
}

function buildParts(st, exportMode) {
  const d = st.data, s = st.style, v = st.show;
  const at = (k) => (exportMode ? "" : ` data-edit="${k}"`);
  const base = `font-family:${s.font};font-size:${s.fontSize}px;color:${s.text};line-height:1.5;`;
  const link = `color:${s.primary};text-decoration:none;`;
  const fullName = [d.firstName, d.lastName].filter(Boolean).join(" ");
  const img = (k) => exportMode ? resolveImgUrl(d[k]) : d[k];

  const parts = { at, base, link, fullName, d, s, v, img };

  parts.name = `<span${at("firstName")} style="font-family:${s.font};font-size:${s.nameSize}px;font-weight:bold;color:${s.primary};">${esc(fullName)}</span>`;

  parts.role = (v.role && d.role)
    ? `<span${at("role")} style="${base}">${esc(d.role)}</span>` : "";

  parts.company = (v.company && d.company)
    ? `<span${at("company")} style="font-family:${s.font};font-size:${s.fontSize}px;font-weight:bold;color:${s.secondary};">${esc(d.company)}</span>` : "";

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
  parts.contactBlock = contact.map((c) => `<div style="padding-top:2px;">${c}</div>`).join("");
  parts.contactInline = contact.join(`<span style="${base}color:${s.secondary};">&nbsp;&nbsp;&bull;&nbsp;&nbsp;</span>`);

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

  const ps = s.photoSize, ls = s.logoSize;
  parts.photo = (v.photo && d.photo)
    ? `<img${at("photo")} src="${esc(img("photo"))}" alt="Photo de ${esc(fullName) || "profil"}" width="${ps}" height="${ps}" style="display:block;width:${ps}px;height:${ps}px;border-radius:50%;object-fit:cover;">`
    : "";
  parts.logo = (v.logo && d.logo)
    ? `<img${at("logo")} src="${esc(img("logo"))}" alt="Logo ${esc(d.company) || "entreprise"}" width="${ls}" style="display:block;width:${ls}px;height:auto;max-width:180px;">`
    : "";
  const bannerSrc = getBannerSrc(exportMode);
  parts.banner = (v.banner && bannerSrc)
    ? `<img${at("banner")} src="${esc(bannerSrc)}" alt="Bannière ${esc(d.company) || "promotionnelle"}" width="480" style="display:block;width:100%;max-width:480px;height:auto;border-radius:4px;">`
    : "";

  parts.legal = (v.legal && d.legal)
    ? `<span${at("legal")} style="font-family:${s.font};font-size:${Math.max(10, s.fontSize - 3)}px;color:#8a949e;">${esc(d.legal)}</span>`
    : "";

  return parts;
}

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

function buildSignatureHtml(st, { export: exp = false } = {}) {
  const tpl = TEMPLATES[st.template] || TEMPLATES.classique;
  return tpl.render(buildParts(st, exp));
}

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

function buildEmailDocument(st) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Signature e-mail — ${esc([st.data.firstName, st.data.lastName].filter(Boolean).join(" "))}</title>
</head>
<body>
${buildSignatureHtml(st, { export: true })}
</body>
</html>`;
}

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function renderAll() {
  renderPreview();
  renderTemplateList();
  renderImageSlots();
  renderWarnings();
  updateBannerComposite();
}

function renderPreview() {
  $("#preview-signature").innerHTML = buildSignatureHtml(state);
}

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
    card.title = tpl.label;
    const mini = { ...state, template: id, show: { ...state.show }, data: { ...state.data }, style: { ...state.style } };
    card.innerHTML =
      `<div class="tpl-thumb" aria-hidden="true"><div class="tpl-thumb-inner">${buildSignatureHtml(mini)}</div></div>` +
      `<span class="tpl-name">${tpl.label}</span>`;
    card.addEventListener("click", () => updateState((s) => { s.template = id; }));
    list.appendChild(card);
  }
}

function renderImageSlots() {
  const setImg = (id, val) => { const el = $(id); if (el) el.src = val || ""; };
  setImg("#slot-photo", state.data.photo);
  setImg("#slot-logo", state.data.logo);
  setImg("#slot-banner", getBannerSrc(false));
}

function getBannerSrc(exportMode) {
  const hasText = (state.data.bannerTitle || "").trim() || (state.data.bannerSubtitle || "").trim();
  if (hasText && bannerComposite) return bannerComposite;
  const base = state.data.banner;
  return exportMode ? resolveImgUrl(base) : base;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = () => resolve(im);
    im.onerror = reject;
    im.src = src;
  });
}

function drawCover(ctx, im, W, H) {
  const ir = im.naturalWidth / im.naturalHeight;
  const cr = W / H;
  let dw, dh, dx, dy;
  if (ir > cr) { dh = H; dw = H * ir; dx = (W - dw) / 2; dy = 0; }
  else { dw = W; dh = W / ir; dx = 0; dy = (H - dh) / 2; }
  ctx.drawImage(im, dx, dy, dw, dh);
}

function drawBannerText(ctx, W, H) {
  const s = state.style;
  const title = (state.data.bannerTitle || "").trim();
  const sub = (state.data.bannerSubtitle || "").trim();
  if (!title && !sub) return;
  const align = s.bannerAlign || "center";
  const pos = s.bannerPos || "center";
  const titleSize = Number(s.bannerTextSize) || 22;
  const subSize = Math.max(10, Math.round(titleSize * 0.6));
  const color = s.bannerTextColor || "#ffffff";
  const gap = Math.round(titleSize * 0.18);
  const totalH = (title ? titleSize : 0) + (sub ? subSize + gap : 0);
  const y = pos === "top" ? 14 + totalH / 2 : pos === "bottom" ? H - 14 - totalH / 2 : H / 2;
  const x = align === "left" ? 18 : align === "right" ? W - 18 : W / 2;
  ctx.textBaseline = "middle";
  ctx.textAlign = align;
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 4;
  if (title) {
    ctx.font = "bold " + titleSize + "px " + s.font;
    ctx.fillStyle = color;
    ctx.fillText(title, x, y - totalH / 2 + titleSize / 2);
  }
  if (sub) {
    ctx.font = subSize + "px " + s.font;
    ctx.fillStyle = color;
    ctx.fillText(sub, x, y + totalH / 2 - subSize / 2);
  }
  ctx.shadowBlur = 0;
}

async function updateBannerComposite() {
  const hasText = (state.data.bannerTitle || "").trim() || (state.data.bannerSubtitle || "").trim();
  bannerComposite = null;
  if (!hasText) { renderPreview(); return; }
  const base = state.data.banner ? resolveImgUrl(state.data.banner) : null;
  const W = 480;
  let H = 120;
  let im = null;
  if (base) {
    try { im = await loadImage(base); }
    catch { im = null; }
  }
  const canvas = document.createElement("canvas");
  if (im) H = Math.max(60, Math.round(W * im.naturalHeight / im.naturalWidth));
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (im) drawCover(ctx, im, W, H);
  else { ctx.fillStyle = "#eef1f6"; ctx.fillRect(0, 0, W, H); }
  drawBannerText(ctx, W, H);
  try {
    bannerComposite = canvas.toDataURL("image/png");
  } catch {
    bannerComposite = null;
    if (!bannerCompositeWarned) {
      bannerCompositeWarned = true;
      showToast("Aperçu bannière indisponible sur ce navigateur.", "error");
    }
  }
  renderPreview();
}

function renderWarnings() {
  const d = state.data, v = state.show;
  const warnings = [];

  $$("#signature-form input").forEach((i) => i.classList.remove("is-invalid"));

  if (!d.firstName && !d.lastName) {
    warnings.push({ text: "Renseignez au moins un prénom ou un nom.", level: "error", field: "firstName" });
  }
  if (v.email && d.email && !isValidEmail(d.email)) {
    warnings.push({ text: "Format d'email invalide.", level: "error", field: "email" });
  }
  if (v.website && d.website && !isValidUrl(absUrl(d.website))) {
    warnings.push({ text: "URL du site web invalide.", level: "error", field: "website" });
  }
  for (const n of SOCIAL_NETWORKS) {
    if (v.social && d[n.key] && !isValidUrl(absUrl(d[n.key]))) {
      warnings.push({ text: `URL ${n.label} invalide.`, level: "error", field: n.key });
    }
  }

  const missing = [];
  if (v.email && !d.email) missing.push("e-mail");
  if (v.phone && !d.phone) missing.push("téléphone");
  if (v.role && !d.role) missing.push("fonction");
  if (v.company && !d.company) missing.push("entreprise");
  if (missing.length) {
    warnings.push({ text: "Champs affichés mais vides : " + missing.join(", ") + ".", level: "info" });
  }

  const box = $("#warnings");
  if (warnings.length) {
    box.innerHTML = warnings.map((w) =>
      `<div class="warning-item${w.level === "info" ? " is-info" : ""}">${w.level === "info" ? "ℹ️" : "⚠️"} ${esc(w.text)}</div>`
    ).join("");
  } else {
    box.innerHTML = `<span class="warnings-ok">✓ Aucun problème détecté.</span>`;
  }

  for (const w of warnings) {
    if (w.level === "error" && w.field) {
      const inp = document.querySelector(`[data-field="${w.field}"]`);
      if (inp) { inp.classList.add("is-invalid"); inp.setAttribute("aria-invalid", "true"); }
    }
  }
}

function syncFormFromState() {
  $$("[data-field]").forEach((el) => { el.value = state.data[el.dataset.field] ?? ""; });
  $$("[data-show]").forEach((el) => { el.checked = state.show[el.dataset.show] !== false; });
  $$("[data-style]").forEach((el) => {
    el.value = state.style[el.dataset.style];
    updateRangeOutput(el);
  });
}

function updateRangeOutput(el) {
  if (el.type !== "range") return;
  const out = document.getElementById("out-" + el.dataset.style);
  if (out) out.textContent = el.value + "px";
}

function updateCopyBtn(text, type) {
  const btn = $("#btn-copy");
  const orig = btn.innerHTML;
  btn.innerHTML = text;
  btn.className = "btn btn-" + type + " btn-copied";
  setTimeout(() => { btn.innerHTML = orig; btn.className = "btn btn-primary"; }, 1500);
}

let toastTimer = null;
function showToast(message, type = "success") {
  const t = $("#toast");
  t.textContent = message;
  t.className = "toast is-" + type;
  t.classList.remove("is-hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.classList.add("is-hidden"); }, 3500);
}

const TPL_COLORS = {
  classique: { primary: "#1a5fb4", secondary: "#5b6e84", text: "#333333" },
  moderne:   { primary: "#1f8f74", secondary: "#5a7a6b", text: "#2a3a33" },
  compact:   { primary: "#7a3fa8", secondary: "#6a5a7a", text: "#333333" },
  banniere:  { primary: "#c2571f", secondary: "#7a6a5a", text: "#333333" }
};

function applyTemplateColors(tplId) {
  const c = TPL_COLORS[tplId];
  if (!c) return;
  updateState((s) => {
    s.style.primary = c.primary;
    s.style.secondary = c.secondary;
    s.style.text = c.text;
  });
  syncFormFromState();
}

function showModal(title, message, onConfirm) {
  const layer = $("#modal-layer");
  layer.innerHTML = `<div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="modal-box">
      <h3 id="modal-title">${esc(title)}</h3>
      <p>${esc(message)}</p>
      <div class="modal-actions">
        <button type="button" class="btn" id="modal-cancel">Annuler</button>
        <button type="button" class="btn btn-danger" id="modal-confirm">Confirmer</button>
      </div>
    </div>
  </div>`;
  layer.classList.remove("is-hidden");
  const close = () => { layer.innerHTML = ""; layer.classList.add("is-hidden"); };
  $("#modal-cancel").addEventListener("click", close);
  $("#modal-confirm").addEventListener("click", () => { close(); onConfirm(); });
  layer.querySelector(".modal-overlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) close();
  });
}

let imageBank = { categories: [] };
let currentCategory = "entreprise";
let selectedBankImage = null;

async function loadImageBank() {
  try {
    const res = await fetch(BASE_URL + "assets/images.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    imageBank = await res.json();
  } catch {
    imageBank = window.IMAGE_BANK || { categories: [] };
  }
  renderBankTabs();
  renderBankGrid();
}

function getBankCategories() {
  const cats = imageBank.categories.slice();
  cats.push({
    id: "imports",
    label: "Mes imports",
    description: "Images importées depuis votre ordinateur.",
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

function openBankPreview(img, btn) {
  selectedBankImage = img;
  $$(".bank-item").forEach((el) => el.classList.remove("is-selected"));
  if (btn) btn.classList.add("is-selected");
  $("#bank-preview-img").src = img.file;
  $("#bank-preview-img").alt = img.alt || "Aperçu";
  $("#bank-preview-name").textContent = img.alt || img.name || "";
  $("#bank-preview").classList.remove("is-hidden");
}

function closeBankPreview() {
  $("#bank-preview").classList.add("is-hidden");
  selectedBankImage = null;
  $$(".bank-item").forEach((el) => el.classList.remove("is-selected"));
}

function openZoom(src, alt) {
  const layer = $("#zoom-layer");
  const im = $("#zoom-img");
  im.src = src;
  im.alt = alt || "";
  layer.classList.remove("is-hidden");
}

function closeZoom() {
  $("#zoom-layer").classList.add("is-hidden");
  $("#zoom-img").src = "";
}

function handleImportFile(file) {
  if (!file) return;
  if (file.size > 400 * 1024) {
    showToast("Image trop lourde (max 400 Ko).", "error");
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
    showToast("Image importée. Choisissez son usage.", "success");
  };
  reader.onerror = () => showToast("Impossible de lire ce fichier.", "error");
  reader.readAsDataURL(file);
}

async function copySignature() {
  const html = buildSignatureHtml(state, { export: true });
  const plain = buildPlainText(state);
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([plain], { type: "text/plain" })
      })
    ]);
    updateCopyBtn("✓ Copiée !", "primary");
    showToast("Signature copiée ! Collez-la dans les réglages de votre messagerie.", "success");
  } catch {
    if (copyBySelection()) {
      updateCopyBtn("✓ Copiée !", "primary");
      showToast("Signature copiée (méthode de secours).", "success");
    } else {
      selectSignature();
      showToast("Copie automatique impossible. Faites Ctrl+C / Cmd+C.", "error");
    }
  }
}

function copyBySelection() {
  selectSignature();
  try { return document.execCommand("copy"); }
  catch { return false; }
}

function selectSignature() {
  const node = $("#preview-signature");
  const range = document.createRange();
  range.selectNodeContents(node);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  node.focus();
}

async function copyHtmlCode() {
  const html = buildSignatureHtml(state, { export: true });
  try {
    await navigator.clipboard.writeText(html);
    showToast("Code HTML copié.", "success");
  } catch {
    const ta = document.createElement("textarea");
    ta.value = html;
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    showToast(ok ? "Code HTML copié." : "Copie impossible.", ok ? "success" : "error");
  }
}

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

function bindEvents() {
  $$("[data-field]").forEach((el) => {
    el.addEventListener("input", () => {
      updateState((s) => { s.data[el.dataset.field] = el.value; });
    });
  });

  $$("[data-show]").forEach((el) => {
    el.addEventListener("change", () => {
      updateState((s) => { s.show[el.dataset.show] = el.checked; });
    });
  });

  $$("[data-style]").forEach((el) => {
    el.addEventListener("input", () => {
      updateRangeOutput(el);
      const num = ["fontSize", "nameSize", "spacing", "photoSize", "logoSize", "iconSize"];
      updateState((s) => {
        s.style[el.dataset.style] = num.includes(el.dataset.style) ? Number(el.value) : el.value;
      });
    });
  });

  $("#preview-signature").addEventListener("click", (e) => {
    const img = e.target.closest("img");
    if (img && img.getAttribute("src")) {
      openZoom(img.currentSrc || img.src, img.alt);
      return;
    }
    const target = e.target.closest("[data-edit]");
    if (!target) return;
    e.preventDefault();
    const input = document.querySelector(`[data-field="${target.dataset.edit}"]`);
    if (input) {
      input.scrollIntoView({ block: "center", behavior: "smooth" });
      input.focus({ preventScroll: true });
    }
  });

  $("#import-file").addEventListener("change", (e) => {
    handleImportFile(e.target.files[0]);
    e.target.value = "";
  });
  $("#bank-preview-close").addEventListener("click", closeBankPreview);

  $("#zoom-close").addEventListener("click", closeZoom);
  $("#zoom-layer").addEventListener("click", (e) => { if (e.target.id === "zoom-layer") closeZoom(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeZoom(); });

  $$("[data-use-as]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!selectedBankImage) return;
      const slot = btn.dataset.useAs;
      updateState((s) => {
        s.data[slot] = selectedBankImage.file;
        s.show[slot] = true;
      });
      syncFormFromState();
      closeBankPreview();
      const labels = { photo: "photo", logo: "logo", banner: "bannière" };
      showToast(`Image appliquée comme ${labels[slot]}.`, "success");
    });
  });

  $("#btn-copy").addEventListener("click", copySignature);
  $("#btn-select").addEventListener("click", () => {
    selectSignature();
    showToast("Signature sélectionnée. Copiez avec Ctrl+C / Cmd+C.", "success");
  });
  $("#btn-copy-html").addEventListener("click", copyHtmlCode);
  $("#btn-download").addEventListener("click", downloadHtml);

  $("#btn-reset-style").addEventListener("click", () => {
    updateState((s) => { s.style = structuredClone(DEFAULT_STATE.style); });
    syncFormFromState();
    showToast("Style réinitialisé.", "success");
  });
  $("#btn-reset-all").addEventListener("click", () => {
    showModal(
      "Tout effacer ?",
      "Toutes les informations et personnalisations seront perdues. Cette action est irréversible.",
      () => {
        localStorage.removeItem(STORAGE_KEY);
        state = structuredClone(DEFAULT_STATE);
        saveState();
        syncFormFromState();
        renderAll();
        showToast("Application réinitialisée.", "success");
      }
    );
  });
}

document.addEventListener("DOMContentLoaded", () => {
  syncFormFromState();
  bindEvents();
  renderAll();
  loadImageBank();
});
