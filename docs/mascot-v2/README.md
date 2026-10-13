# Mascot v2 · redrawn, gaze only

Captures of production (https://benjaminabensur.com) at 1440 × 900 unless noted, taken
headless on 14 October 2026. "Before" is commit 250e1f8 (the hand-drawn ink bust, which
reacted to a click), "after" is commit 6f0976c.

| File | What it shows |
|---|---|
| `before-desk-hero.png`, `after-desk-hero.png` | the hero: same place, same size (112 px), new drawing |
| `before-desk-name.png`, `after-desk-name.png` | the name block at 1440 px |
| `after-lap-name.png`, `after-narrow-name.png` | the name block at 1024 and 830 px (80 and 65 px mascot) |
| `gazes-before-after.png` | the mascot at 2×: at rest, then pointer left, down-left, down, up-left. Top row before, bottom row after |
| `hair-cut-down-row.png` | cells of the new sheet enlarged: `left` (hair drawn whole), then `down-left`, `down`, `down-right`, where the top of the hair is cut flat in the source drawing |

The phone hero (375 × 812) is pixel-identical before and after: no mascot is mounted there.

Known defect of the drawing, to fix by redrawing the bottom row of `characters/ben/directions.png`
with clear space above the hair, then rebuilding the sheet (no code change needed): the three
"down" gazes have the hair sliced flat, and with the mascot at the top right they are the
gazes shown for about 41 % of pointer positions on the first screen.
