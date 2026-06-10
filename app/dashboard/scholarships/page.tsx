'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function Scholarships() {
  const [saved, setSaved] = useState<number[]>([]);

  const handleSave = (id: number) => {
    setSaved(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
    alert(`Scholarship ${id} ${saved.includes(id) ? 'removed from' : 'added to'} saved list`);
  };
  return (
    <DashboardLayout active="scholarships">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6 animate-fade-in">Scholarships</h1>

        <input
          type="text"
          placeholder="Search scholarships, orgs, or keywords..."
          className="w-full max-w-2xl px-4 py-2 mb-6 border border-gray-300 rounded-lg"
        />

        <div className="flex gap-2 mb-6">
          {['All', 'No Essay', 'STEM', 'Local', 'First-Gen', 'Arts', 'Under $5k'].map((filter) => (
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

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">127 scholarships found</p>
          <select className="border border-gray-300 rounded px-3 py-2">
            <option>Sort: Best Match ↓</option>
          </select>
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden flex animate-slide-in-right" style={{ animationDelay: `${(i-1) * 0.1}s` }}>
              <div className="w-24 h-24 bg-gradient-to-br from-[#c46039] to-[#5b9e9a] flex-shrink-0 flex items-center justify-center">
                <div className="text-white text-2xl font-bold opacity-20">S{i}</div>
              </div>
              <div className="flex-1 p-6 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold mb-1">Scholarship Name #{i}</h3>
                  <p className="text-sm text-gray-600">Organization Name</p>
                </div>
                <div className="text-right mr-6">
                  <p className="font-bold text-[#c46039]">$20,000</p>
                  <p className="text-xs text-gray-600">Due Dec 15</p>
                </div>
                <button onClick={() => handleSave(i)} className="text-[#c46039] font-semibold hover:underline whitespace-nowrap cursor-pointer">
                  {saved.includes(i) ? 'Saved ✓' : 'Save ↓'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
