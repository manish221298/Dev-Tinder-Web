'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getToken } from '@/lib/utils/constants';
import ProfileIcon from '@/components/customicon/ProfileIcon';
import ConnectionsIcon from '@/components/customicon/ConnectionsIcon';
import RequestsIcon from '@/components/customicon/RequestsIcon';
import UploadIcon from '@/components/customicon/UploadIcon';
import QuizIcon from '@/components/customicon/QuizIcon';
import ResultsIcon from '@/components/customicon/ResultsIcon';
import LogoutIcon from '@/components/customicon/LogoutIcon';
import MenuIcon from '@/components/customicon/MenuIcon';
import CloseIcon from '@/components/customicon/CloseIcon';
import Link from 'next/link';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get token only after component is mounted to avoid hydration issues
  const token = mounted ? getToken() : null;

  // Don't show sidebar on login page or if no token
  if (!mounted || pathname === '/login' || !token) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const navigationItems = [
    {
      path: '/profile',
      label: 'Profile',
      icon: ProfileIcon,
    },
    {
      path: '/connections',
      label: 'Connections',
      icon: ConnectionsIcon,
    },
    {
      path: '/requests',
      label: 'Requests',
      icon: RequestsIcon,
    },
    {
      path: '/uploadpdf',
      label: 'Upload PDF',
      icon: UploadIcon,
    },
    {
      path: '/quiz',
      label: 'Quiz',
      icon: QuizIcon,
    },
    {
      path: '/result',
      label: 'Results',
      icon: ResultsIcon,
    },
  ];

  const isActive = (path) => {
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-20 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white/95 backdrop-blur-md shadow-2xl border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 pt-6">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        active
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          active ? 'text-white' : 'text-gray-600'
                        }`}
                      />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogoutIcon className="h-4 w-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Spacer for desktop sidebar - only show when sidebar is visible */}
      {mounted && token && pathname !== '/login' && (
        <div className="hidden lg:block w-64"></div>
      )}
    </>
  );
};

export default Sidebar;

