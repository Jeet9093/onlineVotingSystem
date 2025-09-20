import { TallyResultsCard } from '@/components/voting/TallyResultsCard';

export default function ResultsPage() {
  return (
    <>
      <header className="p-4 md:p-6 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Tally & Results</h1>
        <p className="text-muted-foreground mt-2 text-lg">View the results for a completed election.</p>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <TallyResultsCard />
        </div>
      </main>
    </>
  );
}
