// Portfolio data. The four categories and their sets. Sets and images are
// placeholders until Kai's approved photo folder lands, at which point the
// `images` arrays get the real WebP filenames and alt text. Routes and covers
// are already wired off this structure, so adding real work is a data edit.

export interface PhotoSet {
  slug: string;
  title: string;
  caption: string;
  cover: string;
  images: { src: string; alt: string }[];
}

export interface Category {
  slug: string;
  title: string;
  blurb: string;
  cover: string;
  sets: PhotoSet[];
}

// Placeholder photos in /public/images. Swap for real assets per set later.
const PH = {
  a: '/images/portfolio-01-94cdf5aa.jpg',
  b: '/images/portfolio-02-c3791f90.jpg',
  c: '/images/portfolio-03-94cdf5aa.jpg',
  d: '/images/portfolio-04-c3791f90.jpg',
  hero: '/images/portfolio-00-942c288a.jpg',
};

function placeholderImages(prefix: string): { src: string; alt: string }[] {
  const order = [PH.hero, PH.a, PH.b, PH.c, PH.d, PH.a, PH.b, PH.c];
  return order.map((src, i) => ({ src, alt: `${prefix}, frame ${i + 1}. Placeholder until Kai's set lands.` }));
}

export const categories: Category[] = [
  {
    slug: 'editorial',
    title: 'Editorial',
    blurb: 'Portraits and stories, shot with intention.',
    cover: PH.a,
    sets: [
      { slug: 'the-block', title: 'The Block', caption: 'Editorial / The Crew', cover: PH.a, images: placeholderImages('NYC editorial portrait by Visionary Productions') },
      { slug: '88-in-red', title: '88 In Red', caption: 'Editorial / Studio', cover: PH.b, images: placeholderImages('NYC editorial studio portrait by Visionary Productions') },
    ],
  },
  {
    slug: 'events',
    title: 'Events',
    blurb: 'The night, the room, the people, kept.',
    cover: PH.b,
    sets: [
      { slug: 'the-room', title: 'The Room', caption: 'Events / Night', cover: PH.b, images: placeholderImages('NYC event photography by Visionary Productions') },
    ],
  },
  {
    slug: 'lifestyle',
    title: 'Lifestyle',
    blurb: 'Real moments, golden hour, the everyday made to matter.',
    cover: PH.c,
    sets: [
      { slug: 'stoop-session', title: 'Stoop Session', caption: 'Lifestyle / The Steps', cover: PH.c, images: placeholderImages('Brooklyn lifestyle photography by Visionary Productions') },
      { slug: 'golden-hour', title: 'Golden Hour', caption: 'Lifestyle / The Scene', cover: PH.d, images: placeholderImages('NYC golden hour lifestyle photography by Visionary Productions') },
    ],
  },
  {
    slug: 'fashion',
    title: 'Fashion',
    blurb: 'The look, the brand, the statement.',
    cover: PH.d,
    sets: [
      { slug: 'the-look', title: 'The Look', caption: 'Fashion / Brand', cover: PH.d, images: placeholderImages('New York fashion photography by Visionary Productions') },
    ],
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getSet(categorySlug: string, setSlug: string): { category: Category; set: PhotoSet } | undefined {
  const category = getCategory(categorySlug);
  const set = category?.sets.find((s) => s.slug === setSlug);
  if (!category || !set) return undefined;
  return { category, set };
}
