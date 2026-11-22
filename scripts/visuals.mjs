// Checks for both pages of the site against a running server, with captures of each part:
//   npm run build && npm start, then
//   node scripts/visuals.mjs http://localhost:3000 [captures-dir] [prefix]
// Home: portrait, case studies in the CV's order, every figure loaded and numbered in
// order, the matrices, no photo or music left, the way to the off-hours page.
// Off hours: no preloader, city bands, the photo viewer, the music player.
// Between them: client-side navigation both ways, and the old #photo / #music anchors.
// Exits 1 on any failure.
import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { cities } from "../content/photos.ts";

const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const OUT = process.argv[3];
const PREFIX = process.argv[4] || "after";
const CASES = ["rechor", "kairo", "cortex", "addiction", "icoop"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
if (OUT) await mkdir(OUT, { recursive: true });
for (let i = 0; i < 60; i++) {
  try {
    if ((await fetch(BASE + "/")).ok) break;
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

/** A page with error tracking and a running layout-shift total. */
async function open(view) {
  const page = await browser.newPage();
  await page.setViewport(view.viewport);
  if (view.reduced) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  const errors = [];
  // Off Vercel the analytics script is a 404 that nosniff then refuses to run.
  page.on("console", (m) => m.type() === "error" && !/Failed to load resource|_vercel\/insights/.test(m.text()) && errors.push(m.text().slice(0, 200)));
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message.slice(0, 200)));
  page.on("requestfailed", (r) => {
    // A media element aborts its own range requests; the analytics script only exists on Vercel.
    if (!/\.(mp3|mp4|webm)$/.test(r.url()) && !/_vercel\/insights/.test(r.url())) errors.push("failed: " + r.url().slice(-80));
  });
  page.on("response", (r) => {
    if (r.status() >= 400 && !/_vercel\/insights/.test(r.url())) errors.push(`${r.status()}: ${r.url().slice(-80)}`);
  });
  await page.evaluateOnNewDocument(() => {
    window.__cls = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  const shot = async (name) => OUT && page.screenshot({ path: path.join(OUT, `${PREFIX}-${view.key}-${name}.png`) });
  const to = async (y) => {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await sleep(1600);
  };
  const top = (sel, offset = 80) => page.evaluate((s, o) => Math.round(document.querySelector(s).getBoundingClientRect().top + scrollY - o), sel, offset);
  const press = async (sel) => {
    const r = await page.evaluate((s) => {
      const b = document.querySelector(s).getBoundingClientRect();
      return { x: b.left + b.width / 2, y: b.top + Math.min(b.height / 2, 200) };
    }, sel);
    if (view.viewport.hasTouch) await page.touchscreen.tap(r.x, r.y);
    else await page.mouse.click(r.x, r.y);
  };
  const whole = async () => {
    await to(await page.evaluate(() => document.documentElement.scrollHeight));
    return page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      innerW: innerWidth,
      height: document.documentElement.scrollHeight,
      cls: +window.__cls.toFixed(4),
    }));
  };
  return { page, errors, shot, to, top, press, whole };
}

