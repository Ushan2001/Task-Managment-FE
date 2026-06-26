'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-context';
import { Loader2 } from 'lucide-react';

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-55 dark:bg-slate-950 text-slate-400">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
        <span className="text-sm font-medium">Checking authorization...</span>
      </div>
    </div>
  );
}
