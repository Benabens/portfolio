// Checks for the v3 visuals (portrait, case-study figures, city bands) against a
// running site, and captures of each section:
//   npm run build && npm start, then
//   node scripts/visuals.mjs http://localhost:3000 [captures-dir] [prefix]
// Exits 1 on any failure.
import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "") + "/";
const OUT = process.argv[3];
const PREFIX = process.argv[4] || "after";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
if (OUT) await mkdir(OUT, { recursive: true });
for (let i = 0; i < 60; i++) {
  try {
    if ((await fetch(BASE)).ok) break;
  } catch {}
  await sleep(1000);
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars", "--autoplay-policy=no-user-gesture-required"],
});
const results = [];
const check = (name, ok, detail) => {
  results.push(ok);
  console.log(ok ? "PASS" : "FAIL", name, detail === undefined ? "" : JSON.stringify(detail));
};

const VIEWS = [
  { key: "desk", viewport: { width: 1440, height: 900, deviceScaleFactor: 1 } },
  { key: "mob", viewport: { width: 375, height: 812, deviceScaleFactor: 1, isMobile: true, hasTouch: true } },
  { key: "desk-rm", viewport: { width: 1440, height: 900, deviceScaleFactor: 1 }, reduced: true },
];

for (const view of VIEWS) {
  const page = await browser.newPage();
  await page.setViewport(view.viewport);
  if (view.reduced) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 200)));
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message.slice(0, 200)));
  page.on("requestfailed", (r) => {
    // A paused clip aborts its own download: that is the intended behaviour.
    if (!/\.(mp4|webm)$/.test(r.url())) errors.push("failed: " + r.url().slice(-80));
  });
  await page.evaluateOnNewDocument(() => {
    window.__cls = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto(BASE, { waitUntil: "networkidle2" });
  await page.waitForFunction(() => !document.getElementById("preloader"), { timeout: 20000 });
  await sleep(2500);
  const shot = async (name) => OUT && page.screenshot({ path: path.join(OUT, `${PREFIX}-${view.key}-${name}.png`) });
  const to = async (y) => {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await sleep(1600);
  };
  const top = (sel, offset = 80) => page.evaluate((s, o) => Math.round(document.querySelector(s).getBoundingClientRect().top + scrollY - o), sel, offset);

  // ---- portrait ----
  const portrait = await page.evaluate(() => {
    const img = document.querySelector(".portrait img");
    const r = img.getBoundingClientRect();
    return { loaded: img.complete && img.naturalWidth > 0, w: Math.round(r.width), h: Math.round(r.height), natural: img.naturalWidth };
  });
  check(`${view.key}: portrait loaded, 4:5`, portrait.loaded && Math.abs(portrait.h / portrait.w - 1.25) < 0.02, portrait);
  await shot("hero");
  await to(await top(".portrait", 90));
  await shot("portrait");

  // ---- clips: nothing plays before it is on screen ----
  const clips = () =>
    page.evaluate(() => [...document.querySelectorAll("video")].map((v) => ({ paused: v.paused, t: +v.currentTime.toFixed(2), ready: v.readyState })));
  let c = await clips();
  const fetched = await page.evaluate(() => performance.getEntriesByType("resource").filter((r) => /\.(mp4|webm)$/.test(r.name)).length);
  check(`${view.key}: clips idle and not downloaded while off screen`, c.length === 2 && c.every((v) => v.paused && v.t === 0 && v.ready === 0) && fetched === 0, { clips: c, fetched });

  await to(await top("#work", 60));
  await shot("work");
  await to(await top("#case-kairo .figs", 120));
  await sleep(2200);
  c = await clips();
  if (view.reduced) check(`${view.key}: reduced motion, the clip stays on its poster`, c[0].paused && c[0].t === 0, c[0]);
  else check(`${view.key}: clip plays once on screen`, !c[0].paused && c[0].t > 0, c[0]);
  await shot("fig-kairo");

  if (!view.reduced) {
    // held by the visitor: stays paused while on screen
    await page.evaluate(() => document.querySelector("#case-kairo .fig-ctl").click());
    await sleep(500);
    c = await clips();
    const label = await page.evaluate(() => document.querySelector("#case-kairo .fig-ctl").textContent);
    check(`${view.key}: Pause holds the clip`, c[0].paused && label === "Play", { ...c[0], label });
    await page.evaluate(() => document.querySelector("#case-kairo .fig-ctl").click());
    await sleep(500);
  } else {
    await page.evaluate(() => document.querySelector("#case-kairo .fig-ctl").click());
    await sleep(1200);
    c = await clips();
    check(`${view.key}: reduced motion, Play starts it on request`, !c[0].paused, c[0]);
  }

  await to(await top("#case-cortex .figs", 120));
  await sleep(1800);
  c = await clips();
  if (!view.reduced) check(`${view.key}: first clip paused after leaving, second playing`, c[0].paused && !c[1].paused, c);
  await shot("fig-cortex");

  await to(await top("#case-addiction .figs", 120));
  const mx = await page.evaluate(() => {
    const cells = [...document.querySelectorAll(".mx-t tbody td:not(.mx-r)")].map((td) => +td.textContent);
    const recalls = [...document.querySelectorAll(".mx-t tbody td.mx-r")].map((td) => td.textContent);
    return { total: cells.reduce((a, b) => a + b, 0), recalls, marked: document.querySelectorAll(".mx-t td.mark").length };
  });
  check(`${view.key}: matrices hold 2 × 400 samples and the report's recalls`, mx.total === 800 && mx.recalls.join() === "0.95,0.70,0.00,0.92,0.66,0.69" && mx.marked === 2, mx);
  await shot("fig-matrices");

  // ---- city bands ----
  await to(await top("#photo", 60));
  await sleep(600);
  await shot("photo");
  const before = await page.evaluate(() => ({
    bands: document.querySelectorAll(".city").length,
    rowImgs: document.querySelectorAll(".strip img").length,
    covers: [...document.querySelectorAll(".city-img img")].slice(0, 2).map((i) => i.currentSrc.split("/").pop()),
  }));
  check(`${view.key}: nine bands, rows not mounted before opening`, before.bands === 9 && before.rowImgs === 0, before);
  await to(await top("#city-tel-aviv", 70));
  await shot("band");
  const press = async (sel) => {
    const r = await page.evaluate((s) => {
      const b = document.querySelector(s).getBoundingClientRect();
      return { x: b.left + b.width / 2, y: b.top + Math.min(b.height / 2, 200) };
    }, sel);
    if (view.viewport.hasTouch) await page.touchscreen.tap(r.x, r.y);
    else await page.mouse.click(r.x, r.y);
  };
  await press("#city-tel-aviv .city-cover");
  await sleep(1800);
  const open = await page.evaluate(() => {
    const li = document.querySelector("#city-tel-aviv");
    const row = li.querySelector(".city-row").getBoundingClientRect();
    const imgs = [...li.querySelectorAll(".strip img")];
    return {
      expanded: li.querySelector(".city-cover").getAttribute("aria-expanded"),
      rowHeight: Math.round(row.height),
      photos: imgs.length,
      loaded: imgs.filter((i) => i.complete && i.naturalWidth > 0).length,
      format: imgs[0]?.currentSrc.split(".").pop(),
    };
  });
  check(`${view.key}: a band opens on its row`, open.expanded === "true" && open.rowHeight > 100 && open.photos === 5, open);
  await shot("band-open");
  await press("#city-tel-aviv .city-cover");
  await sleep(1200);
  const closed = await page.evaluate(() => Math.round(document.querySelector("#city-tel-aviv .city-row").getBoundingClientRect().height));
  check(`${view.key}: and closes again`, closed === 0, { closed });

  // ---- whole page ----
  await to(await page.evaluate(() => document.documentElement.scrollHeight));
  const page_ = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    innerW: innerWidth,
    height: document.documentElement.scrollHeight,
    cls: +window.__cls.toFixed(4),
  }));
  check(`${view.key}: no horizontal overflow`, page_.scrollW <= page_.innerW, page_);
  check(`${view.key}: layout shift under 0.05 over the whole scroll`, page_.cls < 0.05, { cls: page_.cls });
  check(`${view.key}: no console error, no failed request`, errors.length === 0, errors.slice(0, 5));
  await page.close();
}

await browser.close();
const failed = results.filter((ok) => !ok).length;
console.log(failed ? `${failed} FAIL` : "ALL PASS");
process.exit(failed ? 1 : 0);
