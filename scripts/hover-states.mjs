// Regression check for stuck hover states (peek card, custom cursor, magnetic
// buttons) when the page scrolls under a still pointer. Needs a running site
// and the installed Chrome: `npm run build && npm start`, then
//   node scripts/hover-states.mjs http://localhost:3000
// Exits 1 on any failure.
import puppeteer from "puppeteer-core";

const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "") + "/";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (let i = 0; i < 60; i++) {
  try {
    if ((await fetch(BASE)).ok) break;
  } catch {}
  await sleep(1000);
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--disable-gpu", "--hide-scrollbars"] });
const results = [];
const check = (name, ok, detail) => {
  results.push(ok);
  console.log(ok ? "PASS" : "FAIL", name, JSON.stringify(detail));
};

// ---- desktop (mouse) ----
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(BASE, { waitUntil: "networkidle2" });
  await page.waitForFunction(() => !document.getElementById("preloader"), { timeout: 20000 });
  await sleep(2000);

  const state = () =>
    page.evaluate(() => {
      const peek = document.getElementById("peek");
      const r = peek.getBoundingClientRect();
      const cur = document.getElementById("cursor");
      const mag = document.querySelector(".play");
      const t = mag ? getComputedStyle(mag).transform : "none";
      const m = t.match(/matrix\(([^)]+)\)/);
      const p = m ? m[1].split(",").map(Number) : [1, 0, 0, 1, 0, 0];
      return {
        peekOpacity: getComputedStyle(peek).opacity,
        peekInViewport: r.bottom > 0 && r.top < innerHeight && getComputedStyle(peek).opacity !== "0",
        cursorState: cur?.dataset.state ?? null,
        magOffset: [Math.round(p[4]), Math.round(p[5])],
        scrollY: Math.round(scrollY),
      };
    });
  const hoverRow = async (i) => {
    await page.evaluate(() => window.scrollTo(0, document.getElementById("more").offsetTop - 30));
    await sleep(1200);
    const box = await page.evaluate((i) => {
      const r = document.querySelectorAll(".row a")[i].getBoundingClientRect();
      return { x: r.left + 80, y: r.top + r.height / 2 };
    }, i);
    await page.mouse.move(box.x, box.y, { steps: 4 });
    await sleep(700);
    return box;
  };
  const hoverFirstRow = () => hoverRow(0);
  // Where the card is, relative to the pointer and to the section that clips it.
  const placement = (pt) =>
    page.evaluate((pt) => {
      const peek = document.getElementById("peek").getBoundingClientRect();
      const sec = document.getElementById("more").getBoundingClientRect();
      const inside = peek.left >= sec.left - 1 && peek.top >= sec.top - 1 && peek.right <= sec.right + 1 && peek.bottom <= sec.bottom + 1;
      const dist = Math.round(Math.hypot(peek.left + peek.width / 2 - pt.x, peek.top + peek.height / 2 - pt.y));
      return { inside, dist, peek: [peek.left, peek.top, peek.width, peek.height].map(Math.round), pointer: [Math.round(pt.x), Math.round(pt.y)] };
    }, pt);
  const anchor = async (href) => {
    await page.evaluate((h) => document.querySelector(`.nav-links a[href="${h}"]`).click(), href);
    await sleep(2200);
  };

  let pointer = await hoverFirstRow();
  let s = await state();
  let pl = await placement(pointer);
  check("card visible while hovering a row", s.peekOpacity === "1", s);
  check("card sits next to the pointer, inside the section", pl.inside && pl.dist < 330, pl);

  // Leave the list, then hover the last row (next to the section's bottom edge)
  // and move: the card must follow the pointer again and stay inside the section.
  await page.mouse.move(pointer.x, 5, { steps: 4 });
  await sleep(500);
  pointer = await hoverRow(4);
  pointer = { x: pointer.x + 40, y: pointer.y + 4 };
  await page.mouse.move(pointer.x, pointer.y, { steps: 4 });
  await sleep(800);
  pl = await placement(pointer);
  s = await state();
  check("card follows the pointer on a second hover, still inside the section", s.peekOpacity === "1" && pl.inside && pl.dist < 330, { ...pl, opacity: s.peekOpacity });

  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(1200);
  s = await state();
  check("card hidden after scrollTo(0), pointer still", !s.peekInViewport, s);

  await hoverFirstRow();
  await page.mouse.wheel({ deltaY: -6000 });
  await sleep(2500);
  s = await state();
  check("card hidden after wheel scroll to top", !s.peekInViewport, s);

  await hoverFirstRow();
  await anchor("#contact");
  s = await state();
  check("card hidden after Lenis anchor scroll to #contact", !s.peekInViewport, s);

  await hoverFirstRow();
  await anchor("#work");
  s = await state();
  check("card hidden after Lenis anchor scroll to #work (list above viewport)", !s.peekInViewport, s);

  await hoverFirstRow();
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await sleep(600);
  s = await state();
  check("card hidden on window blur", !s.peekInViewport, s);

  // cursor stuck on "view" after a Lenis scroll?
  await hoverFirstRow();
  s = await state();
  const before = s.cursorState;
  await anchor("#contact");
  s = await state();
  check(`cursor state reset after Lenis scroll (was "${before}")`, !s.cursorState, s);

  // magnetic play button stuck displaced after a Lenis scroll?
  await anchor("#music");
  const pb = await page.evaluate(() => {
    const r = document.querySelector(".play").getBoundingClientRect();
    return { x: r.left + r.width * 0.8, y: r.top + r.height * 0.8 };
  });
  await page.mouse.move(pb.x, pb.y, { steps: 4 });
  await sleep(600);
  const during = await state();
  await anchor("#work");
  s = await state();
  check(`magnetic button at rest after Lenis scroll (offset during hover ${during.magOffset})`, s.magOffset[0] === 0 && s.magOffset[1] === 0, s);

  // the card can never sit outside its section
  const clipped = await page.evaluate(() => getComputedStyle(document.getElementById("more")).overflow.includes("clip") && getComputedStyle(document.getElementById("peek")).position === "absolute");
  check("card is positioned inside a clipped section", clipped, { clipped });
  await page.close();
}

// ---- touch: a tap must not show the card ----
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  await page.goto(BASE, { waitUntil: "networkidle2" });
  await page.waitForFunction(() => !document.getElementById("preloader"), { timeout: 20000 });
  await sleep(1500);
  await page.evaluate(() => window.scrollTo(0, document.getElementById("more").offsetTop - 30));
  await sleep(1000);
  const box = await page.evaluate(() => {
    const r = document.querySelectorAll(".row")[4].getBoundingClientRect();
    return { x: r.left + 40, y: r.top + r.height / 2 };
  });
  await page.touchscreen.touchStart(box.x, box.y);
  await page.touchscreen.touchEnd();
  await sleep(800);
  const op = await page.evaluate(() => getComputedStyle(document.getElementById("peek")).opacity);
  check("touch tap never shows the card", op === "0", { op });
  await page.close();
}

await browser.close();
const failed = results.filter((ok) => !ok).length;
console.log(failed ? `${failed} FAIL` : "ALL PASS");
process.exit(failed ? 1 : 0);
