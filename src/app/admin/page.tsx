import { CreateElectionCard } from '@/components/voting/CreateElectionCard';
import { CloseElectionCard } from '@/components/voting/CloseElectionCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CirclePlus, Archive } from 'lucide-react';

export default function AdminPage() {
  return (
    <>
      <header className="p-4 md:p-6 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Admin Zone</h1>
        <p className="text-muted-foreground mt-2 text-lg">Create new elections and close existing ones.</p>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Shield className="w-6 h-6 text-primary" />
                  How to Use
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div className="flex gap-4">
                  <CirclePlus className="w-8 h-8 text-accent shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-foreground">1. Create an Election</h4>
                    <p>Use the "Create Election" form. The first time you do this, your captured photo will become the reference photo for all future admin actions.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Archive className="w-8 h-8 text-accent shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-foreground">2. Close an Election</h4>
                    <p>Use the "Close Election" form. Your face will be verified against the photo of the user who originally created that specific election.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <CreateElectionCard />
            <CloseElectionCard />
          </div>

        </div>
      </main>
    </>
  );
}
