'use client';

import { DemoSidebar } from './DemoSidebar';

/**
 * Main layout matching demo.html structure
 * White sidebar + gray content area
 */
export function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <DemoSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
