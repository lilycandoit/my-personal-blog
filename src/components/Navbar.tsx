'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import Search from './Search';
import { Leaf } from 'lucide-react';


const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Posts', path: '/posts' },
  { name: 'Projects', path: '/projects' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header>
      <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '50px', marginRight: '50px' }}>
        <Link href="/" className="ui-text" style={{
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
      </div>

      <nav>
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
        <div style={{ marginLeft: '0.5rem' }}>
          <Search />
        </div>
      </nav>
    </header>
  );
}
