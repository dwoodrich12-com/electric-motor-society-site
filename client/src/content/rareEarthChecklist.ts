export const CHECKLIST_ACCESS_KEY = 'ems-rare-earth-checklist';

export const CHECKLIST_SOURCE = {
  publisher: 'S&P Global',
  url: 'https://www.spglobal.com/energy/en/news-research/latest-news/metals/110926-china-extends-rare-earth-export-suspension-to-january-2027',
  dysprosium: {
    label: 'Dysprosium oxide, CIF North America',
    recent: '$4,100/kg on October 30, 2026',
    earlier: '$1,200/kg on March 31',
  },
  terbium: {
    label: 'Terbium oxide, CIF North America',
    recent: '$8,100/kg',
    earlier: '$4,900/kg',
  },
} as const;

export type ChecklistQuestion = {
  n: number;
  title: string;
  prompt: string;
};

export const CHECKLIST_QUESTIONS: ChecklistQuestion[] = [
  {
    n: 1,
    title: 'Magnet type by product family',
    prompt: 'For each product family, what magnet is in the rotor: NdFeB, SmCo, ferrite, or none?',
  },
  {
    n: 2,
    title: 'Which grades contain Dy/Tb',
    prompt: 'Which grades list dysprosium or terbium, and at what share of the magnet?',
  },
  {
    n: 3,
    title: 'Hot-spot temperature vs. the grade rating',
    prompt: 'What is the magnet hot-spot temperature in the worst duty, and how does it compare with the grade rating?',
  },
  {
    n: 4,
    title: 'Room to drop a grade with better cooling',
    prompt: 'If cooling improved, is there margin to move to a grade with less heavy rare earth?',
  },
  {
    n: 5,
    title: 'Grain-boundary-diffusion magnets',
    prompt: 'Could a grain-boundary-diffusion magnet cut the Dy/Tb in the bulk of the magnet for this duty?',
  },
  {
    n: 6,
    title: 'Where magnets are refined and made',
    prompt: 'In which countries are the oxides refined and the finished magnets made?',
  },
  {
    n: 7,
    title: 'DFARS exposure',
    prompt: 'Which programs would be covered by the stricter US DFARS magnet sourcing rules that start January 1, 2027?',
  },
  {
    n: 8,
    title: 'A second magnet source outside China',
    prompt: 'Is there a qualified second source whose refining and magnet making sit outside China?',
  },
  {
    n: 9,
    title: 'Price and lead time vs. 12 months ago',
    prompt: 'Using purchasing’s own quotes, what are price and lead time versus 12 months ago?',
  },
  {
    n: 10,
    title: 'Higher-speed motor plus a gearbox',
    prompt: 'Would a higher-speed motor plus a gearbox cut magnet volume enough to matter on this product?',
  },
  {
    n: 11,
    title: 'Induction, SynRM, or ferrite',
    prompt: 'Could an induction, synchronous-reluctance, or ferrite design meet the spec?',
  },
  {
    n: 12,
    title: 'DOE electric motor standards',
    prompt: 'Which of these products also overlap the DOE electric motor standards effective June 1, 2027?',
  },
];

export const TEASER_COUNT = 4;

export type ChecklistAccess = {
  name: string;
  company: string;
};
