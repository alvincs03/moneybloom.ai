'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

const baseItems = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { id: 'scholarships', label: 'Scholarships', href: '/dashboard/scholarships' },
  { id: 'applications', label: 'Applications', href: '/dashboard/applications' },
  { id: 'deadlines', label: 'Deadlines', href: '/dashboard/deadlines' },
  { id: 'profile', label: 'Profile', href: '/dashboard/profile' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const email = session?.user?.email ?? '';
  const name = session?.user?.name || email.split('@')[0] || 'Account';
  const initial = name.charAt(0).toUpperCase();

  const items = [...baseItems];
  if (session?.user?.isAdmin) {
    items.push({ id: 'admin', label: 'Review Scholarships', href: '/admin/scholarships' });
  }

  // Highlight the item whose href is the longest matching prefix of the path.
  const active = items.reduce<string | null>((best, item) => {
    const match = pathname === item.href || pathname.startsWith(item.href + '/');
    if (!match) return best;
    const bestHref = items.find((i) => i.id === best)?.href ?? '';
    return item.href.length >= bestHref.length ? item.id : best;
  }, null);

  return (
    <aside className="w-60 bg-[#3c3c3c] text-white flex flex-col fixed left-0 top-0 h-screen">
      <div className="p-6 border-b border-gray-700">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <img src="/favicon.svg" alt="moneybloom" className="w-6 h-6" />
          <span>moneybloom</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`block px-4 py-3 rounded transition ${
              active === item.id
                ? 'bg-[#c46039] text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#c46039] rounded-full flex items-center justify-center text-sm font-bold">
          {initial}
        </div>
        <div className="text-sm overflow-hidden">
          <p className="font-medium truncate">{name}</p>
          <p className="text-gray-400 text-xs truncate">{email}</p>
        </div>
      </div>
    </aside>
  );
}
