// app/api/auth/save-user/route.js
import { MongoClient } from 'mongodb';

// MongoDB connection
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
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    const { uid, email, displayName, photoURL, language } = await request.json();

    if (!uid || !email) {
      return Response.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Connect to MongoDB
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Check if user exists
    const existingUser = await usersCollection.findOne({ uid });

    if (existingUser) {
      // Update existing user
      const result = await usersCollection.updateOne(
        { uid },
        { 
          $set: { 
            lastLoginAt: new Date(),
            language: language || 'english',
            displayName,
            photoURL,
            email
          } 
        }
      );

      return Response.json({ 
        success: true, 
        message: 'User updated',
        isNewUser: false,
        user: {
          uid,
          email,
          displayName,
          photoURL,
          language: language || 'english'
        }
      });
    } else {
      // Create new user
      const newUser = {
        uid,
        email,
        displayName,
        photoURL,
        language: language || 'english',
        createdAt: new Date(),
        lastLoginAt: new Date(),
        rizzScore: 0,
        suggestionsUsed: 0,
        conversationsStarted: 0,
        conversationsRated: 0,
        history: []
      };

      await usersCollection.insertOne(newUser);

      return Response.json({ 
        success: true, 
        message: 'User created',
        isNewUser: true,
        user: newUser
      });
    }

  } catch (error) {
    console.error('Error saving user to MongoDB:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}