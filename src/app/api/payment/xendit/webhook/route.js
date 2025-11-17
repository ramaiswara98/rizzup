// app/api/payment/xendit/webhook/route.js
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const XENDIT_WEBHOOK_TOKEN = process.env.XENDIT_WEBHOOK_TOKEN;
const XENDIT_API_KEY = process.env.XENDIT_SECRET_KEY;

// Verify Xendit webhook signature
function verifyXenditSignature(payload, signature) {
  const hash = crypto
    .createHmac('sha256', XENDIT_WEBHOOK_TOKEN)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return hash === signature;
}

// Fetch invoice details from Xendit to get metadata
async function fetchInvoice(invoiceId) {
  const res = await fetch(`https://api.xendit.co/v2/invoices/${invoiceId}`, {
    headers: {
      'Authorization': `Basic ${Buffer.from(XENDIT_API_KEY + ':').toString('base64')}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch invoice: ${res.status}`);
  }

  return res.json();
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const signature = request.headers.get('x-callback-token');

    // Verify webhook authenticity (optional in production)
    // if (!verifyXenditSignature(payload, signature)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    console.log('Xendit webhook received:', payload);

    const { status, id: invoiceId, external_id } = payload;

    if (status === 'PAID' || status === 'SETTLED') {
      // Fetch invoice to get metadata
      const invoice = await fetchInvoice(invoiceId);
      const { metadata } = invoice;

      if (!metadata) {
        console.error('No metadata found on invoice:', invoiceId);
        return NextResponse.json({ success: false, error: 'No metadata' }, { status: 400 });
      }

      const { uid, plan, tokens } = metadata;

      // Save subscription to your database
      const subscriptionResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/subscription/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid,
          plan,
          tokens,
          paymentId: invoiceId,
          externalId: external_id,
        }),
      });

      const subscriptionData = await subscriptionResponse.json();

      if (!subscriptionData.success) {
        console.error('Failed to create subscription:', subscriptionData);
        return NextResponse.json({ success: false, error: 'Failed to create subscription' }, { status: 500 });
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
    return NextResponse.json({ success: false, error: 'Webhook processing failed' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
