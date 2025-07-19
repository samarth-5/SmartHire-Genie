import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-teal-100 pb-3 text-center">
    <Link
      href="/about"
      className="text-sm font-bold text-black transition hover:text-black/80 hover:underline"
    >
      © 2025 Developed by @Samarth. All rights reserved.
    </Link>
  </footer>
  )
}
