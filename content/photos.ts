import type { City } from "./types";

// Photo section: one band per city, the cover first, then the rest of the roll.
// All the photos of ~/Pictures/Portfolio are listed (Ben's decision, 30 September
// 2026), a band can be switched off with `hidden: true` (since 6 October only Mexico is
// on, as a reference for the feature); only the covers are chosen without an identifiable face in the
// foreground. A photo is referenced by its source stem "<CODE>-NN" from
// ~/Pictures/Portfolio/<CODE>/ (originals, not in the repo).
// 8 October 2026: only the photos Ben kept after grading are listed; the version he
// picked (Canon natural / cine / B&W, or the original) sits in ~/Pictures/Portfolio/_final/.
// Web versions: `npm run photos` (scripts/photos.mjs) writes public/photos/<id>/
// and content/photos.generated.ts. Re-run it once the originals are graded.

export const photoIntro = {
  label: "Photo",
  title: "By city, ",
  titleEmphasis: "selection in progress.",
  note: "Open a band to see the rest of the roll.",
};

const bands: City[] = [
  {
    id: "montreal",
    name: "Montréal",
    country: "Canada",
    year: "2026",
    cover: "MTL-01",
    coverFocus: "50% 35%",
    photos: ["MTL-02", "MTL-03"],
    alts: {
      "MTL-01": "Two office towers lit against a deep blue night sky",
      "MTL-02": "A downtown street between towers at dusk, street lamps on",
      "MTL-03": "A glass residential tower seen from below",
      "MTL-04": "Snow-covered firs under a chairlift",
      "MTL-05": "A school bus parked by a snowbank between office towers",
    },
  },
  {
    id: "tel-aviv",
    hidden: true, // Off (Ben, 6 October 2026): Tel Aviv stays off for now.
    name: "Tel Aviv",
    country: "Israel",
    year: "", // TODO Ben: confirmer l'année
    todo: "année",
    cover: "TLV-04",
    coverFocus: "50% 45%",
    photos: ["TLV-08", "TLV-07", "TLV-06", "TLV-05"],
    alts: {
      "TLV-04": "Palm trees and a street lamp against a stormy sunset over the sea",
      "TLV-08": "The sun going down behind clouds over the sea",
      "TLV-07": "A jetty and a small lighthouse at sunset",
      "TLV-06": "A marina seen from above, the sea glittering behind it",
      "TLV-05": "The beach and its palm trees under a wide blue sky",
      "TLV-02": "A DJ booth seen from behind, a fist raised over the decks",
      "TLV-01": "A crowd in front of a stage decorated with a giant mask, at night",
      "TLV-03": "A DJ booth with a laptop and decks, smoke and blue light over the crowd",
    },
  },
  {
    id: "ibiza",
    name: "Ibiza",
    country: "Spain",
    year: "2024 – 2025",
    cover: "IBZ2-04",
    coverFocus: "50% 42%",
    // IBZ and IBZ2 are the same island, two summers.
    photos: [],
    alts: {
      "IBZ-01": "The Ibiza letters and two giant red cherries on a paved square",
      "IBZ-04": "A pool at dusk",
      "IBZ-06": "The entrance of Pacha at night",
      "IBZ2-02": "The Ibiza letters, planted with greenery, along a road",
      "IBZ2-03": "The Ushuaïa stage and its crowd at sunset",
      "IBZ2-04": "The Ushuaïa stage at night, flames on both sides",
      "IBZ-02": "Two men greeting each other in front of a stage lit in red",
      "IBZ-03": "Fireworks over the Ushuaïa stage, phones raised in the crowd",
      "IBZ-05": "Bottles in hexagonal shelves above a bucket of champagne",
      "IBZ2-01": "A laptop running a music session on an aeroplane tray table",
    },
  },
  {
    id: "mexico",
    name: "Mexico",
    country: "Mexico",
    year: "2025",
    cover: "MX2-04",
    coverFocus: "50% 40%",
    photos: ["MX2-01", "MX2-02", "MX2-03", "MX2-05", "MX2-06"],
    alts: {
      "MX2-04": "Palm trees over a beach lounge",
      "MX2-01": "A sand path between palm trees",
      "MX2-02": "A red path through a garden of palms and thatched roofs",
      "MX2-03": "Thatched-roof houses over a lawn",
      "MX2-05": "A white wall of carved shelves",
      "MX2-06": "A bar with black and white tiles under a wooden pergola",
    },
  },
  {
    id: "mykonos",
    name: "Mykonos",
    country: "Greece",
    year: "2025",
    cover: "MYK-03",
    coverFocus: "50% 40%",
    coverTone: "light",
    photos: ["MYK-01", "MYK-02"],
    alts: {
      "MYK-03": "A whitewashed alley with blue balconies and laundry",
      "MYK-01": "A white house with blue doors and stairs",
      "MYK-02": "A terrace with a pool above the sea",
    },
  },
  {
    id: "tarifa-tangier",
    name: "Tarifa – Tangier",
    country: "Spain – Morocco",
    year: "2025",
    cover: "TRF-TGR-04",
    coverFocus: "50% 55%",
    photos: ["TRF-TGR-01"],
    alts: {
      "TRF-TGR-04": "Two kites over the sea at sunset",
      "TRF-TGR-01": "Waves under an orange sky",
      "TRF-TGR-02": "A white mosque and its minaret under a blue sky",
      "TRF-TGR-03": "A rounded white building on a busy street",
    },
  },
  {
    id: "marbella",
    name: "Marbella",
    country: "Spain",
    year: "2024",
    cover: "MRB-02",
    coverFocus: "50% 62%",
    photos: [],
    alts: {
      "MRB-04": "The bow of a jet ski on open sea",
      "MRB-06": "A shoreline at dusk",
      "MRB-01": "A beach restaurant under a reed roof",
      "MRB-02": "A fringed parasol over a table facing the sea",
      "MRB-05": "A restaurant at night under woven lanterns",
      "MRB-03": "A packed club, people dancing under red lights",
    },
  },
  {
    id: "ski",
    name: "Ski",
    country: "",
    year: "",
    cover: "SKI-01",
    coverFocus: "50% 70%",
    photos: ["SKI-02"],
    alts: {
      "SKI-01": "A snowy forest under a grey sky",
      "SKI-02": "A snow-covered peak under a blue sky",
    },
  },
  {
    // CLOUD and LOVE are Ben's own story highlights, mixes rather than places
    // (concerts, Paris, Milan, Lausanne…): each gets its band, under its own name.
    id: "cloud",
    name: "Cloud",
    country: "",
    year: "",
    cover: "CLOUD-01",
    coverFocus: "50% 55%",
    photos: ["CLOUD-02", "CLOUD-03", "CLOUD-05", "CLOUD-06", "CLOUD-08", "CLOUD-09", "CLOUD-11", "CLOUD-12", "CLOUD-13", "CLOUD-15"],
    alts: {
      "CLOUD-01": "A pianist on stage under a fan of light beams",
      "CLOUD-03": "A concert hall under a rectangle of blue neon",
      "CLOUD-04": "A club crowd seen from the back",
      "CLOUD-11": "Soap bubbles and light beams in the trees",
      "CLOUD-02": "A saxophonist in silhouette inside a beam of light",
      "CLOUD-05": "The glass roof of the Galleria Vittorio Emanuele II in Milan",
      "CLOUD-06": "A cloud-shaped light sculpture above a DJ booth",
      "CLOUD-07": "A café bar under a green and white striped awning",
      "CLOUD-08": "The Arc de Triomphe seen from below",
      "CLOUD-09": "An Ariane rocket standing next to an Air France aeroplane",
      "CLOUD-10": "A DJ in blue light, arms raised in the crowd",
      "CLOUD-12": "The Eiffel Tower seen from a set table on a terrace",
      "CLOUD-13": "A sky of red and orange clouds at sunset",
      "CLOUD-14": "Snow-capped mountains across a lake in the evening light",
      "CLOUD-15": "A sports field lit by floodlights in the rain",
    },
  },
  {
    id: "love",
    name: "Love",
    country: "",
    year: "",
    cover: "LOVE-01",
    coverFocus: "50% 60%",
    photos: ["LOVE-05"],
    alts: {
      "LOVE-01": "A lake at dusk, the last light reflected in the water",
      "LOVE-02": "A campfire seen through the trees at nightfall",
      "LOVE-03": "Two people on ladders building a wooden structure above a painted sign",
      "LOVE-04": "A wooden caravan on a meadow under a cloudy sky",
      "LOVE-05": "Four scouts arm in arm at a camp, in an old print",
      "LOVE-06": "Dinner outdoors, a plate of pasta in the foreground",
    },
  },
];

/** The bands that are shown. A hidden band is ignored by the site and by the pipeline. */
export const cities: City[] = bands.filter((city) => !city.hidden);
