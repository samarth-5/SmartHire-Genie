'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { signInWithGoogle, logOut } from '../firebase/auth';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/firebase/config';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    if (!auth) 
      return;               
  
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        console.log('User logged in:', currentUser.displayName);
      }
    });
  
    return unsubscribe;             
  }, []);
  

    type FirebaseAuthError = {
      code?: string;
      message?: string;
    };
    
    const handleLogin = async () => {
      if (loading) return;
      setLoading(true);
    
      try {
        await signInWithGoogle();
      } catch (err: unknown) {
        const code = (err as FirebaseAuthError)?.code;
        if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
          toast.error('Sign-in cancelled by user!');
          console.info('Sign-in cancelled by user.');
        } else {
          toast.error('Login failed!');
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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!auth?.currentUser) {
      e.preventDefault();
      toast.error('Log in to get your resume reviewed!');
      return;
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-teal-200 backdrop-blur-md shadow-sm">
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
            <Link onClick={handleClick} href="/resume">Resume Review</Link>
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
          <Link href="/resume" onClick={() => setOpen(false)} className="cursor-pointer underline-offset-2">
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
