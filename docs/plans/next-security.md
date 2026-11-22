# Plan — Next 16.4.6, npm audit fix, en-têtes de sécurité (22/11/2026)

Brief : `BRIEF-next-security.md` (go de Ben via Cowork). Audit de départ : `PRELAUNCH-AUDIT-2026-11-22.md` (🟠 1 et 2).

## Objectif
Fermer les deux 🟠 de l'audit prelaunch du 22/11 sans toucher au contenu ni au design.

## État de départ (mesuré)
- `next` 16.3.6 (`eslint-config-next` absent du projet : rien à monter).
- `npm audit --omit=dev` : 1 critical (next 16.0.0–16.4.4), 2 high (sharp < 0.35.5, source-map-js ≤ 1.2.1).
- Prod (`curl -sI https://benjaminabensur.com/`) : `strict-transport-security: max-age=63072000` seul (posé par Vercel).

## Étapes
1. `next@16.4.6` + `npm audit fix` (sans `--force`), build, typecheck. Commit 1.
2. `headers()` dans `next.config.ts` : CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy,
   X-Frame-Options + `frame-ancestors`, HSTS, COOP. Vérifier sur le build de prod local : 0 violation CSP,
   0 erreur console sur `/` et `/off-hours` (3 vues). Commit 2.
3. `npm run test:e2e` + `npm run test:visuals` sur le build local, Lighthouse mobile ≥ 90 sur `/` et `/off-hours`
   (plusieurs runs, la machine est bruitée).
4. Revue du diff (`mp-code-review`), push `main`, attente du déploiement Vercel.
5. Prod : `curl -I` (en-têtes présents), 0 erreur console / 0 violation CSP (puppeteer, Analytics compris),
   `test:visuals` sur le domaine, `npm audit --omit=dev` sans critical/high.
6. Addendum à l'audit prelaunch, vault (📍 Portfolio), mémoire, reply à Cowork.

## Critère de fin
Prod sur 16.4.6 avec les en-têtes, `npm audit` sans critical/high, 0 erreur console/CSP en prod,
tests verts, Lighthouse mobile ≥ 90 sur les deux pages.

## Avancement
- [x] 1 — 52352f6. `npm audit --omit=dev` : 0. Reste 9 high **dev-only** (puppeteer-core 23 → chromium-bidi,
  extract-zip, basic-ftp, zod) : correctif = puppeteer-core 25 (majeur), non forcé.
- [x] 2 — d0b6bbb (en-têtes) + fde9432 (`visuals.mjs` ignore aussi la ligne console « Refused to execute
  /_vercel/insights/script.js » : hors Vercel ce script est un 404 que `nosniff` refuse d'exécuter).
  Build local : 0 violation CSP, 0 erreur console (hors ce 404 local) sur `/` et `/off-hours`, desktop + mobile ;
  `next dev` : 0 violation. `upgrade-insecure-requests` omis exprès (HSTS + URLs relatives ; casserait http://localhost).
  `next dev` 16.4 génère un `AGENTS.md` : exclu via `.git/info/exclude`.
- [x] 3 — local : `test:e2e` + `test:visuals` ALL PASS ; Lighthouse mobile `/` 89–98, `/off-hours` 89–100
  (BP 96 en local = 404 Analytics local uniquement).
- [x] 4 — `mp-code-review` : Standards 0 violation (2 remarques de jugement mineures, non retenues) ;
  Spec 0 défaut (COOP et `includeSubDomains` notés comme ajouts sûrs). Push `main` → Vercel success.
- [x] 5 — prod : en-têtes sur `/`, `/off-hours`, `/robots.txt`, **un seul** HSTS (le nôtre) ; puppeteer
  desktop + mobile : 0 violation CSP, 0 erreur/avertissement console, 0 requête en échec, Analytics script + beacon 200 ;
  `test:e2e` + `test:visuals` ALL PASS sur le domaine ; Lighthouse mobile prod `/` 96–98, `/off-hours` 100, BP 100.
- [x] 6 — addendum dans `PRELAUNCH-AUDIT-2026-11-22.md` (verdict : prêt), vault, mémoire, reply Cowork.

**Terminé le 22/11/2026.**
