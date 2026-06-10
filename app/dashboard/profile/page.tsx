'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const profileSections = [
  {
    id: 'academic',
    title: 'Academic Info',
    status: 'Complete',
    fields: [
      { label: 'School', value: 'Lincoln High School' },
      { label: 'GPA', value: '3.8 unweighted' },
      { label: 'Grade', value: '11th' },
      { label: 'Major', value: 'Computer Science' }
    ]
  },
  {
    id: 'financial',
    title: 'Financial Background',
    status: 'Incomplete',
    fields: [
      { label: 'Household Income', value: 'Not set' },
      { label: 'First-Gen', value: 'Yes' },
      { label: 'Free Lunch', value: 'Yes' },
      { label: 'Pell Grant', value: 'Not set' }
    ]
  },
  {
    id: 'identity',
    title: 'Identity & Background',
    status: 'Complete',
    fields: [
      { label: 'Ethnicity', value: 'Filipino' },
      { label: 'Gender', value: 'Male' },
      { label: 'Location', value: 'Suburban' }
    ]
  },
  {
    id: 'activities',
    title: 'Activities & Essays',
    status: 'Incomplete',
    fields: [
      { label: 'Activities', value: 'Community Service, Coding' },
      { label: 'Bio', value: 'Not set' }
    ]
  }
];

export default function Profile() {
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const handleEdit = (sectionId: string) => {
    setEditingSection(editingSection === sectionId ? null : sectionId);
    if (editingSection !== sectionId) {
      alert(`Editing ${sectionId}...`);
    }
  };

  return (
    <DashboardLayout active="profile">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8 animate-fade-in">My Profile</h1>

        {/* Profile completion */}
        <div className="bg-white rounded-lg p-6 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[#c46039] text-white flex items-center justify-center text-2xl font-bold">
              A
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">Alvin Chen</h2>
              <p className="text-gray-600 text-sm">Brown University, Class of 2028 · First-Gen</p>
            </div>
            <div className="text-right">
              <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-[#c46039]" style={{ width: '60%' }}></div>
              </div>
              <p className="font-bold">60% complete</p>
            </div>
          </div>
        </div>

        {/* Profile sections */}
        <div className="grid grid-cols-2 gap-6">
          {profileSections.map((section, idx) => (
            <div key={section.id} className="bg-white rounded-lg p-6 animate-fade-in" style={{ animationDelay: `${(idx + 2) * 0.1}s` }}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold">{section.title}</h3>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  section.status === 'Complete'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {section.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                {section.fields.map((field) => (
                  <div key={field.label}>
                    <p className="text-xs text-gray-600 font-semibold">{field.label}</p>
                    <p className={field.value === 'Not set' ? 'text-gray-400' : 'text-gray-900'}>
                      {field.value}
                    </p>
                  </div>
                ))}
              </div>

              <button onClick={() => handleEdit(section.id)} className="w-full py-2 text-[#c46039] font-semibold hover:bg-gray-50 rounded cursor-pointer">
                {editingSection === section.id ? 'Done' : 'Edit'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
