'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import Search from './Search';

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
      <div className="logo">
        <Link href="/" className="ui-text" style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-primary)', borderBottom: 'none' }}>
          My Space
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
        <div style={{ marginLeft: '1rem' }}>
          <Search />
        </div>
      </nav>
    </header>
  );
}
