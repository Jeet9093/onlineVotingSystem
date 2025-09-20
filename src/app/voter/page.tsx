import { AddVoterCard } from '@/components/voting/AddVoterCard';
import { CastVoteCard } from '@/components/voting/CastVoteCard';

export default function VoterPage() {
  return (
    <>
       <header className="p-4 md:p-6 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Voter Booth</h1>
        <p className="text-muted-foreground mt-2 text-lg">Register as a voter and cast your ballot.</p>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AddVoterCard />
          <CastVoteCard />
        </div>
      </main>
    </>
  );
}
