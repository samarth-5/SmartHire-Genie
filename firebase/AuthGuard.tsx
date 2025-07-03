'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      toast.error('Please log in to view that page!', { id: 'auth-guard' });
      router.replace('/'); // sends them home
    }
  }, [user, loading, router]);

  // While we’re checking auth, avoid a flash of the protected page
  if (loading || !user) return null;

  return <>{children}</>;
}
