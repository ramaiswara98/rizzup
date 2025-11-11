// app/api/user/stats/route.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db(process.env.MONGODB_DB_NAME || 'rizzup');
}

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

    // Connect to MongoDB
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Get user stats
    const user = await usersCollection.findOne(
      { uid },
      { 
        projection: { 
          rizzScore: 1, 
          suggestionsUsed: 1, 
          conversationsStarted: 1, 
          conversationsRated: 1 
        } 
      }
    );

    if (!user) {
      return Response.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }

    return Response.json({ 
      success: true, 
      stats: {
        rizzScore: user.rizzScore || 0,
        suggestionsUsed: user.suggestionsUsed || 0,
        conversationsStarted: user.conversationsStarted || 0,
        conversationsRated: user.conversationsRated || 0
      }
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}