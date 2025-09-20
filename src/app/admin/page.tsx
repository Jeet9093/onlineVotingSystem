import { CreateElectionCard } from '@/components/voting/CreateElectionCard';
import { CloseElectionCard } from '@/components/voting/CloseElectionCard';

export default function AdminPage() {
  return (
    <>
      <header className="p-4 md:p-6 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Admin Zone</h1>
        <p className="text-muted-foreground mt-2 text-lg">Create new elections and close existing ones.</p>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CreateElectionCard />
          <CloseElectionCard />
        </div>
      </main>
    </>
  );
}
