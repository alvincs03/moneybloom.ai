'use client';

import DashboardLayout from '@/components/DashboardLayout';

export default function Deadlines() {
  return (
    <DashboardLayout active="deadlines">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6 animate-fade-in">Deadlines</h1>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">September 2026</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-gray-600 hover:text-gray-900">← Prev</button>
            <button className="px-3 py-1 text-gray-600 hover:text-gray-900">Next →</button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4 mb-8">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-semibold text-gray-600">
              {day}
            </div>
          ))}
          {[...Array(35)].map((_, i) => {
            const day = i + 1;
            const hasDeadline = [1, 5, 12, 15, 20, 25].includes(day);
            return (
              <div
                key={i}
                className={`p-3 rounded-lg text-center ${
                  hasDeadline
                    ? 'bg-[#c46039] text-white font-bold'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {day <= 30 ? day : ''}
              </div>
            );
          })}
        </div>

        <h3 className="font-bold mb-4">Upcoming Deadlines</h3>
        <div className="space-y-2">
          {[
            { date: 'Sep 1', name: 'Gates Scholarship' },
            { date: 'Sep 5', name: 'QuestBridge Scholar' },
            { date: 'Sep 12', name: 'Coca-Cola Scholars' }
          ].map((deadline) => (
            <div key={deadline.date} className="bg-white p-4 rounded-lg flex justify-between">
              <span className="font-semibold">{deadline.name}</span>
              <span className="text-[#c46039] font-bold">{deadline.date}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
