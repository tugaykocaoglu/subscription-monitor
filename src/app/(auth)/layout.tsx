import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-muted/40'>
      <div className='flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
          <div className='flex justify-center'>
            <Link href='/' className='text-3xl font-bold text-primary'>
              SubMonitor
            </Link>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
