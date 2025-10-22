// app/api/server/[serverId]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { channels, members, users, servers } from "@/config/schema"; // Added servers
import { eq, and } from "drizzle-orm";
import { currentUser as getClerkUser } from "@clerk/nextjs/server"; // To verify membership

// Define the expected structure for the context object containing params
interface RouteParams {
  params: {
    serverId: string;
  };
}

export async function GET(req: Request, context: RouteParams) {
  const { serverId } = context.params;
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // Should be 'channels' or 'members'

  try {
    const clerkUser = await getClerkUser();
    if (!clerkUser) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify serverId is provided
    if (!serverId) {
      return new NextResponse("Server ID is missing", { status: 400 });
    }

     // Find the current user in DB
     const userInDb = await db.query.users.findFirst({
        where: eq(users.clerkId, clerkUser.id),
     });

     if (!userInDb) {
        return new NextResponse("User not found", { status: 404 });
     }

     // Verify the user is actually a member of the requested server
     const membership = await db.query.members.findFirst({
         where: and(
             eq(members.serverId, serverId),
             eq(members.userId, userInDb.id)
         )
     });

     if (!membership) {
         console.warn(`User ${userInDb.id} attempted to access server ${serverId} without membership.`);
         return new NextResponse("Forbidden: Not a member of this server", { status: 403 });
     }

    // --- Fetch Channels ---
    if (type === "channels") {
      const channelList = await db.query.channels.findMany({
        where: eq(channels.serverId, serverId),
        orderBy: (channels, { asc }) => [asc(channels.createdAt)], // Optional: order channels
      });
      return NextResponse.json(channelList);
    }

    // --- Fetch Members ---
    if (type === "members") {
      const memberData = await db
        .select({
          id: users.id, // User's DB ID
          name: users.username,
          avatar: users.imageUrl,
          role: members.role, // Include the role from the members table
          // Add other user fields if needed, e.g., status if you store it
        })
        .from(members)
        .leftJoin(users, eq(members.userId, users.id)) // Join members with users table
        .where(eq(members.serverId, serverId)); // Filter by the specific server ID

       // Add a default status if not stored in DB (as in your ChatApp mock)
       const memberListWithStatus = memberData.map(member => ({
        ...member,
        status: "Online" // Replace with actual status logic if available
       }));

      return NextResponse.json(memberListWithStatus);
    }

    // Invalid type parameter
    return new NextResponse("Invalid request type specified", { status: 400 });

  } catch (error) {
    console.error(`[SERVER_ID_GET_ERROR] (Server: ${serverId}, Type: ${type})`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Add PATCH, DELETE etc. handlers here later for updating/deleting servers