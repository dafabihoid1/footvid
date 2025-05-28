// app/components/ServiceWorkerRegister.jsx
'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // Only load the PWA registration in production
    if (process.env.NODE_ENV === 'production') {
      import('next-pwa/register')
        .catch((err) => {
          console.warn('Service Worker registration failed:', err);
        });
    }
  }, []);

  return null;
}
