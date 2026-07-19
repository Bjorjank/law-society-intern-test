export type NewsArticle = {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  url: string;
  imageUrl: string;
  section: string;
};

export type NewsResponse = {
  articles: NewsArticle[];
  source: "guardian" | "fixture";
};

export const newsFixture: NewsArticle[] = [
  {
    id: "fixture-1",
    title: "Building public trust through stronger professional standards",
    description:
      "Legal institutions continue to strengthen professional standards, public confidence and access to justice.",
    publishedAt: "2026-06-30T08:00:00Z",
    url: "https://www.theguardian.com/law",
    imageUrl: "/figma/press-1.jpg",
    section: "Law",
  },
  {
    id: "fixture-2",
    title: "How technology is reshaping modern legal practice",
    description:
      "Digital tools are changing how legal teams collaborate, manage knowledge and serve their clients.",
    publishedAt: "2026-06-22T08:00:00Z",
    url: "https://www.theguardian.com/technology",
    imageUrl: "/figma/press-2.jpg",
    section: "Technology",
  },
  {
    id: "fixture-3",
    title: "New approaches expand access to legal support",
    description:
      "Community programmes and new service models are helping more people obtain timely legal assistance.",
    publishedAt: "2026-06-14T08:00:00Z",
    url: "https://www.theguardian.com/society",
    imageUrl: "/figma/press-3.jpg",
    section: "Society",
  },
  {
    id: "fixture-4",
    title: "Professional learning remains central to legal excellence",
    description:
      "Continuous education helps practitioners respond confidently to regulatory and technological change.",
    publishedAt: "2026-06-05T08:00:00Z",
    url: "https://www.theguardian.com/education",
    imageUrl: "/figma/press-1.jpg",
    section: "Education",
  },
  {
    id: "fixture-5",
    title: "Regional collaboration creates new opportunities for lawyers",
    description:
      "Cross-border networks are connecting practitioners and supporting the exchange of legal knowledge.",
    publishedAt: "2026-05-27T08:00:00Z",
    url: "https://www.theguardian.com/world/asia-pacific",
    imageUrl: "/figma/press-2.jpg",
    section: "Asia Pacific",
  },
  {
    id: "fixture-6",
    title: "Responsible AI moves higher on the legal agenda",
    description:
      "Lawyers and policymakers are examining governance, accountability and ethical use of artificial intelligence.",
    publishedAt: "2026-05-19T08:00:00Z",
    url: "https://www.theguardian.com/technology/artificialintelligenceai",
    imageUrl: "/figma/press-3.jpg",
    section: "AI",
  },
];
