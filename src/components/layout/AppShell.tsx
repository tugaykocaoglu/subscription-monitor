import { TopNav } from './TopNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-muted/40'>
      <TopNav />
      <main className='py-10'>
        <div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>{children}</div>
      </main>
    </div>
  );
}
