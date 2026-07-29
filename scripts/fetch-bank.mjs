import fs from "fs";
import path from "path";

const UA = "SignatureStudio/1.0 (https://github.com/Mairie-de-Meru/signature-studio)";
const API = "https://commons.wikimedia.org/w/api.php";
const ROOT = process.cwd();

const CATS = [
  { id: "mairies",    label: "Hôtels de ville", query: "hôtel de ville",                slot: "banner", n: 6 },
  { id: "vie-locale", label: "Vie locale",      query: "place publique France",         slot: "banner", n: 6 },
  { id: "nature",     label: "Nature & Parcs",  query: "parc urbain jardin public",     slot: "banner", n: 6 },
  { id: "france",     label: "France & Symboles", query: "Marianne drapeau France",      slot: "logo",   n: 4 },
  { id: "fonds",      label: "Fonds abstraits", query: "abstract gradient background",   slot: "banner", n: 6 },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function sanitize(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50);
}

async function fetchCat(cat) {
  const url = `${API}?action=query&generator=search&gsrsearch=${encodeURIComponent(cat.query)}` +
    `&gsrnamespace=6&gsrlimit=${cat.n}&prop=imageinfo&iiprop=url|mime|extmetadata&iiurlwidth=700&format=json`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  const json = await res.json();
  const pages = json.query?.pages || {};
  const out = [];
  let i = 0;
  for (const p of Object.values(pages)) {
    const ii = p.imageinfo?.[0];
    if (!ii) continue;
    const mime = ii.mime || "";
    if (!mime.startsWith("image/")) continue;
    const lic = ii.extmetadata?.LicenseShortName?.value || "";
    if (/non-free|copyrighted/i.test(lic)) continue;
    const thumb = ii.thumburl;
    if (!thumb) continue;
    const ext = (thumb.split(".").pop().split(/[?#]/)[0] || "jpg").toLowerCase();
    if (!["jpg", "jpeg", "png", "webp"].includes(ext)) continue;
    const safeBase = sanitize(p.title.replace(/^File:/, "")) || `img${i}`;
    const fname = `${safeBase}-${i}.${ext === "jpeg" ? "jpg" : ext}`;
    const dir = path.join(ROOT, "assets", "images", "banks", cat.id);
    fs.mkdirSync(dir, { recursive: true });
    const fpath = path.join(dir, fname);
    try {
      const r2 = await fetch(thumb, { headers: { "User-Agent": UA } });
      if (!r2.ok) continue;
      const buf = Buffer.from(await r2.arrayBuffer());
      if (buf.length < 4000) continue; // skip tiny/placeholder
      fs.writeFileSync(fpath, buf);
      out.push({
        file: `assets/images/banks/${cat.id}/${fname}`,
        alt: (ii.extmetadata?.ObjectName?.value || p.title.replace(/^File:/, "")).slice(0, 80),
        slot: cat.slot,
        license: lic,
        source: ii.descriptionurl,
      });
      i++;
    } catch (e) {
      console.warn("  skip", p.title, e.message);
    }
    await sleep(500);
  }
  return out;
}

async function main() {
  const imagesJsonPath = path.join(ROOT, "assets", "images.json");
  const data = JSON.parse(fs.readFileSync(imagesJsonPath, "utf8"));
  const existingIds = new Set(data.categories.map((c) => c.id));
  for (const cat of CATS) {
    if (existingIds.has(cat.id)) {
      console.log(`Catégorie "${cat.id}" existe déjà, ignorée.`);
      continue;
    }
    console.log(`Récupération: ${cat.label} (${cat.query})…`);
    const imgs = await fetchCat(cat);
    console.log(`  -> ${imgs.length} image(s)`);
    data.categories.push({
      id: cat.id,
      label: cat.label,
      description: `Images libres de droits (Wikimedia Commons, ${cat.slot === "banner" ? "bannière" : "logo"}).`,
      images: imgs,
    });
    await sleep(800);
  }
  fs.writeFileSync(imagesJsonPath, JSON.stringify(data, null, 2) + "\n");
  console.log("images.json mis à jour.");
}

main().catch((e) => { console.error(e); process.exit(1); });
