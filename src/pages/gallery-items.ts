// Magazine-style editorial copy that surfaces in the side margins when an
// image is opened. One entry per slot, in the same order as `items`/`images`.
export type Editorial = {
  issue: string;
  caption: string;
  body: string;
  photography: string;
  styling: string;
  location: string;
  year: string;
};

export const editorial: Editorial[] = [
  {
    issue: 'No. 01',
    caption: '“A quiet meeting of stone, water, and first footfall.”',
    body: 'The threshold is set in pale travertine — chosen for the way it cools at dusk and warms beneath candlelight. Couples cross slowly here.',
    photography: 'Evara Studio', styling: 'Atelier 1928', location: 'Udaipur, IN', year: 'MMXXVI',
  },
  {
    issue: 'No. 02',
    caption: '“Light measured in slow inches across an open courtyard.”',
    body: 'A single linen canopy filters the noon sun into something readable. The afternoon ceremony is timed to the migration of its shadow.',
    photography: 'Saanvi Rao', styling: 'Maison Vali', location: 'Jaisalmer, IN', year: 'MMXXVI',
  },
  {
    issue: 'No. 03',
    caption: '“Earth, fired and folded into a small, repeating song.”',
    body: 'Hand-thrown terracotta lines the ceremonial path. Each tile is uneven on purpose — a slow rhythm under the bride’s feet.',
    photography: 'Evara Studio', styling: 'House of Ila', location: 'Jodhpur, IN', year: 'MMXXV',
  },
  {
    issue: 'No. 04',
    caption: '“A doorway, kept just wide enough for two.”',
    body: 'The clay arch is dressed only with night-blooming jasmine. We resist filling it; the absence is the gesture.',
    photography: 'Aarav Mehta', styling: 'Atelier 1928', location: 'Udaipur, IN', year: 'MMXXVI',
  },
  {
    issue: 'No. 05',
    caption: '“Stone holding the heat of a long, considered day.”',
    body: 'A small private mandap, set into the lee of the haveli. The stone has been here three centuries; the wedding lasts three days.',
    photography: 'Evara Studio', styling: 'Maison Vali', location: 'Bikaner, IN', year: 'MMXXV',
  },
  {
    issue: 'No. 06',
    caption: '“The courtyard, made small enough to hold every name.”',
    body: 'Sixty seats arranged inside a square of marigolds. Intimacy is a design choice, never an accident.',
    photography: 'Saanvi Rao', styling: 'Atelier 1928', location: 'Udaipur, IN', year: 'MMXXVI',
  },
  {
    issue: 'No. 07',
    caption: '“Silence, drawn in cool water and warm cloth.”',
    body: 'The bride’s pre-ceremony ritual happens here, in a stepwell repurposed as a quiet-room. The morning belongs to her alone.',
    photography: 'Evara Studio', styling: 'House of Ila', location: 'Patan, IN', year: 'MMXXV',
  },
  {
    issue: 'No. 08',
    caption: '“Arches in slow bloom, set to receive an arrival.”',
    body: 'The procession passes through five worked-stone arches, each dressed in a different season’s flower. A small, deliberate journey.',
    photography: 'Aarav Mehta', styling: 'Atelier 1928', location: 'Udaipur, IN', year: 'MMXXVI',
  },
  {
    issue: 'No. 09',
    caption: '“A wall that remembers every word said against it.”',
    body: 'The vow exchange is staged before a hand-plastered earthen wall — porous, old, a little uneven. Voices land softer here.',
    photography: 'Evara Studio', styling: 'Maison Vali', location: 'Jodhpur, IN', year: 'MMXXVI',
  },
  {
    issue: 'No. 10',
    caption: '“A reflection held still for the length of a vow.”',
    body: 'The reflecting pool is shallower than it looks — designed so the surface stays mirror-flat through the entirety of the ceremony.',
    photography: 'Saanvi Rao', styling: 'Atelier 1928', location: 'Udaipur, IN', year: 'MMXXVI',
  },
  {
    issue: 'No. 11',
    caption: '“Warmth that rises from the floor, not the lamp.”',
    body: 'Underfoot, terracotta has been baked since dawn. By dusk, the room hums with retained heat — no heaters, no compromise.',
    photography: 'Evara Studio', styling: 'House of Ila', location: 'Bikaner, IN', year: 'MMXXV',
  },
  {
    issue: 'No. 12',
    caption: '“A portal, built quietly enough to walk through unnoticed.”',
    body: 'The transition between ceremony and feast is a single low arch, lit only from within. Guests duck slightly; the day shifts.',
    photography: 'Aarav Mehta', styling: 'Atelier 1928', location: 'Udaipur, IN', year: 'MMXXVI',
  },
  {
    issue: 'No. 13',
    caption: '“A niche, small enough to hold one held breath.”',
    body: 'Set into the haveli wall: a hand-cut alcove for the family lamps. Lit at sundown, kept lit through the seven pheras.',
    photography: 'Evara Studio', styling: 'Maison Vali', location: 'Jaisalmer, IN', year: 'MMXXVI',
  },
  {
    issue: 'No. 14',
    caption: '“Shelter, repeated until it becomes a rhythm.”',
    body: 'A colonnade of carved stone runs the long edge of the courtyard. The pheras are walked along it, one column at a time.',
    photography: 'Saanvi Rao', styling: 'House of Ila', location: 'Patan, IN', year: 'MMXXV',
  },
  {
    issue: 'No. 15',
    caption: '“Gold, used not as ornament but as direction.”',
    body: 'A single hand-stitched runner in dull gold leads from threshold to mandap. It is the only path light, and it is enough.',
    photography: 'Evara Studio', styling: 'Atelier 1928', location: 'Udaipur, IN', year: 'MMXXVI',
  },
  {
    issue: 'No. 16',
    caption: '“The space between two walls, kept deliberately empty.”',
    body: 'A narrow open-air gallery, treated as a pause in the program. Guests stand here between rituals; no music, only breath.',
    photography: 'Aarav Mehta', styling: 'Maison Vali', location: 'Jodhpur, IN', year: 'MMXXVI',
  },
  {
    issue: 'No. 17',
    caption: '“The day, drawn into a single, repeating square.”',
    body: 'A geometric canopy — stitched in panels by hand — frames the noon ceremony. Sun lands in measured tiles across the floor.',
    photography: 'Evara Studio', styling: 'House of Ila', location: 'Bikaner, IN', year: 'MMXXV',
  },
  {
    issue: 'No. 18',
    caption: '“A room that grows out of, rather than onto, the ground.”',
    body: 'The reception is staged inside a recovered courtyard whose floor is the original beaten earth. Nothing is laid; everything is rooted.',
    photography: 'Saanvi Rao', styling: 'Atelier 1928', location: 'Udaipur, IN', year: 'MMXXVI',
  },
  {
    issue: 'No. 19',
    caption: '“A line, drawn between desert and sky and held there.”',
    body: 'A long, low table runs the open-air rooftop. From every seat, the horizon is unbroken — the only decoration it needs.',
    photography: 'Evara Studio', styling: 'Maison Vali', location: 'Jaisalmer, IN', year: 'MMXXVI',
  },
  {
    issue: 'No. 20',
    caption: '“What is left after the music stops.”',
    body: 'A closing portrait: the bride and her grandmother, alone in a courtyard of cooling sand. We photograph nothing else for an hour.',
    photography: 'Aarav Mehta', styling: 'House of Ila', location: 'Bikaner, IN', year: 'MMXXVI',
  },
];

