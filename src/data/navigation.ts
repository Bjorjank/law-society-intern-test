export type NavigationLink = {
  label: string;
  href: string;
};

export type NavigationSection = NavigationLink & {
  key: string;
  children: NavigationLink[];
};

const SITE = "https://www.lawsociety.org.sg";

export const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/groups/thelawsocietyofsingapore/",
    shortLabel: "f",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/lawsocietysg/",
    shortLabel: "instagram",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/the-law-society-of-singapore",
    shortLabel: "in",
  },
] as const;

export const navigationSections: NavigationSection[] = [
  {
    key: "about",
    label: "About Us",
    href: `${SITE}/what-we-do/`,
    children: [
      { label: "What We Do", href: `${SITE}/what-we-do/` },
      { label: "Council 2025", href: `${SITE}/council-secretariat/` },
      { label: "Executive Committee 2025", href: `${SITE}/council-secretariat/` },
      { label: "Presidents & Honorary Members", href: `${SITE}/presidents-honorary-members/` },
      { label: "Award Recipients", href: `${SITE}/recognising-our-awardees/` },
      { label: "Secretariat 2025", href: `${SITE}/council-secretariat/` },
      { label: "Standing Committees 2025", href: `${SITE}/standing-committees/` },
      { label: "Practice Areas", href: `${SITE}/find-a-lawyer/` },
      { label: "Support Schemes", href: `${SITE}/support-schemes/` },
      { label: "Membership Privileges", href: `${SITE}/join-the-society/` },
    ],
  },
  {
    key: "lawyers",
    label: "Lawyers",
    href: `${SITE}/find-a-lawyer/`,
    children: [
      { label: "Find a Lawyer", href: `${SITE}/find-a-lawyer/` },
      { label: "Members' Library", href: `${SITE}/members-library/` },
      { label: "Ethics & Professional Conduct", href: `${SITE}/ethics-professional-conduct/` },
      { label: "Practice Perspectives", href: `${SITE}/practice-perspectives/` },
      { label: "Support Schemes", href: `${SITE}/support-schemes/` },
    ],
  },
  {
    key: "public",
    label: "Public",
    href: `${SITE}/contact-us/`,
    children: [
      { label: "Find Legal Help", href: `${SITE}/contact-us/` },
      { label: "Legal Costs / Disputes", href: `${SITE}/legal-costs-disputes/` },
      { label: "File a Complaint", href: `${SITE}/file-a-complaint/` },
      { label: "Pro Bono Services", href: "https://www.probono.sg/" },
      { label: "Compensation Fund", href: `${SITE}/compensation-fund/` },
    ],
  },
  {
    key: "admissions",
    label: "Admissions",
    href: `${SITE}/admissions/`,
    children: [
      { label: "Admission to the Singapore Bar", href: `${SITE}/admissions/` },
      { label: "Courses for Practice Trainees", href: `${SITE}/courses-for-practice-trainees/` },
      { label: "Ceasing Your Practice", href: `${SITE}/ceasing-your-practice/` },
    ],
  },
  {
    key: "media",
    label: "Media",
    href: "#news",
    children: [
      { label: "Media & Press", href: "#news" },
      { label: "Press Room", href: `${SITE}/press-room/` },
      { label: "Speeches", href: `${SITE}/speeches/` },
      { label: "Annual Reports", href: `${SITE}/annual-reports/` },
      { label: "Publications", href: `${SITE}/publications/` },
      { label: "News", href: `${SITE}/news/` },
    ],
  },
  {
    key: "cpd",
    label: "CPD",
    href: `${SITE}/cpd-events/`,
    children: [
      { label: "CPD Events", href: `${SITE}/cpd-events/` },
      { label: "CPD Calendar", href: `${SITE}/cpd-calendar/` },
      { label: "Legal Practice Management Course", href: `${SITE}/legal-practice-management-course/` },
      { label: "Mandatory Ethics Component", href: `${SITE}/mandatory-ethics-component-requirements/` },
      { label: "E-Learning", href: `${SITE}/e-learning/` },
    ],
  },
  {
    key: "login",
    label: "Member Login",
    href: `${SITE}/login/`,
    children: [
      { label: "Member Login", href: `${SITE}/login/` },
      { label: "Members' Library", href: `${SITE}/members-library/` },
    ],
  },
  {
    key: "membership",
    label: "Membership",
    href: `${SITE}/join-the-society/`,
    children: [
      { label: "Join the Society", href: `${SITE}/join-the-society/` },
      { label: "Membership Benefits", href: `${SITE}/join-the-society/` },
      { label: "Members' Assistance", href: `${SITE}/members-assistance/` },
      { label: "Support Schemes", href: `${SITE}/support-schemes/` },
    ],
  },
  {
    key: "careers",
    label: "Careers",
    href: "https://lawsocietycareers.com.sg/",
    children: [
      { label: "Careers Portal", href: "https://lawsocietycareers.com.sg/" },
      { label: "Career Support", href: "#career" },
      { label: "Mentorship Scheme", href: `${SITE}/mentorship-scheme/` },
    ],
  },
  {
    key: "advertise",
    label: "Advertise",
    href: `${SITE}/advertise/`,
    children: [
      { label: "Advertising Platforms", href: `${SITE}/advertise/` },
      { label: "Featured Lawyer Directory", href: `${SITE}/find-a-lawyer/` },
      { label: "Specialist Directory", href: `${SITE}/find-a-featured-specialist/` },
      { label: "Careers Portal", href: "https://lawsocietycareers.com.sg/" },
    ],
  },
];

export const searchableNavigation = navigationSections.flatMap((section) => [
  { label: section.label, href: section.href, group: "Main menu" },
  ...section.children.map((child) => ({ ...child, group: section.label })),
]);
