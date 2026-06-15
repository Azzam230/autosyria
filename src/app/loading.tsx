export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Skeleton Hero */}
      <div className="rounded-2xl bg-muted/20 h-[250px] md:h-[350px] animate-pulse" />

      {/* Skeleton Filters */}
      <div className="flex gap-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-10 w-28 rounded-lg bg-muted/20 animate-pulse" />
        ))}
      </div>

      {/* Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="aspect-[16/9] bg-muted/20 animate-pulse" />
            <div className="p-3 space-y-3">
              <div className="h-5 w-24 bg-muted/20 rounded animate-pulse" />
              <div className="h-4 w-40 bg-muted/20 rounded animate-pulse" />
              <div className="h-3 w-32 bg-muted/20 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
