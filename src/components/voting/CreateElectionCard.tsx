"use client";

import { useActionState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { createElection } from '@/app/actions';
import { FormSubmitButton } from './FormSubmitButton';
import { FormStatus } from './FormStatus';
import { CirclePlus } from 'lucide-react';

const initialState = {};

export function CreateElectionCard() {
  const [state, formAction] = useActionState(createElection, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <CirclePlus className="w-6 h-6 text-primary" />
          Create Election
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Election Title</Label>
              <Input id="title" name="title" placeholder="e.g., Class Representative" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="candidates">Candidates</Label>
              <Input id="candidates" name="candidates" placeholder="Alice, Bob, Charlie" required />
              <p className="text-xs text-muted-foreground">Enter names separated by commas.</p>
            </div>
            <FormSubmitButton>Create Election</FormSubmitButton>
            <FormStatus state={state} />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
