import Link from 'next/link';
import Nav from '@/components/Nav';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <Nav />

      {/* Hero */}
      <section className="py-20 px-12 text-center animate-fade-in">
        <h1 className="text-5xl font-bold mb-4 text-[#c46039]" style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>Stop applying to 200 scholarships.<br />Win the 15 that fit you.</h1>
        <div className="h-1 bg-[#c46039] w-24 mx-auto mb-6 rounded line-accent"></div>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          A free tool for students. We rank scholarships by your odds of winning, not by award size.
        </p>
        <Link href="/dashboard" className="inline-block px-8 py-3 bg-[#c46039] text-white rounded-full font-medium hover:opacity-90">
          Find my scholarships →
        </Link>
      </section>

      {/* Problem section */}
      <section className="py-16 px-12 max-w-6xl mx-auto animate-fade-in">
        <h3 className="text-2xl font-bold text-center mb-12">THE PROBLEM</h3>
        <div className="grid grid-cols-3 gap-8">
          <div className="bg-white rounded-lg overflow-hidden animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="h-40 bg-gradient-to-br from-red-200 to-red-300 flex items-center justify-center">
              <div className="text-6xl">⚠️</div>
            </div>
            <div className="p-6 text-center">
              <p className="text-lg font-semibold mb-3">24/7 "matches", 200 scams</p>
              <p className="text-gray-600">Scholarship databases are full of expired listings, predatory fees, and false deadlines that harvest your email.</p>
            </div>
          </div>
          <div className="bg-white rounded-lg overflow-hidden animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="h-40 bg-gradient-to-br from-yellow-200 to-yellow-300 flex items-center justify-center">
              <div className="text-6xl">🔍</div>
            </div>
            <div className="p-6 text-center">
              <p className="text-lg font-semibold mb-3">Local ones are hidden</p>
              <p className="text-gray-600">Your county library club offers $12k with 10 applicants. Nobody talks about it. It exists.</p>
            </div>
          </div>
          <div className="bg-white rounded-lg overflow-hidden animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="h-40 bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
              <div className="text-6xl">⏰</div>
            </div>
            <div className="p-6 text-center">
              <p className="text-lg font-semibold mb-3">Deadlines pass quietly</p>
              <p className="text-gray-600">By the time you had read three essays, it's closed three weeks ago. It was legitimate. You missed it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-12 max-w-6xl mx-auto animate-fade-in">
        <h3 className="text-2xl font-bold text-center mb-12">HOW IT WORKS</h3>
        <div className="grid grid-cols-3 gap-8">
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-4">
              <div className="text-5xl">📝</div>
            </div>
            <div className="text-4xl font-bold text-[#c46039] mb-3">1</div>
            <p className="font-semibold mb-2">Tell us about you</p>
            <p className="text-gray-600 text-sm">25 questions, 5 minutes. The richer your profile, the better the matches.</p>
          </div>
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mb-4">
              <div className="text-5xl">⭐</div>
            </div>
            <div className="text-4xl font-bold text-[#c46039] mb-3">2</div>
            <p className="font-semibold mb-2">Get your matches</p>
            <p className="text-gray-600 text-sm">We rank by your odds of winning, not award size. Local and niche scholarships first.</p>
          </div>
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="h-32 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mb-4">
              <div className="text-5xl">✅</div>
            </div>
            <div className="text-4xl font-bold text-[#c46039] mb-3">3</div>
            <p className="font-semibold mb-2">Apply and track</p>
            <p className="text-gray-600 text-sm">One dashboard for everything. Essays, deadlines, and where you stand with each.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-12 bg-[#2a2a2a] text-white text-center animate-fade-in">
        <h2 className="text-3xl font-bold mb-4">The Common App opens August 1</h2>
        <p className="mb-8">Start your scholarship list today. Takes 5 minutes.</p>
        <Link href="/dashboard" className="inline-block px-8 py-3 bg-[#c46039] text-white rounded-full font-medium hover:opacity-90">
          Find my scholarships →
        </Link>
      </section>
    </div>
  );
}
