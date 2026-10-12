"""Draws Ben's mascot sheets (directions + reactions) as SVG, by hand, in the page-mascot layout.
3x3 cells, 400 px each. Ink style matching the Releve site: black outline, paper white, navy blazer.
Run: python3 draw.py  -> directions.svg, reactions.svg (rasterised to PNG with alpha by render.mjs)."""
import math, random

INK = "#141414"; SKIN = "#f2d4bf"; SKIN_D = "#e3b89e"; HAIR = "#2a1c16"; HAIR_L = "#4a3226"
NAVY = "#1e2636"; NAVY_L = "#2c3750"; SHIRT = "#fbfaf6"; BLUSH = "#e79a8c"; RED = "#c43012"
GOLD = "#e8b120"; BLUE = "#3b6fb6"; IRIS = "#5a3a24"
SW = 4.2
CELL = 400

def curls(cx, cy, r_ring, a0, a1, n, rmin, rmax, seed, fill):
    rnd = random.Random(seed); out = []
    for i in range(n):
        a = math.radians(a0 + (a1 - a0) * i / (n - 1))
        r = rnd.uniform(rmin, rmax)
        rr = r_ring + rnd.uniform(-7, 7)
        x = cx + math.cos(a) * rr; y = cy + math.sin(a) * rr * 0.92
        out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.1f}" fill="{fill}" stroke="{INK}" stroke-width="{SW}"/>')
    return "".join(out)

def curl_marks(cx, cy, r_ring, a0, a1, n, seed):
    rnd = random.Random(seed + 7); out = []
    for i in range(n):
        a = math.radians(a0 + (a1 - a0) * (i + .5) / n)
        x = cx + math.cos(a) * r_ring; y = cy + math.sin(a) * r_ring * 0.9
        s = rnd.uniform(6, 9)
        out.append(f'<path d="M{x-s:.1f},{y:.1f} q{s:.1f},-{s:.1f} {s*2:.1f},0" fill="none" stroke="{HAIR_L}" stroke-width="2.6" stroke-linecap="round"/>')
    return "".join(out)

def body(ox, oy):
    x = ox + 200; b = oy + 338
    return (
        f'<path d="M{x-16},{oy+248} h32 v34 h-32Z" fill="{SKIN_D}" stroke="{INK}" stroke-width="{SW}"/>'
        f'<path d="M{x-64},{b} C{x-66},{oy+300} {x-52},{oy+278} {x-22},{oy+272} L{x+22},{oy+272} C{x+52},{oy+278} {x+66},{oy+300} {x+64},{b} Z" fill="{NAVY}" stroke="{INK}" stroke-width="{SW}" stroke-linejoin="round"/>'
        f'<path d="M{x-22},{oy+272} L{x},{oy+312} L{x+22},{oy+272} Z" fill="{SHIRT}" stroke="{INK}" stroke-width="3.4" stroke-linejoin="round"/>'
        f'<path d="M{x-22},{oy+272} L{x-8},{oy+296} L{x-30},{oy+290} Z M{x+22},{oy+272} L{x+8},{oy+296} L{x+30},{oy+290} Z" fill="{SHIRT}" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>'
        f'<path d="M{x-40},{oy+286} L{x-12},{b-4} M{x+40},{oy+286} L{x+12},{b-4}" stroke="{NAVY_L}" stroke-width="5" stroke-linecap="round"/>'
    )

def eye_open(x, y, rx, ry, px, py):
    return (f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="#fff" stroke="{INK}" stroke-width="3.2"/>'
            f'<circle cx="{x+px}" cy="{y+py}" r="{min(rx,ry)*0.62:.1f}" fill="{IRIS}"/>'
            f'<circle cx="{x+px}" cy="{y+py}" r="{min(rx,ry)*0.34:.1f}" fill="{INK}"/>'
            f'<circle cx="{x+px-2.5}" cy="{y+py-3}" r="2.4" fill="#fff"/>')

