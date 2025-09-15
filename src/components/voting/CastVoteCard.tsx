"use client";

import { useActionState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { castVote } from '@/app/actions';
import { FormSubmitButton } from './FormSubmitButton';
import { FormStatus } from './FormStatus';
import { Vote } from 'lucide-react';

const initialState = {};

export function CastVoteCard() {
  const [state, formAction] = useActionState(castVote, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Vote className="w-6 h-6 text-primary" />
          Cast Vote
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="voterId">Voter ID</Label>
              <Input id="voterId" name="voterId" placeholder="Paste voter UUID here" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="electionId">Election ID</Label>
              <Input id="electionId" name="electionId" placeholder="Paste election UUID here" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="candidateId">Candidate ID</Label>
              <Input id="candidateId" name="candidateId" placeholder="Paste candidate UUID here" required />
            </div>
            <FormSubmitButton>Cast Vote</FormSubmitButton>
            <FormStatus state={state} />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
