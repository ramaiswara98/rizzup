// app/api/subscription/create/route.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db(process.env.MONGODB_DB_NAME || 'rizzup');
}

export async function POST(request) {
  try {
    const { uid, plan, tokens } = await request.json();

    if (!uid || !plan || !tokens) {
      return Response.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection('users');
    const subscriptionsCollection = db.collection('subscriptions');

    // Calculate expiry date (30 days from now)
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    // Create subscription record
    const subscription = {
      uid,
      plan, // 'charm' or 'aura'
      tokens, // 1500 or 5000
      tokensRemaining: tokens,
      startDate,
      expiryDate,
      status: 'active',
      createdAt: new Date()
    };

    await subscriptionsCollection.insertOne(subscription);

    // Update user with subscription info
    await usersCollection.updateOne(
      { uid },
      { 
        $set: { 
          subscription: {
            plan,
            tokens,
            tokensRemaining: tokens,
            expiryDate,
            status: 'active'
          },
          isPremium: true
        } 
      }
    );

    return Response.json({ 
      success: true, 
      message: 'Subscription created successfully',
      subscription
    });

  } catch (error) {
    console.error('Error creating subscription:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

