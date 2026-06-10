import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  active?: string;
}

export default function DashboardLayout({ children, active }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar active={active} />
      <main className="flex-1 ml-60 bg-[#f5f0e8]">
        {children}
      </main>
    </div>
  );
}
