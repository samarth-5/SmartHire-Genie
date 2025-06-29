'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import React, { ReactNode, useEffect, useState } from 'react';
import { signInWithGoogle, logOut, auth } from '../firebase/auth';
import { onAuthStateChanged, User } from 'firebase/auth';

type NavLinkProps = {
  href: string;
  children: ReactNode;
  special?: boolean;
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // 🔒 guards duplicate pop‑ups

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) console.log('User logged in:', currentUser.displayName);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    if (loading) return; // double‑click guard
    setLoading(true);

    try {
      await signInWithGoogle(); // will throw if popup closed or cancelled
    } catch (err: unknown) {
      const code = (err as any)?.code as string | undefined;
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        // harmless – user dismissed popup or duplicate click
        console.info('Sign‑in cancelled by user.');
      } else {
        console.error('Login failed!', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (err) {
      console.error('Logout failed!', err);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-teal-200/80 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between text-black">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-90 transition cursor-pointer"
          >
            <span className="font-heading text-xl font-bold leading-none">
              SmartHire<span className="text-teal-600">Genie</span>
            </span>
          </Link>

          <nav className="hidden sm:flex items-center gap-8 text-base md:text-lg font-medium">
            <NavLink href="/resume">Resume Review</NavLink>
            {user ? (
              <button
                onClick={handleLogout}
                className="rounded-full border border-black px-4 py-2 hover:bg-teal-300/50 transition cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleLogin}
                disabled={loading}
                className="rounded-full border border-black px-4 py-2 hover:bg-teal-300/50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in…' : 'Login'}
              </button>
            )}
          </nav>

          <button
            aria-label="Toggle menu"
            className="sm:hidden p-2 rounded-md hover:bg-teal-300/40 transition cursor-pointer"
            onClick={() => setOpen((p) => !p)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-teal-200/95 backdrop-blur-xl flex flex-col items-center justify-center gap-10 text-xl font-semibold text-black sm:hidden"
          onClick={() => setOpen(false)}
        >
          <Link href="/resume" onClick={() => setOpen(false)} className="cursor-pointer">
            Resume Review
          </Link>
          {user ? (
            <button
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
              className="cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                setOpen(false);
                handleLogin();
              }}
              disabled={loading}
              className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Login'}
            </button>
          )}
        </div>
      )}
    </>
  );
}

function NavLink({ href, children, special = false }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={
        special
          ? 'rounded-full border border-black px-4 py-2 hover:bg-teal-300/50 transition cursor-pointer'
          : 'relative after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:bg-teal-800 after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform cursor-pointer'
      }
    >
      {children}
    </Link>
  );
}
