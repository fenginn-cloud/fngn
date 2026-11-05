// Kullanım: node render_subs.js <subs.html> <subs.json> <çıktı_klasörü> <kare_sayısı>
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const [,, page, json, out, n] = process.argv;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.addInitScript(`window.SUBS_JSON=${fs.readFileSync(json, 'utf8')};`);
  await p.goto('file://' + path.resolve(page)); await p.waitForFunction('window.ready===true'); await p.evaluate(() => document.fonts.ready);
  fs.mkdirSync(out, { recursive: true });
  for (let i = 0; i < +n; i++) { await p.evaluate(t => window.renderAt(t), i / 30);
    await p.screenshot({ path: `${out}/${String(i).padStart(4, '0')}.png`, omitBackground: true }); }
  await b.close();
})();
