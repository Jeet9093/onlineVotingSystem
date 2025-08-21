type FormStatusProps = {
  state: {
    message?: string;
    error?: string;
  };
};

export function FormStatus({ state }: FormStatusProps) {
  if (!state?.message && !state?.error) return null;

  const isError = !!state.error;
  const message = state.error || state.message;

  return (
    <div
      className={`mt-4 text-sm p-3 rounded-md border ${
        isError ? 'bg-destructive/10 border-destructive/20 text-destructive' : 'bg-primary/10 border-primary/20 text-primary-foreground/80'
      }`}
    >
      <pre className="whitespace-pre-wrap break-words font-sans">{message}</pre>
    </div>
  );
}
