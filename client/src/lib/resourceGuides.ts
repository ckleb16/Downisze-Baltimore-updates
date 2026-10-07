export const RESOURCE_GUIDES = [
  {
    slug: "what-do-i-do-with-all-this-stuff",
    title: "What Do I Do With All This Stuff?",
    description: "A practical guide to sorting, sharing, selling, donating and letting go, without getting overwhelmed.",
    pages: 5,
    bytes: 2502460,
    contents: [
      "Start small with one drawer, cabinet or category.",
      "Use six buckets to decide what stays and what goes.",
      "Think through furniture, collections, photographs and important papers.",
      "Write down your first small plan.",
    ],
  },
  {
    slug: "should-i-stay-or-should-i-go",
    title: "Should I Stay or Should I Go?",
    description: "A short guide to sorting out the question, before anyone has to make a decision.",
    pages: 6,
    bytes: 2561219,
    contents: [
      "Consider three paths: stay as it is, change the house or move.",
      "Identify what is really driving the question.",
      "Find questions to ask yourself and your family.",
      "Put your first small plan on paper.",
    ],
  },
  {
    slug: "could-an-adu-work-for-your-family",
    title: "Could An ADU Work For Your Family?",
    description: "Six ways families are using one property to solve two housing problems. Close enough to be connected. Separate enough to be independent.",
    pages: 6,
    bytes: 2736676,
    contents: [
      "Explore different forms an accessory dwelling unit (ADU) can take.",
      "Consider six family situations and the questions each raises.",
      "Identify property, local-rule, cost and professional-support questions.",
      "Start a family conversation and write your first small plan.",
    ],
  },
] as const;

export type ResourceGuide = (typeof RESOURCE_GUIDES)[number];
export const guidePath = (guide: ResourceGuide) => `/${guide.slug}`;
export const guidePdfPath = (guide: ResourceGuide) => `/guides/${guide.slug}.pdf`;
export const guideCoverPath = (guide: ResourceGuide) => `/guides/${guide.slug}-cover.jpg`;
export const guideFileDetails = (guide: ResourceGuide) =>
  `PDF · ${guide.pages} pages · ${(guide.bytes / 1_000_000).toFixed(1)} MB`;
