
import { CastVoteCard } from '@/components/voting/CastVoteCard';
import { ElectionsList } from '@/components/voting/ElectionsList';
import { listElections } from '@/lib/voting-core';

export default async function CastVotePage() {
  const elections = await listElections();

  return (
    <>
       <header className="p-4 md:p-6 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Virtual Voting Booth</h1>
        <p className="text-muted-foreground mt-2 text-lg">Verify your identity and cast your ballot.</p>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <CastVoteCard />
          </div>
          <div className="lg:col-span-2">
            <ElectionsList initialElections={elections} filter="active" />
          </div>
        </div>
      </main>
    </>
  );
}
