// components/layout/Header.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, LogOut, User } from 'lucide-react';

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Shield className="w-6 h-6 text-blue-600" />
          <span>CAREPATH-AI</span>
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link href="/profiles" className="hover:text-blue-600">Profiles</Link>
          <Link href="/about" className="hover:text-blue-600">About</Link>
          
          {status === 'loading' ? (
            <div className="w-20 h-10 bg-gray-100 animate-pulse rounded" />
          ) : session ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm">{session.user?.name}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}