import Image from "next/image";

export function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2">
        <Image
          src="/logo.svg"
          alt="Loading..."
          width={48}
          height={48}
          className="animate-pulse"
          priority
        />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}