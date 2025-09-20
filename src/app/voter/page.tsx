import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, UserPlus, Vote } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function VoterPage() {
  return (
    <>
       <header className="p-4 md:p-6 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Voter Hub</h1>
        <p className="text-muted-foreground mt-2 text-lg">Register as a new voter or cast your ballot in an election.</p>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-primary" />
                Register to Vote
              </CardTitle>
              <CardDescription>
                First time here? Register as a voter to be able to participate in elections.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-end">
              <Link href="/voter/add" passHref className='mt-auto'>
                <Button className="w-full">
                  Go to Registration <ArrowRight />
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Vote className="w-6 h-6 text-primary" />
                Cast Your Vote
              </CardTitle>
              <CardDescription>
                Already registered? Proceed to the virtual booth to cast your ballot.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-end">
              <Link href="/voter/cast" passHref className='mt-auto'>
                <Button className="w-full">
                  Go to Voting Booth <ArrowRight />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
