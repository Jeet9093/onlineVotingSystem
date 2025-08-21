import type { Election } from '@/lib/voting-core';
import { Badge } from '@/components/ui/badge';
import { CopyableId } from './CopyableId';

export function ElectionItem({ election }: { election: Election }) {
  return (
    <div className="border rounded-lg p-4 bg-background/50">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-headline text-lg font-semibold">{election.title}</h3>
        <Badge variant={election.active ? 'default' : 'secondary'} className={election.active ? 'bg-accent text-accent-foreground' : ''}>
          {election.active ? 'Active' : 'Closed'}
        </Badge>
      </div>
      <div className="space-y-2">
        <CopyableId label="Election ID" id={election.election_id} />
        <div className="pl-4 border-l-2 ml-2 space-y-2 mt-2 pt-2">
            <h4 className="text-sm font-medium text-muted-foreground">Candidates:</h4>
            {election.candidates.map((candidate) => (
                <CopyableId key={candidate.id} label={candidate.name} id={candidate.id} />
            ))}
        </div>
      </div>
    </div>
  );
}
