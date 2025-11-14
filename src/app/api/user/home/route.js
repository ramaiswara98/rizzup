// app/api/user/home/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json(
        { success: false, error: 'UID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('rizzup'); // Replace with your database name
    const usersCollection = db.collection('users');

    // Find user by uid
    const user = await usersCollection.findOne({ uid });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Return home page data
    return NextResponse.json({
      success: true,
      data: {
        rizzScore: user.rizzScore || 0,
        suggestionsUsed: user.suggestionsUsed || 0,
        conversationsStarted: user.conversationsStarted || 0,
        tokens: user.subscription?.tokensRemaining || 0,
        isPremium: user.isPremium || false,
        subscription: user.subscription || null
      }
    });
  } catch (error) {
    console.error('Error fetching home data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch home data' },
      { status: 500 }
    );
  }
}