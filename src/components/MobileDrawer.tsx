'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Home, FileText, FolderCode, User, Mail, Monitor, Moon, Sun } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from 'next-themes';

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
  const { theme, setTheme } = useTheme();

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
        className="fixed inset-0 bg-black/50 z-[9998] animate-[fadeIn_0.2s_ease-out]"
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        className="fixed top-0 right-0 bottom-0 w-[40vw] bg-surface-light dark:bg-surface-dark shadow-[-4px_0_24px_rgba(0,0,0,0.15)] z-[9999] flex flex-col slide-in-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
          <h2 className="m-0 text-base font-bold font-hand text-gray-800 dark:text-gray-100">
            Menu
          </h2>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="bg-transparent border-0 p-1 cursor-pointer flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} className="text-gray-800 dark:text-gray-100" />
          </button>
        </div>

        {/* Navigation Links and Theme Section */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav>
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
                  className={clsx(
                    'flex items-center gap-3 px-4 py-2.5 text-base font-hand font-medium border-0 transition-all',
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-800 dark:text-gray-100 hover:bg-background-light dark:hover:bg-gray-700 hover:text-primary'
                  )}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle Section - Right after nav items */}
          <div className="border-t border-border-light dark:border-border-dark p-4 mt-4">
            <div className="mb-3 text-xs font-semibold text-muted-light dark:text-muted-dark font-hand uppercase tracking-wider">
              Theme
            </div>
            <div className="flex gap-2 items-center justify-center">
              {[
                { label: 'Light', icon: Sun, value: 'light' },
                { label: 'Dark', icon: Moon, value: 'dark' },
                { label: 'System', icon: Monitor, value: 'system' },
              ].map(({ label, icon: Icon, value }) => {
                const isActive = theme === value;
                return (
                  <button
                    key={value}
                    onClick={() => setTheme(value)}
                    aria-label={`Switch to ${label} theme`}
                    className={clsx(
                      'flex-1 flex flex-col items-center gap-2 p-2 rounded-lg cursor-pointer font-hand text-xs transition-all border',
                      isActive
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-transparent border-border-light dark:border-border-dark text-gray-800 dark:text-gray-100 hover:border-primary hover:bg-primary/5'
                    )}
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
