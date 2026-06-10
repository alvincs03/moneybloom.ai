'use client';

import { useState } from 'react';
import Nav from '@/components/Nav';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiry: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <Nav />

      <div className="max-w-2xl mx-auto px-12 py-16">
        <h1 className="text-5xl font-bold mb-4 animate-fade-in">Contact Us</h1>
        <p className="text-lg text-gray-600 mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Have a question or feedback? We'd love to hear from you.
        </p>

        {submitted ? (
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-green-700 mb-2">Thank you!</h2>
            <p className="text-gray-700 mb-4">
              We've received your inquiry. I'll get back to you in 3-5 business days.
            </p>
            <div className="bg-white rounded-lg p-6 text-sm text-gray-600">
              <p className="mb-2"><strong>Name:</strong> {formData.name}</p>
              <p className="mb-2"><strong>Email:</strong> {formData.email}</p>
              <p><strong>Inquiry:</strong></p>
              <p className="mt-2 whitespace-pre-wrap">{formData.inquiry}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c46039]"
                placeholder="Your name"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c46039]"
                placeholder="your.email@example.com"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="inquiry" className="block text-sm font-semibold mb-2">
                Inquiry
              </label>
              <textarea
                id="inquiry"
                name="inquiry"
                value={formData.inquiry}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c46039] resize-none"
                placeholder="Tell us what's on your mind..."
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#c46039] text-white rounded-full font-semibold hover:opacity-90 transition"
            >
              Send Inquiry
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
