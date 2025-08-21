import { listElections } from '@/lib/voting-core';
import { CreateElectionCard } from '@/components/voting/CreateElectionCard';
import { AddVoterCard } from '@/components/voting/AddVoterCard';
import { ElectionsList } from '@/components/voting/ElectionsList';
import { CastVoteCard } from '@/components/voting/CastVoteCard';
import { TallyResultsCard } from '@/components/voting/TallyResultsCard';
import { CloseElectionCard } from '@/components/voting/CloseElectionCard';
import { VerifyChainCard } from '@/components/voting/VerifyChainCard';

export default async function Home() {
  const elections = await listElections();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 md:p-6 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Virtual Polling</h1>
        <p className="text-muted-foreground mt-2 text-lg">A tamper-evident demo voting system built on a simple blockchain.</p>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CreateElectionCard />
          <AddVoterCard />
          <CastVoteCard />
          <TallyResultsCard />
          <CloseElectionCard />
          <VerifyChainCard />

          <div className="md:col-span-2 lg:col-span-3">
            <ElectionsList initialElections={elections} />
          </div>
        </div>
      </main>

      <footer className="p-4 text-center text-muted-foreground text-sm">
        <p>Local demo. Keep your voter/election IDs safe.</p>
      </footer>
    </div>
  );
}
