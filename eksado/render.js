const { chromium } = require('playwright');
const fs = require('fs');
const [,, mode = 'test', outDir = 'frames'] = process.argv;
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  p.on('console', m => console.log('page:', m.text()));
  p.on('pageerror', e => console.log('ERR:', e.message));
  await p.goto('http://localhost:8765/index.html');
  await p.waitForFunction('window.ready === true', null, { timeout: 60000 });
  await p.evaluate(() => document.fonts.ready);
  fs.mkdirSync(outDir, { recursive: true });
  const times = mode === 'test' ? [1.2, 2.8, 4.6, 6.4, 8.2, 10, 12.9, 14.6]
    : Array.from({ length: 17 * 30 }, (_, i) => i / 30);
  const t0 = Date.now();
  for (let i = 0; i < times.length; i++) {
    await p.evaluate(t => window.renderAt(t), times[i]);
    await p.screenshot({ path: `${outDir}/${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 92 });
    if (i % 30 === 0) console.log(`frame ${i}/${times.length} ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  }
  await b.close();
})();
