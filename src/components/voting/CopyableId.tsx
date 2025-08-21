"use client";

import { useState, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type CopyableIdProps = {
  label: string;
  id: string;
  className?: string;
};

export const CopyableId: FC<CopyableIdProps> = ({ label, id, className }) => {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "font-mono text-xs text-muted-foreground bg-black/30 p-2 rounded-md flex items-center justify-between gap-2",
        className
      )}
    >
      <span className="truncate">
        <span className="font-sans font-medium text-foreground/80">{label}: </span>
        {id}
      </span>
      <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={onCopy} aria-label={`Copy ${label}`}>
        {copied ? (
          <Check className="h-3 w-3 text-green-500" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
}
