import fs from "fs";
import path from "path";

const ROOT = process.cwd();

const mime = (f) => {
  const e = f.split(".").pop().toLowerCase();
  return ({ svg:"image/svg+xml", jpg:"image/jpeg", jpeg:"image/jpeg",
           png:"image/png", webp:"image/webp", gif:"image/gif" })[e]
      || "application/octet-stream";
};

const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const css  = fs.readFileSync(path.join(ROOT, "styles.css"), "utf8");
const js   = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
const data = JSON.parse(fs.readFileSync(path.join(ROOT, "assets", "images.json"), "utf8"));

const embedded = JSON.parse(JSON.stringify(data));
let inlined = 0;
for (const cat of embedded.categories) {
  for (const im of cat.images) {
    const fp = path.join(ROOT, im.file);
    if (!fs.existsSync(fp)) continue;
    const buf = fs.readFileSync(fp);
    im.file = "data:" + mime(im.file) + ";base64," + buf.toString("base64");
    inlined++;
  }
}
console.log("Images inlined :", inlined);

const bankJs = "window.IMAGE_BANK = " + JSON.stringify(embedded) + ";";

let out = html;
out = out.replace('<link rel="stylesheet" href="styles.css">',
                  "<style>\n" + css + "\n</style>");
out = out.replace('<script src="assets/images-data.js"></script>', "");
out = out.replace('<script src="app.js"></script>',
                  "<script>\n" + bankJs + "\n</script>\n<script>\n" + js + "\n</script>");

const outPath = path.join(ROOT, "index-single.html");
fs.writeFileSync(outPath, out);
const sizeMo = (fs.statSync(outPath).size / 1048576).toFixed(2);
console.log("Écrit :", outPath, "—", sizeMo, "Mo");
