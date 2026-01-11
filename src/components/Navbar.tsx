'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import Search from './Search';
import SearchModal from './SearchModal';
import MobileDrawer from './MobileDrawer';
import { Leaf, Search as SearchIcon, Menu } from 'lucide-react';


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

  return (
    <>
      <header className="sticky-navbar" style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(248, 250, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--color-border)',
        padding: '1rem 0',
        margin: 0,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      }}>
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {/* Logo - Always on the left */}
          <Link href="/" className="ui-text logo" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 900,
            fontSize: '1.6rem',
            color: 'var(--color-primary)',
            borderBottom: 'none'
          }}>
            <Leaf size={28}  />
            Duong's
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
          }}>
            {navItems.map((item) => {
              const isActive = item.path === '/'
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
            <Search />
          </nav>

          {/* Mobile Navigation - Search + Hamburger on the right */}
          <div className="mobile-nav" style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
              style={{
                background: 'none',
                border: 'none',
                padding: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(93, 156, 236, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <SearchIcon size={22} color="var(--color-text)" />
            </button>
            <button
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={isDrawerOpen}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(93, 156, 236, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Menu size={24} color="var(--color-text)" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
