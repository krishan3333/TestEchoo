import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/config/db';
import { servers, channels, members, users } from '@/config/schema';
import { eq } from 'drizzle-orm';


export async function POST(req: Request) {
  
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

    
    return NextResponse.json(serverList.map(item => item.server));

  } catch (error) {
    console.error('[SERVERS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}