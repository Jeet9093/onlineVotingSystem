import { listElections } from '@/lib/voting-core';
import { ElectionsList } from '@/components/voting/ElectionsList';
import { VerifyChainCard } from '@/components/voting/VerifyChainCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart2, UserPlus, ShieldPlus } from 'lucide-react';

export default async function Home() {
  const elections = await listElections();

  return (
    <>
      <header className="p-4 md:p-6 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Virtual Polling</h1>
        <p className="text-muted-foreground mt-2 text-lg">A tamper-evident demo voting system built on a simple blockchain.</p>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                  <CardTitle className="font-headline">Get Started</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <Link href="/admin" passHref>
                      <Button variant="outline" className="w-full h-full p-6 flex flex-col items-start text-left justify-start gap-2">
                         <ShieldPlus className="w-8 h-8 text-primary" />
                         <span className="font-bold text-lg">Admin Zone</span>
                         <span className="text-sm text-muted-foreground">Create and close elections.</span>
                         <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                  </Link>
                  <Link href="/voter" passHref>
                      <Button variant="outline" className="w-full h-full p-6 flex flex-col items-start text-left justify-start gap-2">
                          <UserPlus className="w-8 h-8 text-primary" />
                          <span className="font-bold text-lg">Voter Hub</span>
                          <span className="text-sm text-muted-foreground">Register as a voter or cast your vote.</span>
                          <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                  </Link>
                   <Link href="/results" passHref>
                      <Button variant="outline" className="w-full h-full p-6 flex flex-col items-start text-left justify-start gap-2">
                          <BarChart2 className="w-8 h-8 text-primary" />
                          <span className="font-bold text-lg">Tally & Results</span>
                          <span className="text-sm text-muted-foreground">View the results of an election.</span>
                          <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                  </Link>
              </CardContent>
          </Card>
          
          <div className="md:col-span-2">
            <ElectionsList initialElections={elections} />
          </div>

          <VerifyChainCard />

        </div>
      </main>
    </>
  );
}
