import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="flex items-center justify-between px-12 py-6 bg-white/50">
      <Link href="/" className="flex items-center gap-2 font-bold text-lg">
        <img src="/favicon.svg" alt="moneybloom" className="w-5 h-5" />
        <span>moneybloom</span>
      </Link>
      <div className="flex gap-8 text-sm">
        <Link href="/about" className="hover:text-[#c46039] transition">About</Link>
        <Link href="/faq" className="hover:text-[#c46039] transition">FAQ</Link>
        <Link href="/contact" className="hover:text-[#c46039] transition">Contact</Link>
      </div>
      <Link href="/dashboard" className="px-6 py-2 bg-[#c46039] text-white rounded-full text-sm font-medium hover:opacity-90 transition">
        Dashboard
      </Link>
    </nav>
  );
}
