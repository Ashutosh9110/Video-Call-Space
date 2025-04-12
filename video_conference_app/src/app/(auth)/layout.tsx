import React from 'react';
import { BackgroundLines } from "@/components/ui/background-lines";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BackgroundLines>
      <div className="relative z-10">
        {children}
      </div>
    </BackgroundLines>
  );
} 