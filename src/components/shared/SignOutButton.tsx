"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

export default function SignOutButton() {
  const router = useRouter();
  const cache = useQueryClient();
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);
  async function signOut() {
    setPending(true);
    setError(false);
    try {
      const res = await fetch('/api/auth/login', { method: 'DELETE' });
      if (!res.ok) throw new Error('Sign out failed');
      cache.clear();
      router.replace('/login');
      router.refresh();
    } catch {
      setError(true);
      setPending(false);
    }
  }
  return <div><button type="button" disabled={pending} onClick={signOut} className="text-sm font-semibold text-error disabled:opacity-50">{pending ? 'Signing out…' : 'Sign out'}</button>{error && <p role="alert" className="text-xs text-error">Unable to sign out. Please try again.</p>}</div>;
}
