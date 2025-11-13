// app/api/payment/xendit/create-invoice/route.js
import { NextResponse } from 'next/server';

const XENDIT_API_KEY = process.env.XENDIT_SECRET_KEY; // Add your test key to .env
const XENDIT_API_URL = 'https://api.xendit.co/v2/invoices';

export async function POST(request) {
  try {
    const { uid, email, plan, amount, customerName } = await request.json();

    // Validate required fields
    if (!uid || !email || !plan || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create invoice payload
    const invoiceData = {
      external_id: `subscription_${uid}_${Date.now()}`,
      amount: amount,
      payer_email: email,
      description: `${plan === 'charm' ? 'Charm Plan' : 'Aura Plan'} Subscription`,
      invoice_duration: 86400, // 24 hours expiry
      customer: {
        given_names: customerName || 'User',
        email: email,
      },
      customer_notification_preference: {
        invoice_created: ['email'],
        invoice_reminder: ['email'],
        invoice_paid: ['email'],
      },
      success_redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/app/payment/success?plan=${plan}`,
      failure_redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/app/payment/failed`,
      currency: 'IDR',
      items: [
        {
          name: `${plan === 'charm' ? 'Charm' : 'Aura'} Plan`,
          quantity: 1,
          price: amount,
          category: 'Subscription',
        },
      ],
      metadata: {
        uid: uid,
        plan: plan,
        tokens: plan === 'charm' ? 1500 : 5000,
      },
    };

    // Create invoice with Xendit
    const response = await fetch(XENDIT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(XENDIT_API_KEY + ':').toString('base64')}`,
      },
      body: JSON.stringify(invoiceData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Xendit error:', data);
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to create invoice' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      invoiceUrl: data.invoice_url,
      invoiceId: data.id,
      externalId: data.external_id,
    });

  } catch (error) {
    console.error('Error creating Xendit invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}