import Nav from '@/components/Nav';
import Image from 'next/image';

export default function About() {
  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <Nav />

      <div className="max-w-4xl mx-auto px-12 py-16">
        <h1 className="text-5xl font-bold mb-12 animate-fade-in">
          <span>about </span>
          <span className="text-[#c46039]">moneybloom</span>
        </h1>

        <div className="flex gap-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <img
            src="/profile.jpg"
            alt="Alvin Chen"
            className="w-64 h-64 rounded-lg object-cover flex-shrink-0"
          />

          <div className="bg-white rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">ALVIN CHEN</h2>
          <p className="text-sm text-gray-600 font-semibold mb-6">Founder · moneybloom</p>

          <p className="text-gray-700 leading-relaxed mb-4">
            When I first applied to college, scholarships were not an easy fit to find. I spent months watching, and I would find scholarships that matched me perfectly. Others, I'd search through what looked like a hundred different applications on hundreds of different websites that seemed a bit suspect. That's why I built moneybloom. It's a free tool designed to help students find the scholarships that fit them best — not by award size, but by their odds of winning.
          </p>

          <p className="text-gray-700 leading-relaxed">
            That's why I built moneybloom. It's a free tool that helps students find scholarships they can actually win. In building this, I've also decided to partner with successful scholarship organizations to make sure that the scholarships I recommend are legitimate, not closed two years ago, and in fact open and taking applications. I hope it makes your summer a little bit less stressful.
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}
