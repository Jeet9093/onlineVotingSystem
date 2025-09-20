import { CastVoteCard } from '@/components/voting/CastVoteCard';

export default function CastVotePage() {
  return (
    <>
       <header className="p-4 md:p-6 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Virtual Voting Booth</h1>
        <p className="text-muted-foreground mt-2 text-lg">Verify your identity and cast your ballot.</p>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <CastVoteCard />
        </div>
      </main>
    </>
  );
}
