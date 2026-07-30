import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const UA = "SignatureStudio/1.0 (https://github.com/Mairie-de-Meru/signature-studio)";
const STYLE = "avataaars";
const SEEDS = [
  "Aurélie","Camille","Julien","Marie","Pierre","Sophie",
  "Thomas","Valérie","Nicolas","Isabelle","Laurent","Élodie"
];
const CAT_ID = "avatars-modern";
const CAT_LABEL = "Avatars illustrés";

const sanitize = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const dir = path.join(ROOT, "assets", "images", "banks", CAT_ID);
  fs.mkdirSync(dir, { recursive: true });

  const imagesJsonPath = path.join(ROOT, "assets", "images.json");
  const data = JSON.parse(fs.readFileSync(imagesJsonPath, "utf8"));
  if (data.categories.find((c) => c.id === CAT_ID)) {
    console.log(`Catégorie "${CAT_ID}" existe déjà.`);
    return;
  }

  const out = [];
  for (const seed of SEEDS) {
    const safe = sanitize(seed);
    const fname = `${safe}.svg`;
    const url = `https://api.dicebear.com/9.x/${STYLE}/svg?seed=${encodeURIComponent(seed)}`;
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA } });
      if (!r.ok) { console.warn("skip", seed, r.status); continue; }
      const txt = await r.text();
      if (txt.length < 500) { console.warn("tiny", seed); continue; }
      fs.writeFileSync(path.join(dir, fname), txt);
      out.push({
        file: `assets/images/banks/${CAT_ID}/${fname}`,
        alt: `Avatar ${seed}`,
        slot: "photo",
        tintable: true,
        source: "DiceBear (libre de droits)",
      });
      console.log("ok", seed);
    } catch (e) {
      console.warn("err", seed, e.message);
    }
    await sleep(250);
  }

  data.categories.push({
    id: CAT_ID,
    label: CAT_LABEL,
    description: "Avatars illustrés (DiceBear, libre de droits). Teintez-les avec le sélecteur de couleur.",
    images: out,
  });
  fs.writeFileSync(imagesJsonPath, JSON.stringify(data, null, 2) + "\n");
  console.log("Terminé :", out.length, "avatars ajoutés.");
}

main().catch((e) => { console.error(e); process.exit(1); });
