import type { Election } from '@/lib/voting-core';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ElectionItem } from './ElectionItem';
import { RefreshButton } from './RefreshButton';

type ElectionsListProps = {
  initialElections: Election[];
  filter?: 'all' | 'active';
};

export function ElectionsList({ initialElections, filter = 'all' }: ElectionsListProps) {
  const electionsToShow = filter === 'active' 
    ? initialElections.filter(election => election.active)
    : initialElections;

  const title = filter === 'active' ? 'Active Elections' : 'All Elections';
  const emptyMessage = filter === 'active' 
    ? 'No active elections found. Create one to get started!'
    : 'No elections have been created yet.';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline">{title}</CardTitle>
        <RefreshButton />
      </CardHeader>
      <CardContent>
        {electionsToShow.length > 0 ? (
          <div className="space-y-4">
            {electionsToShow.map((election) => (
              <ElectionItem key={election.election_id} election={election} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">{emptyMessage}</p>
        )}
      </CardContent>
    </Card>
  );
}
