// app/api/payment/xendit/webhook/route.js
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const XENDIT_WEBHOOK_TOKEN = process.env.XENDIT_WEBHOOK_TOKEN;

// Verify Xendit webhook signature
function verifyXenditSignature(payload, signature) {
  const hash = crypto
    .createHmac('sha256', XENDIT_WEBHOOK_TOKEN)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return hash === signature;
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const signature = request.headers.get('x-callback-token');

    // Verify webhook authenticity (in production)
    // if (!verifyXenditSignature(payload, signature)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    // Handle different payment statuses
    const { status, external_id, metadata } = payload;

    console.log('Xendit webhook received:', { status, external_id, metadata });

    if (status === 'PAID' || status === 'SETTLED') {
      // Payment successful - create subscription
      const { uid, plan, tokens } = metadata;

      // Save subscription to your database
      const subscriptionResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/subscription/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: uid,
          plan: plan,
          tokens: tokens,
          paymentId: payload.id,
          externalId: external_id,
        }),
      });

      const subscriptionData = await subscriptionResponse.json();

      if (!subscriptionData.success) {
        console.error('Failed to create subscription:', subscriptionData);
        return NextResponse.json(
          { success: false, error: 'Failed to create subscription' },
          { status: 500 }
        );
      }

      console.log('Subscription created successfully:', subscriptionData);
    } else if (status === 'EXPIRED') {
      console.log('Invoice expired:', external_id);
      // Handle expired invoice
    } else if (status === 'FAILED') {
      console.log('Payment failed:', external_id);
      // Handle failed payment
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Disable body parsing to get raw body for signature verification
export const config = {
  api: {
    bodyParser: true,
  },
};