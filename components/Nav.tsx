'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Nav() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
    } px-12 py-6 grid grid-cols-3 items-center`}>
      <Link href="/" className="flex items-center gap-2 font-bold text-lg justify-self-start">
        <img src="/favicon.svg" alt="moneybloom" className="w-5 h-5" />
        <span>moneybloom</span>
      </Link>
      <div className="flex gap-8 text-sm justify-self-center">
        <Link href="/about" className="hover:text-[#c46039] transition">About</Link>
        <Link href="/faq" className="hover:text-[#c46039] transition">FAQ</Link>
        <Link href="/contact" className="hover:text-[#c46039] transition">Contact</Link>
      </div>
      <div className="flex gap-4 items-center justify-self-end">
        {session?.user ? (
          <>
            <span className="text-sm text-gray-600">{session.user.email}</span>
            <button onClick={() => signOut({ redirectTo: '/' })} className="px-6 py-2 bg-gray-200 text-gray-900 rounded-full text-sm font-medium hover:bg-gray-300 transition">
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/signin" className="px-6 py-2 text-gray-700 hover:text-[#c46039] text-sm font-medium transition">
              Sign In
            </Link>
            <Link href="/signup" className="px-6 py-2 bg-[#c46039] text-white rounded-full text-sm font-medium hover:opacity-90 transition">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
