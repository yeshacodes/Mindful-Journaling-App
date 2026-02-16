import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { Home, BookOpen, PlusCircle, BarChart3, Settings } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

const navItems = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/entries', icon: BookOpen, label: 'Entries' },
  { to: '/entry/new', icon: PlusCircle, label: 'New Entry' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-semibold text-slate-800">Mindful</h1>
          <p className="text-sm text-slate-500 mt-1">Micro-Journaling</p>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="size-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40">
        <ul className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                    isActive ? 'text-blue-600' : 'text-slate-500'
                  }`}
                >
                  <Icon className="size-5" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}