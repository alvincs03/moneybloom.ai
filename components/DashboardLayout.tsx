import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  // `active` is still accepted for backwards-compat but is now derived from the
  // current pathname inside Sidebar, so it is ignored.
  active?: string;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-60 bg-[#f5f0e8]">
        {children}
      </main>
    </div>
  );
}
