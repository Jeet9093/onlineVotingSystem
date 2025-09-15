"use client";

import { useActionState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { addVoter } from '@/app/actions';
import { FormSubmitButton } from './FormSubmitButton';
import { FormStatus } from './FormStatus';
import { UserPlus } from 'lucide-react';

const initialState = {};

export function AddVoterCard() {
  const [state, formAction] = useActionState(addVoter, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-primary" />
          Add Voter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Voter Name</Label>
              <Input id="name" name="name" placeholder="e.g., John Doe" required />
            </div>
            <FormSubmitButton>Add Voter</FormSubmitButton>
            <FormStatus state={state} />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
