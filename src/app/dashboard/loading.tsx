import { SkeletonComponent } from '@/shared/ui/SkeletonComponent'

/**
 * The dashboard awaits `requireUser()`, which reads headers. That runtime
 * read needs a boundary above it — this is it.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-900 px-6 py-16 flex justify-center">
      <SkeletonComponent />
    </div>
  )
}
