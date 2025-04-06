'use client';

import { useEffect, useState } from 'react';

export default function TestEnvPage() {
  const [envVars, setEnvVars] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    setEnvVars({
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'not set',
      NEXT_PUBLIC_STREAM_API_KEY: process.env.NEXT_PUBLIC_STREAM_API_KEY || 'not set',
    });
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      <div className="bg-gray-100 p-4 rounded">
        <pre>
          {Object.entries(envVars).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {value ? `${value.substring(0, 4)}...` : 'undefined'}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
} 