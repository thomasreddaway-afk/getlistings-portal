'use client';

import { DemoSidebar } from './DemoSidebar';

interface DemoLayoutProps {
  children: React.ReactNode;
  currentPage?: string; // Optional - sidebar uses pathname for active state
}

/**
 * Main layout matching demo.html structure
 * White sidebar + gray content area
 */
export function DemoLayout({ children, currentPage }: DemoLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <DemoSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
