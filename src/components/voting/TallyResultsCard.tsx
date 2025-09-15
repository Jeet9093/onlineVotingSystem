"use client";

import { useActionState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { tallyElection } from '@/app/actions';
import { FormSubmitButton } from './FormSubmitButton';
import { FormStatus } from './FormStatus';
import { BarChart2 } from 'lucide-react';

const initialState = { data: null, error: null };

export function TallyResultsCard() {
  const [state, formAction] = useActionState(tallyElection, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-primary" />
          Tally Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tally-electionId">Election ID</Label>
              <Input id="tally-electionId" name="electionId" placeholder="Paste election UUID to tally" required />
            </div>
            <FormSubmitButton>Get Tally</FormSubmitButton>
          </div>
        </form>

        {state.error && <FormStatus state={state} />}

        {state.data && (
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold text-lg">{state.data.title}</h3>
            <p className="text-sm text-muted-foreground">Total Votes: {state.data.total}</p>
            <div className="space-y-3">
              {state.data.results.map((result) => {
                const percentage = state.data.total > 0 ? (result.votes / state.data.total) * 100 : 0;
                return (
                  <div key={result.candidate_id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{result.name}</span>
                      <span className="text-muted-foreground">{result.votes} votes ({percentage.toFixed(1)}%)</span>
                    </div>
                    <Progress value={percentage} aria-label={`${result.name} vote percentage`} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
