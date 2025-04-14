import React from 'react';
// import { BackgroundLines } from "@/components/ui/background-lines";
import { GridBackground } from '@/components/ui/gridBackground';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <BackgroundLines>
    <GridBackground>
      <div className="relative z-10">
        {children}
      </div>
    </GridBackground>
    // </BackgroundLines>
  );
} 