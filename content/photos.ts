import type { City } from "./types";

// Photo section: one band per city, the cover first, then up to six photos.
// Provisional selection (Ben has not chosen yet). No cover has an identifiable
// face in the foreground, and frames where people can be recognised were left
// out. A photo is referenced by its source stem "<CODE>-NN" from
// ~/Pictures/Portfolio/<CODE>/ (originals, not in the repo).
// Web versions: `npm run photos` (scripts/photos.mjs) writes public/photos/<id>/
// and content/photos.generated.ts. Re-run it once the originals are graded.

export const photoIntro = {
  label: "Photo",
  title: "By city, ",
  titleEmphasis: "selection in progress.",
  note: "Open a band to see the rest of the roll.",
};

export const cities: City[] = [
  {
    id: "montreal",
    name: "Montréal",
    country: "Canada",
    year: "2026",
    cover: "MTL-01",
    coverFocus: "50% 35%",
    // Left out: MTL-05, an AI-retouched frame (snow added with Firefly).
    photos: ["MTL-02", "MTL-03", "MTL-04"],
    alts: {
      "MTL-01": "Two office towers lit against a deep blue night sky",
      "MTL-02": "A downtown street between towers at dusk, street lamps on",
      "MTL-03": "A glass residential tower seen from below",
      "MTL-04": "Snow-covered firs under a chairlift",
    },
  },
  {
    id: "tel-aviv",
    name: "Tel Aviv",
    country: "Israel",
    year: "", // TODO Ben: confirmer l'année
    todo: "année",
    cover: "TLV-04",
    coverFocus: "50% 45%",
    // Left out: TLV-01 and TLV-03 (crowds).
    photos: ["TLV-08", "TLV-07", "TLV-06", "TLV-05", "TLV-02"],
    alts: {
      "TLV-04": "Palm trees and a street lamp against a stormy sunset over the sea",
      "TLV-08": "The sun going down behind clouds over the sea",
      "TLV-07": "A jetty and a small lighthouse at sunset",
      "TLV-06": "A marina seen from above, the sea glittering behind it",
      "TLV-05": "The beach and its palm trees under a wide blue sky",
      "TLV-02": "A DJ booth seen from behind, a fist raised over the decks",
    },
  },
  {
    id: "ibiza",
    name: "Ibiza",
    country: "Spain",
    year: "2024 – 2025",
    cover: "IBZ-01",
    coverFocus: "50% 52%",
    coverTone: "light",
    // IBZ and IBZ2 are the same island, two summers. Left out: IBZ-03 (screen capture).
    photos: ["IBZ-04", "IBZ-06", "IBZ2-02", "IBZ2-03", "IBZ2-04"],
    alts: {
      "IBZ-01": "The Ibiza letters and two giant red cherries on a paved square",
      "IBZ-04": "A pool at dusk",
      "IBZ-06": "The entrance of Pacha at night",
      "IBZ2-02": "The Ibiza letters, planted with greenery, along a road",
      "IBZ2-03": "The Ushuaïa stage and its crowd at sunset",
      "IBZ2-04": "The Ushuaïa stage at night, flames on both sides",
    },
  },
  {
    id: "mexico",
    name: "Mexico", // TODO Ben: confirmer le lieu exact
    country: "Mexico",
    year: "2025",
    todo: "lieu exact",
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
    photos: ["TRF-TGR-01", "TRF-TGR-02", "TRF-TGR-03"],
    alts: {
      "TRF-TGR-04": "Two kites over the sea at sunset",
      "TRF-TGR-01": "Waves under an orange sky",
      "TRF-TGR-02": "A white mosque and its minaret under a blue sky",
      "TRF-TGR-03": "A rounded white building on a busy street",
    },
  },
  {
    id: "mrb",
    name: "MRB", // TODO Ben: confirmer la ville (code de la story à la une)
    country: "", // TODO Ben: confirmer
    year: "2024",
    todo: "ville et pays",
    cover: "MRB-04",
    coverFocus: "50% 62%",
    // Left out: MRB-03 and MRB-05 (people at close range).
    photos: ["MRB-06", "MRB-01", "MRB-02"],
    alts: {
      "MRB-04": "The bow of a jet ski on open sea",
      "MRB-06": "A shoreline at dusk",
      "MRB-01": "A beach restaurant under a reed roof",
      "MRB-02": "A fringed parasol over a table facing the sea",
    },
  },
  {
    id: "ski",
    name: "Ski", // TODO Ben: confirmer la station et l'année
    country: "",
    year: "", // TODO Ben: confirmer
    todo: "station et année",
    cover: "SKI-01",
    coverFocus: "50% 70%",
    photos: ["SKI-02"],
    alts: {
      "SKI-01": "A snowy forest under a grey sky",
      "SKI-02": "A snow-covered peak under a blue sky",
    },
  },
  {
    // CLOUD is a mix (concerts, Paris, Milan, Lausanne…): only concert and club frames
    // are shown, as one "Nights" band. Left out: CLOUD-06 and CLOUD-10 (performers'
    // faces), and the whole LOVE folder (faces).
    id: "nights",
    name: "Nights",
    country: "Concerts & clubs",
    year: "", // TODO Ben: confirmer les années
    todo: "années",
    cover: "CLOUD-01",
    coverFocus: "50% 55%",
    photos: ["CLOUD-03", "CLOUD-04", "CLOUD-11", "CLOUD-02"],
    alts: {
      "CLOUD-01": "A pianist on stage under a fan of light beams",
      "CLOUD-03": "A concert hall under a rectangle of blue neon",
      "CLOUD-04": "A club crowd seen from the back",
      "CLOUD-11": "Soap bubbles and light beams in the trees",
      "CLOUD-02": "A saxophonist in silhouette inside a beam of light",
    },
  },
];
