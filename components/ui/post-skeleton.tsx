import { Skeleton } from './skeleton';

export function PostCardSkeleton() {
  return (
    <div className='flex flex-col gap-4 p-4 border rounded-lg'>
      <Skeleton className='h-48 w-full' />
      <Skeleton className='h-8 w-3/4' />
      <Skeleton className='h-4 w-full' />
      <Skeleton className='h-4 w-5/6' />
      <div className='flex items-center gap-2 mt-2'>
        <Skeleton className='h-10 w-10 rounded-full' />
        <div className='flex-1'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-3 w-32 mt-1' />
        </div>
      </div>
    </div>
  );
}

export function PostPageSkeleton() {
  return (
    <div className='mx-auto max-w-5xl px-6 py-12'>
      <Skeleton className='h-12 w-3/4 mx-auto mb-8' />
      <div className='flex items-center justify-center gap-4 mb-16'>
        <Skeleton className='h-14 w-14 rounded-full' />
        <div>
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-3 w-24 mt-2' />
        </div>
      </div>
      <Skeleton className='h-64 w-full max-w-2xl mx-auto mb-8' />
      <div className='prose dark:prose-dark mx-auto space-y-4'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-5/6' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-4/5' />
        <Skeleton className='h-8 w-3/4 mt-8' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-3/4' />
      </div>
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <div className='flex flex-col gap-4 p-4 h-[50vh]'>
      {[...Array(5)].map((_, i) => (
        <div key={i} className='flex gap-4 p-3 border rounded-lg'>
          <Skeleton className='h-16 w-16 shrink-0' />
          <div className='flex-1 space-y-2'>
            <Skeleton className='h-5 w-3/4' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-3 w-1/2' />
          </div>
        </div>
      ))}
    </div>
  );
}
