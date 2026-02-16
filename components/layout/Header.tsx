import Link from 'next/link';
import { Shield } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Shield className="w-6 h-6 text-blue-600" />
          <span>CAREPATH-AI</span>
        </Link>
        
        <nav className="flex gap-6">
          <Link href="/profiles" className="hover:text-blue-600">Profiles</Link>
          <Link href="/about" className="hover:text-blue-600">About</Link>
          <Link href="/about/safety" className="hover:text-blue-600">Safety</Link>
        </nav>
      </div>
    </header>
  );
}