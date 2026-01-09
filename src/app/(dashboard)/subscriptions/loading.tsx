import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function SubscriptionsLoading() {
  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <div className='flex items-center justify-between'>
        <div>
          <Skeleton className='h-8 w-[200px] mb-2' />
          <Skeleton className='h-4 w-[300px]' />
        </div>
        <Skeleton className='h-10 w-[120px]' />
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className='h-4 w-[100px]' />
              </TableHead>
              <TableHead>
                <Skeleton className='h-4 w-[80px]' />
              </TableHead>
              <TableHead>
                <Skeleton className='h-4 w-[80px]' />
              </TableHead>
              <TableHead>
                <Skeleton className='h-4 w-[80px]' />
              </TableHead>
              <TableHead className='text-right'>
                <Skeleton className='h-4 w-[50px] ml-auto' />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <Skeleton className='h-10 w-10 rounded-md' />
                    <div className='space-y-1'>
                      <Skeleton className='h-4 w-[120px]' />
                      <Skeleton className='h-3 w-[80px]' />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className='h-6 w-[80px] rounded-full' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-[60px]' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-[80px]' />
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-2'>
                    <Skeleton className='h-8 w-8' />
                    <Skeleton className='h-8 w-8' />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
