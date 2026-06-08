"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <div className="mx-auto max-w-[92%] px-4 sm:px-8 lg:px-1 py-6 flex items-center justify-between">
        
       
        <h2 className="text-white font-semibold text-lg sm:text-xl">
          Learn X Change
        </h2>

       
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white">
          <Link href="/" className="hover:text-purple-300 transition">
            Home
          </Link>
          <Link href="/contact" className="hover:text-purple-300 transition">
            Contact
          </Link>
          <Link href="/login" className="hover:text-purple-300 transition">
            Login
          </Link>
          <Link href="/register" className="hover:text-purple-300 transition">
            Register
          </Link>
        </nav>

        
        <button
          className="md:hidden text-white text-3xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      
      {open && (
        <div className="md:hidden bg-black/40 backdrop-blur-md px-6 py-6 space-y-4 text-white text-sm font-medium">
          <Link
            href="/"
            className="block hover:text-purple-300 transition"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>

          <Link
            href="/about"
            className="block hover:text-purple-300 transition"
            onClick={() => setOpen(false)}
          >
            About
          </Link>

          <Link
            href="/login"
            className="block hover:text-purple-300 transition"
            onClick={() => setOpen(false)}
          >
            Login
          </Link>

          <Link
            href="/register"
            className="block hover:text-purple-300 transition"
            onClick={() => setOpen(false)}
          >
            Register
          </Link>
        </div>
      )}
    </header>
  );
}