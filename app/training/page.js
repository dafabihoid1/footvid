
'use client'
import React from 'react'
import Navbar from '@/components/Navbar'

export default function Page() {
  async function subscribe() {
    if (!('serviceWorker' in navigator)) {
      alert('Service workers are not supported in your browser.')
      return
    }

    const registration = await navigator.serviceWorker.ready

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array('BKxF83dM5bnHnKyF8bY8XRYJr1zYOoM3xEvlox8MKFl27Kt83GD4ashsitb3sfn15nXg_cxNsgWtk6ilkcZInW8')
    })

    const res = await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription })
    })

    if (res.ok) {
      alert('Push notification sent!')
    } else {
      alert('Failed to send push notification.')
    }
  }

  // Utility: Convert base64 VAPID to Uint8Array
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)))
  }

  return (
    <>
      <Navbar />
      <main className='container'>
        <button onClick={subscribe}>Subscribe & Notify</button>
      </main>
    </>
  )
}
