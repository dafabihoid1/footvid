
import webpush from 'web-push'

// Replace with your real VAPID keys
const vapidKeys = {
   publicKey: 'BKxF83dM5bnHnKyF8bY8XRYJr1zYOoM3xEvlox8MKFl27Kt83GD4ashsitb3sfn15nXg_cxNsgWtk6ilkcZInW8',
  privateKey: 'GynicC7Rme9jxN7ZexU_xkn9-kvVD9mOhHl_Fwb7h-o'
}

webpush.setVapidDetails(
  'mailto:your@email.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

export async function POST(req) {
  try {
    const body = await req.json()
    const subscription = body.subscription

    const payload = JSON.stringify({
      title: 'Hello from Footvid!',
      body: 'Push notification successfully triggered 🚀',
    })

    await webpush.sendNotification(subscription, payload)

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Push error:', err)
    return new Response(JSON.stringify({ error: 'Failed to send notification' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
