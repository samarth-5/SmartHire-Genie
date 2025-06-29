import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import React, { ReactNode, useState } from 'react'

type NavLinkProps = {
    href: string;
    children: ReactNode;
    special?: boolean;
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
   
  return (
    <>
        <header className="fixed top-0 left-0 w-full z-50 bg-teal-200/80 backdrop-blur-md shadow-sm">
            <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between text-black">
              <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
               <span className="font-heading text-xl font-bold leading-none">
                     SmartHire<span className="text-teal-600">Genie</span>
                   </span>
              </Link>

              <nav className="hidden sm:flex items-center gap-8 text-base md:text-lg font-medium">
                  <NavLink href="/resume">Resume Review</NavLink>
                  <NavLink href="/login" special>Login</NavLink>
              </nav>
     
              <button
                  aria-label="Toggle menu"
                  className="sm:hidden p-2 rounded-md hover:bg-teal-300/40 transition"
                  onClick={() => setOpen(!open)}
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
            <Link href="/resume" onClick={() => setOpen(false)} className="hover:translate-y-[-2px] transition">
                Resume Review
            </Link>
            <Link href="/login" onClick={() => setOpen(false)} className="hover:translate-y-[-2px] transition">
                Login
            </Link>
          </div>
        )}
    </>
);}

function NavLink({ href, children, special = false }: NavLinkProps) {
    return (
      <Link
        href={href}
        className={
          special
            ? 'rounded-full border border-black px-4 py-2 hover:bg-teal-300/50 transition'
            : 'relative after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:bg-teal-800 after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform'
        }
      >
        {children}
      </Link>
    );
  }
