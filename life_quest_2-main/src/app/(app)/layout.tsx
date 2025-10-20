
'use client';

import React from 'react';
import { EnhancedSidebarNav, FloatingActionButton } from '@/components/layout/EnhancedSidebarNav';
import Header from '@/components/layout/Header';
import { ParticleSystem } from '@/components/effects/ParticleSystem';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full relative">
      {/* Background Particle System */}
      <ParticleSystem type="stars" intensity={0.5} />
      
      <EnhancedSidebarNav />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="p-4 sm:p-6 lg:p-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      
      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
}
