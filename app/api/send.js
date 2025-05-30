// /pages/api/send.js

import webpush from 'web-push';
import { subscriptions } from './subscribe';

const vapidKeys = {
  publicKey: 'BKxF83dM5bnHnKyF8bY8XRYJr1zYOoM3xEvlox8MKFl27Kt83GD4ashsitb3sfn15nXg_cxNsgWtk6ilkcZInW8',
  privateKey: 'GynicC7Rme9jxN7ZexU_xkn9-kvVD9mOhHl_Fwb7h-o'
};

webpush.setVapidDetails(
  'mailto:your@email.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export default async function handler(req, res) {
  const notificationPayload = {
    title: 'FootVid Update!',
    body: 'Check out the latest content!'
  };

  const results = await Promise.allSettled(
    subscriptions.map(sub =>
      webpush.sendNotification(sub, JSON.stringify(notificationPayload))
    )
  );

  res.status(200).json({ message: 'Notifications sent', results });
}
