// app/api/user/history/route.js
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db(process.env.MONGODB_DB_NAME || 'rizzup');
}

// GET - Fetch user history
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
    const historyCollection = db.collection('history');

    // Get user history, sorted by most recent first
    const history = await historyCollection
      .find({ uid })
      .sort({ createdAt: -1 })
      .limit(100) // Limit to last 100 items
      .toArray();

    return Response.json({ 
      success: true, 
      history: history
    });

  } catch (error) {
    console.error('Error fetching history:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// POST - Add history item
export async function POST(request) {
  try {
    const { uid, type, data, preview, imageUrl, score } = await request.json();

    if (!uid || !type) {
      return Response.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Connect to MongoDB
    const db = await connectToDatabase();
    const historyCollection = db.collection('history');

    // Create history item
    const historyItem = {
      uid,
      type, // 'suggested-reply', 'start-conversation', 'rate-rizz'
      data, // The actual data (suggestions, conversation starters, etc.)
      preview, // Short preview text
      imageUrl, // Optional image URL
      score, // Optional score (for rate-rizz)
      createdAt: new Date()
    };

    const result = await historyCollection.insertOne(historyItem);

    return Response.json({ 
      success: true, 
      historyId: result.insertedId,
      message: 'History item added'
    });

  } catch (error) {
    console.error('Error adding history:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// DELETE - Delete history item
export async function DELETE(request) {
  try {
    const { uid, historyId } = await request.json();

    if (!uid || !historyId) {
      return Response.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Connect to MongoDB
    const db = await connectToDatabase();
    const historyCollection = db.collection('history');

    // Delete history item (only if it belongs to the user)
    const result = await historyCollection.deleteOne({
      _id: new ObjectId(historyId),
      uid: uid
    });

    if (result.deletedCount === 0) {
      return Response.json({ 
        success: false, 
        error: 'History item not found or unauthorized' 
      }, { status: 404 });
    }

    return Response.json({ 
      success: true, 
      message: 'History item deleted'
    });

  } catch (error) {
    console.error('Error deleting history:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}