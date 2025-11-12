// app/api/user/update-stats/route.js
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
    const { uid, type, rizzScore } = await request.json();

    if (!uid || !type) {
      return Response.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    let updateData = {};
    
    switch(type) {
      case 'suggestionUsed':
        updateData = { $inc: { suggestionsUsed: 1 } };
        break;
      case 'conversationStarted':
        updateData = { $inc: { conversationsStarted: 1 } };
        break;
      case 'conversationRated':
        updateData = { 
          $inc: { conversationsRated: 1 },
          $set: { rizzScore: rizzScore } // Update latest rizz score
        };
        break;
      default:
        return Response.json({ 
          success: false, 
          error: 'Invalid type' 
        }, { status: 400 });
    }

    const result = await usersCollection.updateOne(
      { uid },
      updateData
    );

    if (result.matchedCount === 0) {
      return Response.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }

    return Response.json({ 
      success: true, 
      message: 'Stats updated'
    });

  } catch (error) {
    console.error('Error updating stats:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}