import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonComponent() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full bg-slate-200" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px] bg-slate-200" />
        <Skeleton className="h-4 w-[200px] bg-slate-200" />
      </div>
    </div>
  )
}
