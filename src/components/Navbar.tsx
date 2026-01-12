'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { clsx } from 'clsx';
import Search from './Search';
import SearchModal from './SearchModal';
import MobileDrawer from './MobileDrawer';
import { Leaf, Search as SearchIcon, Menu, Sun, Moon, Monitor } from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Posts', path: '/posts' },
  { name: 'Projects', path: '/projects' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <>
      <header className="sticky top-0 z-[1000] bg-background-light dark:bg-background-dark backdrop-blur-lg border-b border-border-light dark:border-border-dark py-4 shadow-sm">
        <div className="w-full max-w-[960px] mx-auto px-4 flex justify-between items-center">
          {/* Logo - Always on the left */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-black text-[1.6rem] text-primary border-0 font-hand hover:bg-transparent ml-2.5"
          >
            <Leaf size={28} />
            Duong's
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive =
                item.path === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={clsx(isActive && 'active')}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Theme Toggle */}
            <button
              onClick={cycleTheme}
              aria-label="Toggle theme"
              className="bg-transparent border-0 p-2 cursor-pointer flex items-center justify-center rounded-lg transition-colors hover:bg-primary/10"
            >
              {theme === 'light' ? (
                <Moon size={20} className="text-gray-800 dark:text-gray-100" />
              ) : theme === 'dark' ? (
                <Monitor size={20} className="text-gray-800 dark:text-gray-100" />
              ) : (
                <Sun size={20} className="text-gray-800 dark:text-gray-100" />
              )}
            </button>

            <Search />
          </nav>

          {/* Mobile Navigation - Search + Hamburger on the right */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
              className="bg-transparent border-0 p-2 cursor-pointer flex items-center justify-center rounded-lg transition-colors hover:bg-primary/10"
            >
              <SearchIcon size={22} className="text-gray-800 dark:text-gray-100" />
            </button>
            <button
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={isDrawerOpen}
              className="bg-transparent border-0 p-2 cursor-pointer flex items-center justify-center rounded-lg transition-colors hover:bg-primary/10"
            >
              <Menu size={24} className="text-gray-800 dark:text-gray-100" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