for (const view of VIEWS) {
  // ================= home =================
  {
    const { page, errors, shot, to, top, whole } = await open(view);
    await page.goto(BASE + "/", { waitUntil: "networkidle2" });
    await page.waitForFunction(() => !document.getElementById("preloader"), { timeout: 20000 });
    await sleep(2500);

    const portrait = await page.evaluate(() => {
      const img = document.querySelector(".portrait img");
      const r = img.getBoundingClientRect();
      return { loaded: img.complete && img.naturalWidth > 0, w: Math.round(r.width), h: Math.round(r.height) };
    });
    check(`${view.key} home: portrait loaded, 4:5`, portrait.loaded && Math.abs(portrait.h / portrait.w - 1.25) < 0.02, portrait);
    await shot("hero");

    const layout = await page.evaluate(() => ({
      cases: [...document.querySelectorAll(".case")].map((c) => c.id.replace("case-", "")),
      figs: [...document.querySelectorAll(".fig-n")].map((n) => n.textContent.replace(/\D/g, "")),
      photo: !!document.getElementById("photo"),
      music: !!document.getElementById("music"),
      steps: document.querySelectorAll(".step").length,
      navOff: document.querySelector(".nav-aside")?.getAttribute("href"),
      footOff: document.querySelector(".foot-link")?.getAttribute("href"),
    }));
    check(`${view.key} home: case studies in the CV's order`, layout.cases.join() === CASES.join(), layout.cases);
    check(
      `${view.key} home: figures numbered 1..n in reading order`,
      layout.figs.length > 0 && layout.figs.every((n, i) => +n === i + 1),
      layout.figs,
    );
    check(`${view.key} home: no photo or music section left`, !layout.photo && !layout.music, layout);
    check(`${view.key} home: the off-hours page is linked from the nav and the footer`, layout.navOff === "/off-hours" && layout.footOff === "/off-hours", layout);

    // Every figure, once on screen, has its image.
    for (const id of CASES) {
      const figs = await page.evaluate((id) => document.querySelectorAll(`#case-${id} .fig`).length, id);
      if (!figs) continue;
      await to(await top(`#case-${id} .figs`, 120));
      await shot(`fig-${id}`);
      for (let i = 0; i < figs; i++) {
        await page.evaluate((id, i) => document.querySelectorAll(`#case-${id} .fig`)[i].scrollIntoView({ block: "center" }), id, i);
        await sleep(500);
      }
      await sleep(800);
      const imgs = await page.evaluate(
        (id) => [...document.querySelectorAll(`#case-${id} .fig img`)].map((i) => ({ src: i.currentSrc.split("/").pop().slice(0, 60), ok: i.complete && i.naturalWidth > 0 })),
        id,
      );
      check(`${view.key} home: ${id}, every figure image loaded`, imgs.every((i) => i.ok), imgs.filter((i) => !i.ok));
    }

    await to(await top("#case-addiction .figs", 120));
    const mx = await page.evaluate(() => {
      const cells = [...document.querySelectorAll(".mx-t tbody td:not(.mx-r)")].map((td) => +td.textContent);
      const recalls = [...document.querySelectorAll(".mx-t tbody td.mx-r")].map((td) => td.textContent);
      return { total: cells.reduce((a, b) => a + b, 0), recalls, marked: document.querySelectorAll(".mx-t td.mark").length };
    });
    check(`${view.key} home: matrices hold 2 × 400 samples and the report's recalls`, mx.total === 800 && mx.recalls.join() === "0.95,0.70,0.00,0.92,0.66,0.69" && mx.marked === 2, mx);

    await to(await top("#journey", 60));
    await shot("journey");
    await to(await top("#contact", 60));
    await shot("contact");

    const p = await whole();
    check(`${view.key} home: no horizontal overflow`, p.scrollW <= view.viewport.width, p);
    check(`${view.key} home: layout shift under 0.05 over the whole scroll`, p.cls < 0.05, { cls: p.cls });
    check(`${view.key} home: no console error, no failed request`, errors.length === 0, errors.slice(0, 5));
    await page.close();
  }

  // ================= off hours =================
  {
    const { page, errors, shot, to, top, press, whole } = await open(view);
    await page.goto(BASE + "/off-hours", { waitUntil: "networkidle2" });
    const start = await page.evaluate(() => ({
      preloader: !!document.getElementById("preloader"),
      loading: document.documentElement.classList.contains("is-loading"),
      h1: document.querySelector("h1")?.getAttribute("aria-label"),
      current: document.querySelector(".nav-aside")?.getAttribute("aria-current"),
      skip: document.querySelector(".skip")?.getAttribute("href"),
    }));
    check(`${view.key} off: no preloader, scroll free, its own title, nav marks the page`, !start.preloader && !start.loading && start.h1 === "Off hours" && start.current === "page" && start.skip === "#photo", start);
    await sleep(2200);
    await shot("off-head");

    const first = `#city-${cities[0].id}`;
    await to(await top("#photo", 60));
    await sleep(600);
    await shot("photo");
    const before = await page.evaluate(() => ({
      bands: document.querySelectorAll(".city").length,
      rowImgs: document.querySelectorAll(".strip img").length,
    }));
    check(`${view.key} off: one band per listed city, rows not mounted before opening`, before.bands === cities.length && before.rowImgs === 0, { ...before, expected: cities.length });
    await to(await top(first, 70));
    await shot("band");
    await press(`${first} .city-cover`);
    await sleep(1800);
    await page.evaluate((f) => (window.__first = f), first);
    const opened = await page.evaluate(() => {
      const li = document.querySelector(window.__first);
      const row = li.querySelector(".city-row").getBoundingClientRect();
      const imgs = [...li.querySelectorAll(".strip img")];
      return {
        expanded: li.querySelector(".city-cover").getAttribute("aria-expanded"),
        rowHeight: Math.round(row.height),
        photos: imgs.length,
        announced: parseInt(li.querySelector(".city-top span:last-child").textContent, 10),
      };
    });
    check(`${view.key} off: a band opens on its row`, opened.expanded === "true" && opened.rowHeight > 100 && opened.photos === opened.announced, opened);
    await shot("band-open");

    await press(`${first} .strip li:nth-child(2) a`);
    await page.waitForFunction(() => {
      const img = document.querySelector(".lb .lb-full img");
      return !!img && img.complete && img.naturalWidth > 0;
    }, { timeout: 6000 }).catch(() => {});
    await sleep(700);
    const lb = await page.evaluate(() => {
      const d = document.querySelector(".lb");
      const img = d.querySelector(".lb-full img");
      return {
        open: d.open,
        count: d.querySelector(".lb-count").textContent.replace(/\s+/g, " ").trim(),
        loaded: !!img && img.complete && img.naturalWidth > 0 && /-(1200|2400)\.(avif|jpg)$/.test(img.currentSrc),
        focusInside: d.contains(document.activeElement),
        paused: document.documentElement.classList.contains("lb-open"),
        lenisStopped: document.documentElement.classList.contains("lenis-stopped"),
      };
    });
    check(`${view.key} off: the viewer opens on the clicked photo, large version loaded, focus inside, page paused`, lb.open && lb.count.startsWith("No. 02") && lb.loaded && lb.focusInside && lb.paused && (view.reduced || lb.lenisStopped), lb);
    await shot("viewer");
    await page.keyboard.press("ArrowRight");
    await sleep(900);
    const next = await page.evaluate(() => document.querySelector(".lb-count").textContent.replace(/\s+/g, " ").trim());
    check(`${view.key} off: arrow key moves to the next photo`, next.startsWith("No. 03"), { next });
    await page.keyboard.press("Escape");
    await sleep(900);
    const closed = await page.evaluate(() => ({
      open: document.querySelector(".lb").open,
      paused: document.documentElement.classList.contains("lb-open"),
      focus: document.activeElement?.closest(".strip li")?.dataset.stem ?? document.activeElement?.tagName,
    }));
    check(`${view.key} off: Escape closes it and gives focus back to the row`, !closed.open && !closed.paused && closed.focus && closed.focus !== "BODY", closed);
    await press(`${first} .city-cover`);
    await sleep(1200);
    const shut = await page.evaluate((f) => Math.round(document.querySelector(`${f} .city-row`).getBoundingClientRect().height), first);
    check(`${view.key} off: and closes again`, shut === 0, { shut });

    // ---- the music player ----
    await to(await top("#music", 60));
    await shot("music");
    await press("#music .play");
    await sleep(1800);
    const playing = await page.evaluate(() => {
      const a = document.querySelector("#music audio");
      return { paused: a.paused, t: +a.currentTime.toFixed(1), label: document.querySelector("#music .play").getAttribute("aria-label") };
    });
    check(`${view.key} off: Play starts the excerpt`, !playing.paused && playing.t > 0 && playing.label === "Pause", playing);
    await press("#music .play");
    await sleep(400);
    const stopped = await page.evaluate(() => document.querySelector("#music audio").paused);
    check(`${view.key} off: and Pause stops it`, stopped, { stopped });

    const p = await whole();
    await shot("off-end");
    check(`${view.key} off: no horizontal overflow`, p.scrollW <= view.viewport.width, p);
    check(`${view.key} off: layout shift under 0.05 over the whole scroll`, p.cls < 0.05, { cls: p.cls });
    const served = await page.evaluate(() => [...new Set([...document.documentElement.outerHTML.matchAll(/\/photos\/([a-z-]+)\//g)].map((m) => m[1]))]);
    const listed = cities.map((c) => c.id);
    check(`${view.key} off: only listed bands are referenced`, served.every((id) => listed.includes(id)), { served });
    check(`${view.key} off: no console error, no failed request`, errors.length === 0, errors.slice(0, 5));
    await page.close();
  }

  // ================= between the pages =================
  {
    const { page, errors, press } = await open(view);
    await page.goto(BASE + "/", { waitUntil: "networkidle2" });
    await page.waitForFunction(() => !document.getElementById("preloader"), { timeout: 20000 });
    await sleep(1500);
    await page.evaluate(() => window.scrollTo(0, 2400));
    await sleep(800);
    await press(".nav-aside");
    await page.waitForFunction(() => location.pathname === "/off-hours", { timeout: 8000 }).catch(() => {});
    await sleep(1500);
    const there = await page.evaluate(() => ({
      path: location.pathname,
      y: Math.round(scrollY),
      head: Math.round(document.querySelector(".off-hero")?.getBoundingClientRect().top ?? -1),
      preloader: !!document.getElementById("preloader"),
      title: document.title,
    }));
    check(`${view.key} nav: Off hours opens the page at its top, without a preloader`, there.path === "/off-hours" && there.y < 5 && !there.preloader && /Off hours/.test(there.title), there);

    await press('.nav-links a[href="/#work"]');
    await page.waitForFunction(() => location.pathname === "/", { timeout: 8000 }).catch(() => {});
    await sleep(2000);
    const back = await page.evaluate((reduced) => ({
      path: location.pathname + location.hash,
      work: Math.round(document.getElementById("work")?.getBoundingClientRect().top ?? -999),
      // Where the same link lands on the home page itself: Lenis adds the scroll padding to
      // the nav's 60 px; with reduced motion there is no Lenis and the browser uses the padding.
      expected: Math.round(parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) + (reduced ? 0 : 60)),
      preloader: !!document.getElementById("preloader"),
      loading: document.documentElement.classList.contains("is-loading"),
      name: getComputedStyle(document.querySelector(".hero-name .line-in")).transform,
    }), !!view.reduced);
    check(`${view.key} nav: Work from there lands where it lands on the home page, no preloader, scroll free`, back.path === "/#work" && Math.abs(back.work - back.expected) <= 6 && !back.preloader && !back.loading, back);
    check(`${view.key} nav: no console error on the way`, errors.length === 0, errors.slice(0, 5));
    await page.close();
  }
}

// ================= the narrowest phone =================
// A mobile viewport widens itself to fit what overflows, so compare with the width asked for.
for (const path of ["/", "/off-hours"]) {
  const { page } = await open({ key: "320", viewport: { width: 320, height: 640, deviceScaleFactor: 1, isMobile: true, hasTouch: true }, reduced: true });
  await page.goto(BASE + path, { waitUntil: "networkidle2" });
  await sleep(800);
  const fit = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    nav: Math.round(document.querySelector(".nav-aside").getBoundingClientRect().right),
  }));
  check(`320 ${path}: nothing wider than the screen, the whole nav on it`, fit.scrollW <= 320 && fit.nav <= 320, fit);
  await page.close();
}

// ================= the old anchors =================
{
  const { page } = await open(VIEWS[0]);
  await page.goto(BASE + "/#music", { waitUntil: "networkidle2" });
  await page.waitForFunction(() => location.pathname === "/off-hours", { timeout: 8000 }).catch(() => {});
  const moved = await page.evaluate(() => location.pathname + location.hash);
  check("old /#music now leads to /off-hours#music", moved === "/off-hours#music", { moved });
  await page.close();
}

await browser.close();
const failed = results.filter((ok) => !ok).length;
console.log(failed ? `${failed} FAIL` : "ALL PASS");
process.exit(failed ? 1 : 0);
