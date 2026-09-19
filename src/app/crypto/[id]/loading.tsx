import { SkeletonComponent } from '@/shared/ui/SkeletonComponent'

/**
 * `loading.tsx` is the <Suspense> boundary Next puts around this segment's
 * page. Under cacheComponents it is not cosmetic: a page that awaits a
 * runtime API without a boundary above it fails the build.
 */
export default function Loading() {
  return (
    <div className="bg-slate-400 min-h-screen p-8 sm:p-20 flex justify-center">
      <SkeletonComponent />
    </div>
  )
}
