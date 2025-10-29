import type { Election } from '@/lib/voting-core';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ElectionItem } from './ElectionItem';
import { RefreshButton } from './RefreshButton';

type ElectionsListProps = {
  initialElections: Election[];
};

export function ElectionsList({ initialElections }: ElectionsListProps) {
  const activeElections = initialElections.filter(election => election.active);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline">Elections</CardTitle>
        <RefreshButton />
      </CardHeader>
      <CardContent>
        {activeElections.length > 0 ? (
          <div className="space-y-4">
            {activeElections.map((election) => (
              <ElectionItem key={election.election_id} election={election} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">No active elections found. Create one to get started!</p>
        )}
      </CardContent>
    </Card>
  );
}
