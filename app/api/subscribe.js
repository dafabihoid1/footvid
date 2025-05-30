let subscriptions = [];

export default function handler(req, res) {
  if (req.method === 'POST') {
    subscriptions.push(req.body);
    console.log('New subscription:', req.body);
    res.status(201).json({ message: 'Subscribed successfully.' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export { subscriptions };