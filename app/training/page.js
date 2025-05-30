'use client';

import Navbar from '@/components/Navbar';
import React, { useEffect } from 'react';

const PUBLIC_VAPID_KEY = 'BKxF83dM5bnHnKyF8bY8XRYJr1zYOoM3xEvlox8MKFl27Kt83GD4ashsitb3sfn15nXg_cxNsgWtk6ilkcZInW8';

const Page = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker registered'))
        .catch(err => console.error('SW registration failed', err));
    }
  }, []);

  const subscribeUser = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
      });

      await fetch('/api/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      alert('Subscribed to notifications!');
    } catch (error) {
      console.error('Subscription failed', error);
      alert('Subscription failed. See console for details.');
    }
  };

  // Helper to convert the VAPID key
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
  }

  return (
    <>
      <Navbar />
      <main className="container p-4">
        <h1 className="text-2xl font-bold mb-4">Willkommen bei FootVid</h1>
        <button
          onClick={subscribeUser}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Subscribe to Notifications
        </button>
      </main>
    </>
  );
};

export default Page;
