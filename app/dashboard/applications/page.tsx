'use client';

import DashboardLayout from '@/components/DashboardLayout';

const statuses = [
  { label: 'Saved', count: 12, color: 'bg-blue-100' },
  { label: 'In Progress', count: 4, color: 'bg-yellow-100' },
  { label: 'Submitted', count: 3, color: 'bg-green-100' },
  { label: 'Awarded', count: 1, color: 'bg-purple-100' }
];

export default function Applications() {
  return (
    <DashboardLayout active="applications">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6 animate-fade-in">My Applications</h1>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {statuses.map((status, idx) => (
            <div key={status.label} className={`${status.color} rounded-lg p-4 animate-fade-in`} style={{ animationDelay: `${idx * 0.1}s` }}>
              <p className="text-sm font-medium text-gray-700">{status.label}</p>
              <p className="text-2xl font-bold mt-2">{status.count}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-6">
          {statuses.map((status) => (
            <div key={status.label}>
              <h3 className="font-bold mb-4">{status.label}</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg p-4 text-sm">
                    <p className="font-semibold mb-1">Scholarship Name</p>
                    <p className="text-gray-600">$10,000</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
