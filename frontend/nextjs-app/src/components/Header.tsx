'use client';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import Link from 'next/link';
import { Button } from './ui/button';

export default function Header() {
  const { setShowAuthFlow, user } = useDynamicContext();

  return (
    <header className="absolute top-0 left-0 right-0 z-10 bg-transparent text-white">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold">
          HandyWriterz
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="hover:text-slate-300">Features</Link>
          <Link href="/#how-it-works" className="hover:text-slate-300">How It Works</Link>
          <Link href="/#testimonials" className="hover:text-slate-300">Testimonials</Link>
        </nav>
        <div>
          {user ? (
            <Link href="/chat">
              <Button variant="default">Go to App</Button>
            </Link>
          ) : (
            <Button onClick={() => setShowAuthFlow?.(true)} variant="default">
              Login / Sign Up
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}