def arc_closed(x, y, w, up=True):
    d = -1 if up else 1
    return f'<path d="M{x-w},{y} Q{x},{y+d*w*1.1} {x+w},{y}" fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>'

def star(x, y, r, fill):
    pts = []
    for i in range(10):
        a = math.radians(-90 + i * 36); rr = r if i % 2 == 0 else r * 0.45
        pts.append(f"{x+math.cos(a)*rr:.1f},{y+math.sin(a)*rr:.1f}")
    return f'<polygon points="{" ".join(pts)}" fill="{fill}" stroke="{INK}" stroke-width="2.6" stroke-linejoin="round"/>'

def spiral(x, y):
    p = []
    for i in range(48):
        a = i * 0.42; r = 1 + i * 0.24
        p.append(f"{x+math.cos(a)*r:.1f},{y+math.sin(a)*r:.1f}")
    return f'<polyline points="{" ".join(p)}" fill="none" stroke="{INK}" stroke-width="2.8" stroke-linecap="round"/>'

def heart(x, y, s):
    return (f'<path d="M{x},{y+s*0.9} C{x-s*1.6},{y-s*0.2} {x-s*0.8},{y-s*1.3} {x},{y-s*0.45} '
            f'C{x+s*0.8},{y-s*1.3} {x+s*1.6},{y-s*0.2} {x},{y+s*0.9}Z" fill="{RED}" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>')

def zee(x, y, s):
    return f'<path d="M{x},{y} h{s} l-{s},{s} h{s}" fill="none" stroke="{BLUE}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>'

