// app/api/user/update-stats/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { uid, type, tokenCost } = body;

    if (!uid || !type) {
      return NextResponse.json(
        { success: false, error: 'UID and type are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('rizzup');
    const usersCollection = db.collection('users');

    // First, get the current user to check token balance
    const currentUser = await usersCollection.findOne({ uid });
    
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    let updateQuery = {};
    const tokensToDeduct = tokenCost || 0;
    
    console.log(`Processing ${type} for user ${uid}`);
    console.log(`Token cost: ${tokensToDeduct}`);
    console.log(`Current tokens: ${currentUser.subscription?.tokensRemaining || 0}`);
    console.log(`Will update to: ${(currentUser.subscription?.tokensRemaining || 0) - tokensToDeduct}`);

    // Check if user has enough tokens
    const currentTokens = currentUser.subscription?.tokensRemaining || 0;
    if (type === 'suggestionUsed' || type === 'conversationStarted') {
      if (currentTokens < tokensToDeduct) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Insufficient tokens',
            tokensRemaining: currentTokens 
          },
          { status: 400 }
        );
      }
    }

    switch (type) {
      case 'suggestionUsed':
        updateQuery = {
          $inc: { 
            suggestionsUsed: 1
          },
          $set: {
            'subscription.tokensRemaining': currentTokens - tokensToDeduct
          }
        };
        break;
      case 'conversationStarted':
        updateQuery = {
          $inc: { 
            conversationsStarted: 1
          },
          $set: {
            'subscription.tokensRemaining': currentTokens - tokensToDeduct
          }
        };
        break;
      case 'conversationRated':
        // Check if tokens need to be deducted for rating
        const hasTokenCost = tokenCost !== undefined && tokenCost > 0;
        
        if (hasTokenCost) {
          if (currentTokens < tokensToDeduct) {
            return NextResponse.json(
              { 
                success: false, 
                error: 'Insufficient tokens',
                tokensRemaining: currentTokens 
              },
              { status: 400 }
            );
          }
        }
        
        // Build the update query
        updateQuery = {
          $inc: { conversationsRated: 1 }
        };
        
        // Add token deduction if there's a cost
        if (hasTokenCost) {
          updateQuery.$set = {
            'subscription.tokensRemaining': currentTokens - tokensToDeduct
          };
        }
        
        // Update rizz score if provided
        if (body.rizzScore !== undefined) {
          const newRizzScore = body.rizzScore;
          const currentRizzScore = currentUser.rizzScore || 0;
          const totalRatings = currentUser.conversationsRated || 0;
          
          // Calculate average rizz score
          const averageRizzScore = totalRatings === 0 
            ? newRizzScore 
            : Math.round(((currentRizzScore * totalRatings) + newRizzScore) / (totalRatings + 1));
          
          if (!updateQuery.$set) {
            updateQuery.$set = {};
          }
          updateQuery.$set.rizzScore = averageRizzScore;
        }
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid type' },
          { status: 400 }
        );
    }

    // Update the user
    console.log('Update query:', JSON.stringify(updateQuery, null, 2));
    
    const result = await usersCollection.updateOne(
      { uid },
      updateQuery
    );

    console.log('Update result:', result);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get updated user data to return the new token count
    const updatedUser = await usersCollection.findOne({ uid });
    const newTokenBalance = updatedUser.subscription?.tokensRemaining || 0;

    console.log(`Token deduction complete: ${currentUser.subscription?.tokensRemaining || 0} -> ${newTokenBalance} (deducted ${tokensToDeduct})`);

    return NextResponse.json({
      success: true,
      message: 'Stats updated successfully',
      tokensRemaining: newTokenBalance,
      tokensDeducted: tokensToDeduct
    });
  } catch (error) {
    console.error('Error updating stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update stats' },
      { status: 500 }
    );
  }
}