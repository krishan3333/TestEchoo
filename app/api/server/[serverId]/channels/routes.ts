import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/config/db';
import { channels, members, users } from '@/config/schema';
import { and, eq } from 'drizzle-orm';

export async function GET(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse('Server ID Missing', { status: 400 });
    }
    
    const userInDb = await db.query.users.findFirst({
        where: eq(users.clerkId, user.id)
    });
    if (!userInDb) {
        return new NextResponse('User not found in database', { status: 404 });
    }

    const member = await db.query.members.findFirst({
        where: and(
            eq(members.serverId, params.serverId),
            eq(members.userId, userInDb.id)
        )
    });

    if (!member) {
        return new NextResponse("Forbidden: You are not a member of this server.", { status: 403 });
    }

    const serverChannels = await db
      .select()
      .from(channels)
      .where(eq(channels.serverId, params.serverId));
      
    return NextResponse.json(serverChannels);

  } catch (error) {
    console.error('[CHANNELS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}