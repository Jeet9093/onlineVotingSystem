import { CreateElectionCard } from '@/components/voting/CreateElectionCard';
import { CloseElectionCard } from '@/components/voting/CloseElectionCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CirclePlus, Archive } from 'lucide-react';
import { ElectionsList } from '@/components/voting/ElectionsList';
import { listElections } from '@/lib/voting-core';

export default async function AdminPage() {
  const elections = await listElections();

  return (
    <>
      <header className="p-4 md:p-6 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Admin Zone</h1>
        <p className="text-muted-foreground mt-2 text-lg">Manage all election activities.</p>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="space-y-8">
            <CreateElectionCard />
            <CloseElectionCard />
          </div>

          <div className="space-y-8">
            <ElectionsList initialElections={elections} filter="active" />
          </div>

        </div>
      </main>
    </>
  );
}
