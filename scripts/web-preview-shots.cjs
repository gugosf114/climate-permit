/* Serve dist-preview + walk every screen with headless Chrome, both themes. */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/georg/Documents/GitHub/mcp-unified-automation/node_modules/playwright-core');

const ROOT = 'C:/Users/georg/Documents/GitHub/climate-permit/dist-preview';
const OUT = 'C:/Users/georg/Documents/GitHub/climate-permit/preview-shots';
const PORT = 8642;

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.ico': 'image/x-icon', '.json': 'application/json', '.ttf': 'font/ttf', '.woff2': 'font/woff2' };

function serve() {
  return new Promise((res) => {
    const srv = http.createServer((req, rsp) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p === '/') p = '/index.html';
      let file = path.join(ROOT, p);
      if (!fs.existsSync(file) && fs.existsSync(file + '.html')) file = file + '.html';
      if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(ROOT, 'index.html');
      rsp.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
      fs.createReadStream(file).pipe(rsp);
    });
    srv.listen(PORT, '127.0.0.1', () => res(srv));
  });
}

async function knobRects(page) {
  // The knob discs are the only 122px circles; the A/C+Recirc buttons the only 58px ones.
  return page.evaluate(() => {
    const out = { knobs: [], circles: [] };
    for (const el of document.querySelectorAll('div')) {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      if (cs.width === '122px' && cs.borderRadius === '61px') out.knobs.push({ x: r.x, y: r.y, w: r.width, h: r.height });
      if (cs.width === '58px' && cs.borderRadius === '29px') out.circles.push({ x: r.x, y: r.y, w: r.width, h: r.height });
    }
    // de-dup overlapping rects (disc + hit area share the same box)
    const dedup = (arr) => arr.filter((a, i) => arr.findIndex((b) => Math.abs(b.x - a.x) < 4 && Math.abs(b.y - a.y) < 4) === i);
    out.knobs = dedup(out.knobs); out.circles = dedup(out.circles);
    return out;
  });
}

async function clickAt(page, rect, dx, dy) {
  await page.evaluate(([x, y]) => window.scrollBy(0, 0) || undefined, [0, 0]);
  await page.mouse.click(rect.x + rect.w / 2 + dx, rect.y + rect.h / 2 + dy);
}

async function scrollCenter(page, rect) {
  await page.evaluate(([y]) => window.scrollTo({ top: window.scrollY + y - window.innerHeight / 2 }), [rect.y]);
  await page.waitForTimeout(300);
}

async function clickText(page, text, nth = 0) {
  const loc = page.locator(`text="${text}"`).nth(nth);
  await loc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  await loc.click({ force: true });
}

async function answerDashboard(page, tag) {
  await page.waitForTimeout(1200);
  // knobs in DOM order: driver temp, [passenger temp], fan, vent
  let k = await knobRects(page);
  const dual = k.knobs.length === 4;
  const kn = async (idx, dx, dy) => {
    let r = (await knobRects(page)).knobs[idx];
    await scrollCenter(page, r);
    r = (await knobRects(page)).knobs[idx];
    await page.mouse.click(r.x + r.w / 2 + dx, r.y + r.h / 2 + dy);
    await page.waitForTimeout(250);
  };
  await kn(0, 0, -30);                    // driver temp -> 70
  if (dual) {
    try { await clickText(page, 'SAME AS DRIVER'); } catch (e) { await kn(1, 0, -30); }
  }
  await kn(dual ? 2 : 1, 30, 0);          // fan -> auto (rightmost)
  await kn(dual ? 3 : 2, -30, 0);         // vent -> face (leftmost)
  // A/C + recirc circle buttons -> tap once each (= on)
  let c = (await knobRects(page)).circles;
  for (let i = 0; i < c.length; i++) {
    let cc = (await knobRects(page)).circles[i];
    await scrollCenter(page, cc);
    cc = (await knobRects(page)).circles[i];
    await page.mouse.click(cc.x + cc.w / 2, cc.y + cc.h / 2);
    await page.waitForTimeout(250);
  }
  await clickText(page, 'Auto');          // climate mode
  await clickText(page, 'Open');          // rear vents
  await clickText(page, 'Always', 0);     // heated seats
  await clickText(page, 'Always', 1);     // pre-cool
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/${tag}-dashboard-filled.png`, fullPage: true });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const srv = await serve();
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  });
  const page = await browser.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2 });
  page.on('pageerror', (e) => console.log('PAGEERROR:', String(e).slice(0, 200)));

  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${OUT}/01-landing-light.png`, fullPage: true });

  await clickText(page, '☾ NIGHT SERVICE');
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/02-landing-dark.png`, fullPage: true });
  await clickText(page, '☀ DAY WINDOW');
  await page.waitForTimeout(400);

  await clickText(page, 'Begin Application');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/03-carselect-makes.png`, fullPage: true });

  await clickText(page, '›', 0);          // first make
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/04-carselect-models.png`, fullPage: true });
  await clickText(page, '›', 0);          // first model
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/05-dashboard-top.png` });

  await answerDashboard(page, '06-light');
  await clickText(page, 'Submit Configuration');
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `${OUT}/07-result-light.png`, fullPage: true });

  // Night Service round trip
  await clickText(page, 'Start Over');
  await page.waitForTimeout(900);
  await clickText(page, '☾ NIGHT SERVICE');
  await page.waitForTimeout(400);
  await clickText(page, 'Begin Application');
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/08-carselect-dark.png`, fullPage: true });
  await clickText(page, '›', 0);
  await page.waitForTimeout(700);
  await clickText(page, '›', 0);
  await page.waitForTimeout(1000);
  await answerDashboard(page, '09-dark');
  await clickText(page, 'Submit Configuration');
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `${OUT}/10-result-dark.png`, fullPage: true });

  await browser.close();
  srv.close();
  console.log('DONE', fs.readdirSync(OUT).join(', '));
})().catch((e) => { console.error('FAIL', e); process.exit(1); });
