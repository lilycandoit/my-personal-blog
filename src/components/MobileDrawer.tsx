'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Home, FileText, FolderCode, User, Mail, Monitor, Moon, Sun } from 'lucide-react';
import { clsx } from 'clsx';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Posts', path: '/posts', icon: FileText },
  { name: 'Projects', path: '/projects', icon: FolderCode },
  { name: 'About', path: '/about', icon: User },
  { name: 'Contact', path: '/contact', icon: Mail },
];

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Focus management - trap focus inside drawer
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      const focusableElements = drawerRef.current.querySelectorAll(
        'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTab = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement?.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement?.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleTab);
      firstElement?.focus();

      return () => document.removeEventListener('keydown', handleTab);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          animation: 'fadeIn 0.2s ease-out',
        }}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '33.333vw',
          backgroundColor: 'white',
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.3s ease-out',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '1rem',
            fontFamily: 'var(--font-ui)',
            fontWeight: 700,
            color: 'var(--color-text)',
          }}>
            Menu
          </h2>
          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{
              background: 'none',
              border: 'none',
              padding: '0.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={20} color="var(--color-text)" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: '0.25rem 0', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/'
              ? pathname === '/'
              : pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onClose}
                className={clsx('drawer-nav-link', isActive && 'active')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1rem',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 500,
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                  backgroundColor: isActive ? 'rgba(93, 156, 236, 0.08)' : 'transparent',
                  borderBottom: 'none',
                  transition: 'background-color 0.2s, color 0.2s',
                }}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle Section */}
        <div style={{
          borderTop: '1px solid var(--color-border)',
          padding: '1rem',
        }}>
          <div style={{ marginBottom: '0.5rem', fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-muted)', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Theme
          </div>
          <div style={{ display: 'flex', gap: '0.375rem' }}>
            {[
              { label: 'Light', icon: Sun, value: 'light' },
              { label: 'Dark', icon: Moon, value: 'dark' },
              { label: 'System', icon: Monitor, value: 'system' },
            ].map(({ label, icon: Icon, value }) => (
              <button
                key={value}
                aria-label={`Switch to ${label} theme`}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.5rem 0.25rem',
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.65rem',
                  color: 'var(--color-text)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.backgroundColor = 'rgba(93, 156, 236, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
