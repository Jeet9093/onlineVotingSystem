"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function RefreshButton() {
  const router = useRouter();

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <Button variant="outline" size="sm" onClick={handleRefresh}>
      <RefreshCw className="w-4 h-4 mr-2" />
      Refresh
    </Button>
  );
}
