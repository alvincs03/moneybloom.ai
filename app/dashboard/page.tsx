'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const scholarships = [
  {
    id: 1,
    name: 'Gates Scholarship',
    org: 'Bill & Melinda Gates Foundation',
    amount: '$20,000',
    deadline: 'Sep 15, 2026',
    tags: ['First-Gen', 'STEM', 'No Essay'],
    match: '98%'
  },
  {
    id: 2,
    name: 'Coca-Cola Scholars Program',
    org: 'Coca-Cola Scholars Foundation',
    amount: '$20,000',
    deadline: 'Oct 1, 2026',
    tags: ['Leadership', 'Community'],
    match: '94%'
  },
  {
    id: 3,
    name: 'Dell Scholars Program',
    org: 'Michael & Susan Dell Foundation',
    amount: '$20,000',
    deadline: 'Nov 3, 2026',
    tags: ['Low Income', 'First-Gen'],
    match: '91%'
  },
  {
    id: 4,
    name: 'Ron Brown Scholar Program',
    org: 'College Fund / UNCF',
    amount: '$10,000/yr',
    deadline: 'Nov 1, 2026',
    tags: ['Community', 'Leadership'],
    match: '87%'
  }
];

export default function Dashboard() {
  const [selectedScholarship, setSelectedScholarship] = useState<number | null>(null);

  const handleViewScholarship = (id: number) => {
    setSelectedScholarship(id);
    alert(`Viewing scholarship ${id}. Full details would load here.`);
  };

  const handleCompleteProfile = () => {
    alert('Redirecting to profile completion...');
  };

  return (
    <DashboardLayout active="dashboard">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Good morning, Alvin 👋</h1>
          <p className="text-gray-600">Here are your best-matched scholarships for today.</p>
        </div>

        {/* Alert card */}
        <div className="bg-orange-50 border-l-4 border-[#c46039] p-6 mb-8 rounded animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-[#c46039] mb-1">Complete your profile to unlock better matches</p>
              <p className="text-sm text-gray-600">You're 60% done — add your financial background to see 40+ more scholarships</p>
            </div>
            <div className="text-right">
              <div className="w-24 h-2 bg-gray-200 rounded-full mb-2 overflow-hidden">
                <div className="w-3/5 h-full bg-[#c46039]"></div>
              </div>
              <p className="text-sm font-semibold">60%</p>
              <button onClick={handleCompleteProfile} className="text-[#c46039] text-sm font-semibold hover:underline cursor-pointer">
                Complete Now
              </button>
            </div>
          </div>
        </div>

        {/* Scholarships grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Your Matched Scholarships</h2>
            <span className="text-gray-600 text-sm">127 matches found</span>
          </div>

          {/* Filter chips */}
          <div className="flex gap-3 mb-6">
            {['All', 'No Essay', 'STEM', 'Arts', 'Community'].map((filter) => (
              <button
                key={filter}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  filter === 'All'
                    ? 'bg-[#c46039] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Scholarship cards */}
          <div className="space-y-4">
            {scholarships.map((scholarship, idx) => (
              <div key={scholarship.id} className="bg-white rounded-lg overflow-hidden border-l-4 border-[#5b9e9a] animate-slide-in-right flex" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="w-32 h-32 bg-gradient-to-br from-[#c46039] to-[#5b9e9a] flex-shrink-0 flex items-center justify-center">
                  <div className="text-white text-4xl font-bold opacity-20">
                    {scholarship.name.charAt(0)}
                  </div>
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">{scholarship.name}</h3>
                        <p className="text-sm text-gray-600">{scholarship.org}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#c46039]">{scholarship.amount}</p>
                        <p className="text-xs text-gray-600">Due {scholarship.deadline}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap mb-4">
                      {scholarship.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#5b9e9a]" style={{ width: scholarship.match }}></div>
                        </div>
                        <span className="text-sm font-semibold text-[#5b9e9a]">{scholarship.match} match</span>
                      </div>
                      <button onClick={() => handleViewScholarship(scholarship.id)} className="text-[#c46039] text-sm font-semibold hover:underline cursor-pointer">
                        View →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2"></div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold mb-4">Upcoming Deadlines</h3>
              <div className="space-y-3">
                {[
                  { name: 'Gates Scholarship', days: '12 days' },
                  { name: 'QuestBridge Scholar', days: '28 days' },
                  { name: 'Coca-Cola Scholars', days: '36 days' }
                ].map((deadline) => (
                  <div key={deadline.name} className="flex justify-between text-sm">
                    <span className="font-medium">{deadline.name}</span>
                    <span className="text-[#c46039] font-semibold">{deadline.days}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="font-bold mb-4">Tip of the day</h3>
              <p className="text-sm text-gray-700">Scholarship essays with personal stories are 3x more likely to win. Start with your why.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
