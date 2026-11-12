// Builds the "50+ Kanca Kütüphanesi" PDF sent to commenters of Reel 10.
const fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "hooks.json"), "utf8"));
let n = 0;
const sec = data.map(([title, sub, hooks]) => `
  <section><h2>${title}</h2><p class="sub">${sub}</p>
  <ol start="${n + 1}">${hooks.map(h => (n++, `<li>${h}</li>`)).join("")}</ol></section>`);
const pages = [[0, 1], [2, 3], [4, 5, 6]].map(g => `<main>${g.map(i => sec[i]).join("")}</main>`).join("");
const html = `<!doctype html><html lang="tr"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<style>
@page{size:A4;margin:0}
*{box-sizing:border-box}body{margin:0;background:#080808;color:#f5f5f5;font-family:Inter,sans-serif;-webkit-print-color-adjust:exact}
.cover{height:297mm;padding:28mm 22mm;display:flex;flex-direction:column;justify-content:space-between;page-break-after:always;background:radial-gradient(circle at 80% 20%,rgba(226,98,5,.35),transparent 55%),#080808}
.brand{font-weight:800;font-size:20px;letter-spacing:.04em}.brand span{color:#a0a0a0;font-weight:400}
.cover h1{font-size:64px;line-height:1.02;margin:0;font-weight:800;letter-spacing:-.03em}
.cover h1 em{font-family:'Instrument Serif',serif;font-weight:400;color:#E26205;font-size:76px}
.cover p{color:#a0a0a0;font-size:18px;max-width:120mm;line-height:1.5}
.how{border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:18px 22px;font-size:15px;line-height:1.6;color:#d8d8d8}
.how b{color:#E26205}
main{height:297mm;padding:18mm 22mm;page-break-after:always;position:relative}main:last-of-type{page-break-after:auto}
section{break-inside:avoid;margin-bottom:10mm}
h2{font-size:24px;margin:0 0 2px;letter-spacing:-.01em}h2::before{content:"";display:inline-block;width:10px;height:10px;border-radius:50%;background:#E26205;margin-right:10px;vertical-align:middle}
.sub{color:#a0a0a0;margin:0 0 10px;font-size:14px}
ol{margin:0;padding-left:30px}li{font-size:16px;line-height:1.45;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.07)}
li::marker{color:#E26205;font-weight:800}
footer{position:absolute;left:22mm;right:22mm;bottom:14mm;color:#a0a0a0;font-size:13px}
</style></head><body>
<div class="cover"><div class="brand">FNGN <span>Dijital</span></div>
<div><h1>50+ <em>Kanca</em><br>Kütüphanesi</h1>
<p>Videonun ilk 3 saniyesi, izlenip izlenmeyeceğini belirler. Bu listedeki kancaları kendi markana uyarla, videonun en başına koy.</p></div>
<div class="how"><b>Nasıl kullanılır?</b><br>1. Bir kanca seç ve ilk 1–3 saniyede ekrana yaz ya da söyle.<br>2. Hemen ardından asıl içeriğine geç. Kancanın vaadini mutlaka karşıla.<br>3. Görsel kancayı (sahne) yazılı kancayla birleştir: etkisi ikiye katlanır.</div></div>
${pages.replace(/<\/main>$/, "")}<footer>FNGN Dijital · @fngndijital · fngn.com.tr — Markan için hareketli tasarım, web ve içerik.</footer>
</main></body></html>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.setContent(html, { waitUntil: "networkidle" }).catch(() => p.setContent(html));
  await p.pdf({ path: process.argv[2] || "kanca-kutuphanesi.pdf", format: "A4", printBackground: true });
  await b.close(); console.log("hooks:", n);
})();
