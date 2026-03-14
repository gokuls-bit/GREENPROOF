'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Home, BarChart2, Leaf, TrendingUp, Clock } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Emissions', href: '/analyze', icon: Leaf },
  { name: 'Optimization', href: '/optimization', icon: TrendingUp },
  { name: 'Trading', href: '/trading', icon: BarChart2 },
  { name: 'History', href: '/history', icon: Clock },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setIsOpen(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen w-64 bg-gray-950/80 backdrop-blur-2xl border-r border-white/10
          transform transition-transform duration-300 z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          flex flex-col
          shadow-xl
        `}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-white/10 relative overflow-hidden">
          {/* Subtle logo glow */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-500/10 to-transparent opacity-50 pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center font-bold text-white text-lg shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              G
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-wide">GreenProof</h1>
              <p className="text-xs text-emerald-400 font-medium tracking-wider uppercase">Carbon Intel</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => isMobile && setIsOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl
                      transition-all duration-300 font-medium text-sm
                      relative group overflow-hidden
                      ${isActive
                        ? 'bg-emerald-500/10 text-emerald-400 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)] border border-emerald-500/20'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                      }
                    `}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl p-4 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/20 rounded-full blur-xl group-hover:bg-emerald-500/30 transition-all duration-500" />
            <p className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">Carbon Saved</p>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight">2,450 kg</p>
          </div>
        </div>
      </aside>
    </>
  );
}
