import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/config/db';
import { servers, channels, members, users } from '@/config/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid'; // Import uuid generator

// --- FIX APPLIED: Added full server creation logic to POST function ---
export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { name, imageUrl } = await req.json();
    if (!name) {
      return new NextResponse('Server name is required', { status: 400 });
    }

    // Find the user's profile in your database to get their UUID
    const userInDb = await db.query.users.findFirst({
        where: eq(users.clerkId, user.id)
    });

    if (!userInDb) {
        return new NextResponse('User profile not found in DB.', { status: 404 });
    }

    // Use a transaction to ensure all database operations succeed or fail together
    const newServer = await db.transaction(async (tx) => {
      const [createdServer] = await tx
        .insert(servers)
        .values({
          ownerId: userInDb.id, 
          name,
          imageUrl,
          inviteCode: uuidv4().substring(0, 8), // Generate a random invite code
        })
        .returning();

      // Automatically create a 'general' channel for the new server
      await tx.insert(channels).values({
        serverId: createdServer.id,
        name: 'general',
        type: 'TEXT',
      });

      // Automatically make the creator an admin member of the server
      await tx.insert(members).values({
        serverId: createdServer.id,
        userId: userInDb.id, 
        role: 'ADMIN',
      });

      return createdServer;
    });

    return NextResponse.json(newServer);

  } catch (error) {
    console.error('[SERVERS_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}


export async function GET(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userInDb = await db.query.users.findFirst({
        where: eq(users.clerkId, user.id)
    });

    if (!userInDb) {
        return new NextResponse('User not found in database', { status: 404 });
    }

    const serverList = await db
      .select({ server: servers })
      .from(members)
      .leftJoin(servers, eq(members.serverId, servers.id))
      .where(eq(members.userId, userInDb.id));
    
    return NextResponse.json(serverList.map(item => item.server).filter(Boolean));

  } catch (error) {
    console.error('[SERVERS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}