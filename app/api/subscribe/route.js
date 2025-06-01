// app/api/subscribe/route.js

export async function POST(req) {
  try {
    const body = await req.json();
    const subscription = body.subscription;

    if (!subscription || !subscription.endpoint) {
      return new Response(JSON.stringify({ error: 'Invalid subscription' }), { status: 400 });
    }

    // TODO: Store this in a DB or file if needed
    console.log('Received new subscription:', subscription);

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Subscribe error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
