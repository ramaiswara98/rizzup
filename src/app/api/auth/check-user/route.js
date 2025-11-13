// app/api/auth/check-user/route.js
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function POST(request) {
  try {
    const { uid, email } = await request.json();

    if (!uid || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);
    const db = client.db(process.env.MONGODB_DB_NAME || 'rizzup'); // Replace with your DB name
    const usersCollection = db.collection('users');

    // Check if user exists
    const existingUser = await usersCollection.findOne({ uid });

    if (existingUser) {
      // Existing user - check if they have a subscription
      const subscriptionsCollection = db.collection('subscriptions');
      const subscription = await subscriptionsCollection.findOne({ 
        uid,
        status: 'active' 
      });

      return NextResponse.json({
        success: true,
        isNewUser: false,
        hasSubscription: !!subscription,
        user: {
          uid: existingUser.uid,
          email: existingUser.email,
          displayName: existingUser.displayName,
          photoURL: existingUser.photoURL,
          createdAt: existingUser.createdAt,
          language: existingUser.language
        },
        subscription: subscription || null
      });
    }

    // New user
    return NextResponse.json({
      success: true,
      isNewUser: true,
      hasSubscription: false,
      user: null,
      subscription: null
    });

  } catch (error) {
    console.error('Error checking user:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}