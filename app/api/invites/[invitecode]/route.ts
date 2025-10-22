// app/api/invites/[invitecode]/route.ts
import { NextResponse } from "next/server";
import { currentUser as getClerkUser } from "@clerk/nextjs/server"; // Renamed import
import { db } from "@/config/db";
import { servers, members, users } from "@/config/schema";
import { and, eq } from "drizzle-orm";

// PATCH: Join a server using an invite code
export async function PATCH(
  req: Request,
  { params }: { params: { invitecode: string } }
) {
  try {
    const clerkUser = await getClerkUser();
    if (!clerkUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const inviteCode = params.invitecode;
    if (!inviteCode) {
      return new NextResponse("Invite code is missing", { status: 400 });
    }

    // Find the user in your database
    const userInDb = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkUser.id),
    });

    if (!userInDb) {
      // Should ideally not happen if create-profile works
      console.warn("[INVITE_PATCH] User not found in DB for clerkId:", clerkUser.id);
      return new NextResponse("User profile not found", { status: 404 });
    }

    // Find the server matching the invite code
    const serverToJoin = await db.query.servers.findFirst({
      where: eq(servers.inviteCode, inviteCode),
    });

    if (!serverToJoin) {
      return new NextResponse("Invalid invite code", { status: 404 });
    }

    // Check if the user is already a member of this server
    const existingMember = await db.query.members.findFirst({
      where: and(
        eq(members.serverId, serverToJoin.id),
        eq(members.userId, userInDb.id) // Use user's DB ID
      ),
    });

    if (existingMember) {
      // User is already in the server, maybe just return the server info
       console.log(`User ${userInDb.id} already member of server ${serverToJoin.id}`);
       // Returning the existing server might be better UX than an error
       return NextResponse.json(serverToJoin);
      // return new NextResponse("You are already a member of this server", { status: 400 });
    }

    // Add the user as a new member with the default 'GUEST' role
    const [newMember] = await db
      .insert(members)
      .values({
        serverId: serverToJoin.id,
        userId: userInDb.id, // Use user's DB ID
        role: "GUEST", // Default role for joining via invite
      })
      .returning(); // Return the created membership record

    // It's often more useful to return the server info after joining
    // Fetch the server again or just use serverToJoin
    const joinedServerDetails = await db.query.servers.findFirst({
        where: eq(servers.id, serverToJoin.id),
        // Optionally include relations like channels if needed immediately
        // with: { channels: true }
    });

    return NextResponse.json(joinedServerDetails || serverToJoin); // Return server details

  } catch (error) {
    console.error("[INVITE_PATCH_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}