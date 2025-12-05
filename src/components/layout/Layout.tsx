import React, { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t-4 border-border py-4 text-center">
        <p className="font-mono text-sm text-muted-foreground">
          SNAKE ARENA © 2024
        </p>
      </footer>
    </div>
  );
}
