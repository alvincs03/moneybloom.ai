import type { ScrapedScholarship, Source } from "../types";

// A small set of real, well-known national scholarships, used to seed the
// review queue so you can test the verification + filtering workflow without
// setting up an external API first.
//
// Enable with: SCRAPE_SAMPLE=1 npm run db:scrape
//
// These still land as PENDING and must be approved like any other record.
const SAMPLE: ScrapedScholarship[] = [
  {
    name: "The Gates Scholarship",
    organization: "Bill & Melinda Gates Foundation",
    amount: "Full cost of attendance",
    deadline: "September 15",
    description:
      "A highly selective, last-dollar scholarship for outstanding, minority, high school seniors from low-income households.",
    url: "https://www.thegatesscholarship.org/scholarship",
    level: "High School",
  },
  {
    name: "Coca-Cola Scholars Program",
    organization: "Coca-Cola Scholars Foundation",
    amount: "$20,000",
    deadline: "October 1",
    description:
      "Achievement-based scholarship awarded to graduating high school seniors for leadership and service.",
    url: "https://www.coca-colascholarsfoundation.org/apply/",
    level: "High School",
  },
  {
    name: "Dell Scholars Program",
    organization: "Michael & Susan Dell Foundation",
    amount: "$20,000",
    deadline: "December 1",
    description:
      "Supports low-income, highly motivated students who show determination to succeed, with wraparound support.",
    url: "https://www.dellscholars.org/scholarship/",
    level: "High School",
  },
  {
    name: "QuestBridge National College Match",
    organization: "QuestBridge",
    amount: "Full four-year scholarship",
    deadline: "September 26",
    description:
      "Connects high-achieving, low-income students with full scholarships to top colleges.",
    url: "https://www.questbridge.org/high-school-students/national-college-match",
    level: "High School",
  },
  {
    name: "Jack Kent Cooke Foundation College Scholarship",
    organization: "Jack Kent Cooke Foundation",
    amount: "Up to $55,000/yr",
    deadline: "November 14",
    description:
      "The largest scholarship in the U.S. for high-achieving high school seniors with financial need.",
    url: "https://www.jkcf.org/our-scholarships/college-scholarship-program/",
    level: "High School",
  },
  {
    name: "Ron Brown Scholar Program",
    organization: "Ron Brown Scholar Fund",
    amount: "$40,000 ($10,000/yr)",
    deadline: "November 1",
    description:
      "Awards academically talented, highly motivated Black/African American high school seniors.",
    url: "https://www.ronbrown.org/apply/",
    level: "High School",
  },
];

export const sampleSource: Source = {
  name: "sample",
  async run() {
    if (!process.env.SCRAPE_SAMPLE) return [];
    return SAMPLE;
  },
};