def head(ox, oy, dx=0, dy=0, face="calm"):
    cx = ox + 200 + dx * 7; cy = oy + 178 + dy * 6
    fx = dx * 34; fy = dy * (18 if dy < 0 else 11)
    hx = -dx * 6
    s = []
    s.append(curls(cx + hx, cy - 10, 92, 166, 374, 14, 21, 34, 1, HAIR))
    s.append(f'<ellipse cx="{cx+hx}" cy="{cy-34}" rx="96" ry="74" fill="{HAIR}"/>')
    for side in (-1, 1):
        if side == dx: continue
        ex = cx + side * 86 + dx * 18
        s.append(f'<ellipse cx="{ex}" cy="{cy+18+fy*0.3}" rx="13" ry="17" fill="{SKIN}" stroke="{INK}" stroke-width="{SW}"/>')
    s.append(f'<ellipse cx="{cx}" cy="{cy+8}" rx="84" ry="82" fill="{SKIN}" stroke="{INK}" stroke-width="{SW}"/>')
    s.append(curls(cx + fx * 0.4 - 8, cy - 22 + fy * 0.3, 72, 198, 330, 7, 17, 25, 3, HAIR))
    s.append(curls(cx + hx, cy - 4, 86, 176, 192, 2, 16, 20, 5, HAIR))
    s.append(curls(cx + hx, cy - 4, 86, 348, 364, 2, 16, 20, 6, HAIR))
    s.append(curl_marks(cx + fx * 0.35, cy - 22 + fy * 0.3, 74, 200, 340, 6, 3))
    ex0 = cx + fx; ey = cy + 26 + fy
    near = {-1: 1.0, 1: 1.0}
    if dx: near[dx] = 1.0; near[-dx] = 0.78
    sep = 31 - abs(dx) * 4
    L, R = ex0 - sep, ex0 + sep
    px, py = dx * 3.5, dy * 3
    blush = 0.55
    if face == "calm":
        s.append(eye_open(L, ey, 11 * near[-1], 12.5, px, py) + eye_open(R, ey, 11 * near[1], 12.5, px, py))
    elif face in ("closed", "heart", "sparkle", "blush", "grin"):
        s.append(arc_closed(L, ey + 2, 10) + arc_closed(R, ey + 2, 10))
    elif face == "sleep":
        s.append(arc_closed(L, ey, 10, up=False) + arc_closed(R, ey, 10, up=False))
    elif face == "wow":
        s.append(eye_open(L, ey, 14, 15, 0, 0) + eye_open(R, ey, 14, 15, 0, 0))
    elif face == "star":
        s.append(star(L, ey, 15, GOLD) + star(R, ey, 15, GOLD))
    elif face == "dizzy":
        s.append(spiral(L, ey) + spiral(R, ey))
    by = ey - 22 - (5 if face == "wow" else 0)
    for X in (L, R):
        s.append(f'<path d="M{X-12},{by+2} Q{X},{by-5} {X+12},{by+1}" fill="none" stroke="{HAIR}" stroke-width="6" stroke-linecap="round"/>')
    if face == "blush": blush = 0.95
    for X in (L - 10 + 16*max(-dx,0), R + 10 - 16*max(dx,0)):
        s.append(f'<ellipse cx="{X}" cy="{ey+22}" rx="13" ry="7" fill="{BLUSH}" opacity="{blush}"/>')
    nx = ex0 + dx * 6; ny = ey + 20
    s.append(f'<path d="M{nx-2},{ny-10} Q{nx+6+dx*3},{ny+2} {nx-3},{ny+5}" fill="none" stroke="{SKIN_D}" stroke-width="3.4" stroke-linecap="round"/>')
    mx = ex0 + dx * 4; my = ey + 40
    if face == "wow":
        s.append(f'<ellipse cx="{mx}" cy="{my+2}" rx="8" ry="10" fill="#7a2a22" stroke="{INK}" stroke-width="3"/>')
    elif face == "star":
        s.append(f'<path d="M{mx-17},{my-3} Q{mx},{my+20} {mx+17},{my-3} Z" fill="#7a2a22" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>')
    elif face == "grin":
        s.append(f'<path d="M{mx-20},{my-5} Q{mx},{my+26} {mx+20},{my-5} Z" fill="#7a2a22" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>'
                 f'<path d="M{mx-14},{my-1} Q{mx},{my+4} {mx+14},{my-1}" fill="#fff" stroke="none"/>')
    elif face == "dizzy":
        s.append(f'<path d="M{mx-16},{my} q4,-6 8,0 t8,0 t8,0 t8,0" fill="none" stroke="{INK}" stroke-width="3.2" stroke-linecap="round"/>')
    elif face == "sleep":
        s.append(f'<path d="M{mx-6},{my+1} Q{mx},{my+5} {mx+6},{my+1}" fill="none" stroke="{INK}" stroke-width="3.2" stroke-linecap="round"/>')
    else:
        s.append(f'<path d="M{mx-12},{my-2} Q{mx},{my+9} {mx+12},{my-2}" fill="none" stroke="{INK}" stroke-width="3.4" stroke-linecap="round"/>')
    if face == "heart":
        s.append(heart(ox + 300, oy + 66, 15))
    if face == "sparkle":
        s.append(star(ox + 290, oy + 62, 12, GOLD) + star(ox + 322, oy + 92, 8, GOLD) + star(ox + 102, oy + 70, 9, GOLD))
    if face == "sleep":
        s.append(zee(ox + 288, oy + 90, 12) + zee(ox + 308, oy + 66, 10) + zee(ox + 326, oy + 44, 8))
    return "".join(s)

def sheet(cells):
    parts = ['<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">']
    for i, (dx, dy, face) in enumerate(cells):
        ox, oy = (i % 3) * CELL, (i // 3) * CELL
        parts.append(f'<g>{body(ox, oy)}{head(ox, oy, dx, dy, face)}</g>')
    parts.append('</svg>')
    return "".join(parts)

directions = [(-1, -1, "calm"), (0, -1, "calm"), (1, -1, "calm"),
              (-1, 0, "calm"), (0, 0, "calm"), (1, 0, "calm"),
              (-1, 1, "calm"), (0, 1, "calm"), (1, 1, "calm")]
reactions = [(0, 0, f) for f in ("closed", "heart", "sparkle", "wow", "star", "blush", "sleep", "dizzy", "grin")]
open("directions.svg", "w").write(sheet(directions))
open("reactions.svg", "w").write(sheet(reactions))
print("ok")
