"use client";

import { useFormState } from 'react-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { closeElection } from '@/app/actions';
import { FormSubmitButton } from './FormSubmitButton';
import { FormStatus } from './FormStatus';
import { Archive } from 'lucide-react';

const initialState = {};

export function CloseElectionCard() {
  const [state, formAction] = useFormState(closeElection, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Archive className="w-6 h-6 text-primary" />
          Close Election
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="close-electionId">Election ID</Label>
              <Input id="close-electionId" name="electionId" placeholder="Paste election UUID to close" required />
            </div>
            <FormSubmitButton variant="destructive">Close Election</FormSubmitButton>
            <FormStatus state={state} />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
