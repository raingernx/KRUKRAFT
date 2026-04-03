export function LoginFormSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4">
      <div className="mx-auto w-full max-w-sm space-y-4">
        <div className="mx-auto h-8 w-32 animate-pulse rounded-lg bg-surface-200" />
        <div className="h-12 w-full animate-pulse rounded-xl bg-surface-200" />
        <div className="h-12 w-full animate-pulse rounded-xl bg-surface-200" />
        <div className="h-12 w-full animate-pulse rounded-xl bg-surface-200" />
      </div>
    </div>
  );
}
