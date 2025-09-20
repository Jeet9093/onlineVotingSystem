import { AddVoterCard } from '@/components/voting/AddVoterCard';

export default function AddVoterPage() {
  return (
    <>
      <header className="p-4 md:p-6 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Register to Vote</h1>
        <p className="text-muted-foreground mt-2 text-lg">Provide your name and a clear photo of your face to register.</p>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <AddVoterCard />
        </div>
      </main>
    </>
  );
}
