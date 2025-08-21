"use client";

import { useFormState } from 'react-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { verifyChain } from '@/app/actions';
import { FormSubmitButton } from './FormSubmitButton';
import { FormStatus } from './FormStatus';
import { ShieldCheck } from 'lucide-react';

const initialState = {};

export function VerifyChainCard() {
  const [state, formAction] = useFormState(verifyChain, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-primary" />
          Verify Chain
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Check the integrity of the entire blockchain. This ensures no votes have been tampered with.
        </p>
        <form action={formAction}>
          <FormSubmitButton>Verify Blockchain</FormSubmitButton>
        </form>
        <FormStatus state={state} />
      </CardContent>
    </Card>
  );
}
