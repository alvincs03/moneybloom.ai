'use client';

import { useState } from 'react';
import Nav from '@/components/Nav';

const faqs = [
  {
    id: "trust",
    category: "Trust",
    questions: [
      { q: "Is moneybloom actually free?", a: "Yes — completely free for students. We will never charge you or ask for a credit card." },
      { q: "Do you sell my data?", a: "No. We do not share, sell, or trade your personal information with scholarship providers or third parties. Ever." },
      { q: "Are the scholarships real?", a: "We manually vet every scholarship in our database. If it's on your list, it's legitimate, open, and currently accepting applications." },
      { q: "How do you verify scholarships?", a: "Our team checks each scholarship's website, eligibility requirements, and application status. We remove any that are closed or have expired deadlines." },
      { q: "Is my profile information secure?", a: "Yes. We use industry-standard encryption and never store sensitive information like SSN or bank details." }
    ]
  },
  {
    id: "product",
    category: "Product",
    questions: [
      { q: "How does the matching work?", a: "We score your scholarship against your profile — GPA, major, background, location, activities — and rank by your odds of winning, not just award size." },
      { q: "What makes this different from Scholarships.com?", a: "We don't show you 300 results and call it a match. We show you the 15 you should actually apply to. Quality over quantity." },
      { q: "How often is the database updated?", a: "Continuously. Our team and community flag expired listings, and we add new ones weekly — especially local and niche scholarships that aggregators miss." },
      { q: "Can I search for specific scholarships?", a: "Yes. You can search by keyword, organization, location, or filter by requirements like essay length, GPA, or major." },
      { q: "How many scholarships are in your database?", a: "We have thousands of scholarships, from large national awards to local community scholarships with less competition." }
    ]
  },
  {
    id: "practical",
    category: "Practical",
    questions: [
      { q: "How long does the profile take to fill out?", a: "About 5 minutes. 25 questions covering your academic background, financial situation, and interests." },
      { q: "Can I update my profile later?", a: "Yes. Your matches update automatically every time you make a change." },
      { q: "What if I'm undocumented or DACA?", a: "We specifically surface scholarships that are open to undocumented and DACA students. Your status is never shared." },
      { q: "Can I apply to multiple scholarships at once?", a: "You can save unlimited scholarships and track your applications for each one. We help you organize your timeline and deadlines." },
      { q: "What if I don't have a strong GPA?", a: "We have scholarships for all GPA ranges. Many scholarships value essays, extracurriculars, and life circumstances over grades alone." }
    ]
  },
  {
    id: "privacy",
    category: "Privacy",
    questions: [
      { q: "What information do you collect?", a: "Only what's necessary to match you: academic background, financial info, demographics, and interests. No social security number or bank info." },
      { q: "Can I delete my account?", a: "Yes, at any time. Settings > Delete Account. All your data is permanently removed within 24 hours." },
      { q: "Who has access to my information?", a: "Only you. We don't share or sell data to scholarship providers. They see your application, not your profile." },
      { q: "Can I export my data?", a: "Yes. You can download your profile and saved scholarships anytime as a backup." },
      { q: "Do you use my data for marketing?", a: "No. We never use your data to target ads or sell you products. Your information is yours alone." }
    ]
  }
];

export default function FAQ() {
  const [activeSection, setActiveSection] = useState("trust");

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <Nav />

      <div className="flex max-w-6xl mx-auto px-12 py-16 gap-12">
        {/* Table of Contents Sidebar */}
        <aside className="w-48 flex-shrink-0 sticky top-8 h-fit">
          <div className="bg-[#f5f0e8] rounded-lg p-6 border border-gray-200 backdrop-blur-sm">
            <h3 className="text-sm font-bold uppercase mb-4 text-gray-600">Sections</h3>
            <nav className="space-y-2">
              {faqs.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSection(section.id);
                    document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`block px-3 py-2 rounded transition ${
                    activeSection === section.id
                      ? 'bg-[#c46039] text-white font-bold'
                      : 'text-gray-600 hover:text-[#c46039]'
                  }`}
                >
                  {section.category}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <h1 className="text-5xl font-bold mb-4 animate-fade-in">FAQ</h1>
          <p className="text-gray-600 mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Find answers to common questions about moneybloom.
          </p>

          {faqs.map((section, sIdx) => (
            <section
              key={section.id}
              id={section.id}
              className="mb-16 animate-fade-in"
              style={{ animationDelay: `${sIdx * 0.15}s` }}
              onMouseEnter={() => setActiveSection(section.id)}
            >
              <h2 className="text-3xl font-bold mb-6">{section.category}</h2>

              <div className="space-y-4">
                {section.questions.map((faq, i) => (
                  <details
                    key={i}
                    className="bg-white rounded-lg p-6 animate-slide-in-right"
                    style={{ animationDelay: `${(sIdx * 0.15) + (i * 0.05)}s` }}
                  >
                    <summary
                      className="font-semibold cursor-pointer flex justify-between items-center hover:text-[#c46039] transition"
                      style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
                    >
                      <span>{faq.q}</span>
                      <span className="ml-4 text-gray-400">↓</span>
                    </summary>
                    <p
                      className="mt-4 text-gray-700 leading-relaxed"
                      style={{ fontFamily: "'Suisse Intl', 'DM Sans', sans-serif" }}
                    >
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