// Names paired with each image slot. The gallery cycles through these as the
// canvas tiles repeat across the infinite grid.
const items = [
  'Stillwater Entry',
  'Desert Light',
  'Terracotta Echo',
  'Threshold in Clay',
  'Stone Mirage',
  'Sol Courtyard',
  'Bath of Silence',
  'Arches in Bloom',
  'The Listening Wall',
  'Shadow Pool',
  'Warmed by Earth',
  'Portal of Quiet',
  'The Reflecting Niche',
  'Sheltered Rhythm',
  'Golden Passage',
  'Air Between Walls',
  'Sun Geometry',
  'Rooted Space',
  'Horizon Vault',
  'Sand & Silence',
];

// 20 source images — drawn from /public/images. Each gallery slot maps 1:1
// to an entry here, so swapping art is as simple as editing this list.
export const images = [
  '/images/evara-01.jpg',
  '/images/evara-02.jpg',
  '/images/evara-03.jpg',
  '/images/evara-04.jpg',
  '/images/evara-05.jpg',
  '/images/evara-06.jpg',
  '/images/evara-07.jpg',
  '/images/1.jpeg',
  '/images/2.jpeg',
  '/images/3.jpeg',
  '/images/4.jpeg',
  '/images/5.jpeg',
  '/images/8.jpeg',
  '/images/9.jpeg',
  '/images/10.jpeg',
  '/images/chapters/c1.jpg',
  '/images/chapters/c2.jpeg',
  '/images/chapters/c3.jpeg',
  '/images/chapters/c4.jpeg',
  '/images/chapters/c6.jpg',
];

export default items;
