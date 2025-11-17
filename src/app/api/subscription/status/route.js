import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db(process.env.MONGODB_DB_NAME || 'rizzup');
}

// GET - Check subscription status
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return Response.json({ 
        success: false, 
        error: 'Missing user ID' 
      }, { status: 400 });
    }

    const db = await connectToDatabase();
    const subscriptionsCollection = db.collection('subscriptions');

    // Get active subscription
    const subscription = await subscriptionsCollection.findOne({
      uid,
      status: 'active',
      expiryDate: { $gt: new Date() }
    });

    if (!subscription) {
      return Response.json({ 
        success: true,
        hasSubscription: false,
        message: 'No active subscription'
      });
    }

    return Response.json({ 
      success: true,
      hasSubscription: true,
      subscription: {
        plan: subscription.plan,
        tokens: subscription.tokens,
        tokensRemaining: subscription.tokensRemaining,
        expiryDate: subscription.expiryDate
      }
    });

  } catch (error) {
    console.error('Error fetching subscription:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}