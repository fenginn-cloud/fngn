// Usage: node render.js <page> <outDir> <fromFrame> <toFrame> [t1,t2,...]
const { chromium } = require('playwright');
const fs = require('fs');
const [,, page = 'film.html', outDir = 'frames', from = '0', to = '1800', list] = process.argv;
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.log('ERR:', e.message));
  await p.goto(`http://localhost:8765/${page}`);
  await p.waitForFunction('window.ready === true', null, { timeout: 90000 });
  await p.evaluate(() => document.fonts.ready);
  console.log("samples", await p.evaluate(()=>{const c=document.querySelector("#stage canvas");const g=c.getContext("webgl2");return g.getParameter(g.SAMPLES)+" "+c.width+"x"+c.height;}));
  fs.mkdirSync(outDir, { recursive: true });
  const jobs = list ? list.split(',').map((t, i) => [i, +t]) : Array.from({ length: +to - +from }, (_, k) => [+from + k, (+from + k) / 30]);
  const t0 = Date.now();
  for (const [i, t] of jobs) {
    await p.evaluate(t => window.renderAt(t), t);
    await p.screenshot({ path: `${outDir}/${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 92 });
    if (i % 60 === 0) console.log(`${page} frame ${i} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  await b.close();
})();
