import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { servers, members, users } from "@/config/schema";
import { and, eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: { invitecode: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.invitecode) {
      return new NextResponse("Invite code is missing", { status: 400 });
    }

    const userInDb = await db.query.users.findFirst({
      where: eq(users.clerkId, user.id),
    });

    if (!userInDb) {
      return new NextResponse("User not found in database", { status: 404 });
    }

    const serverToJoin = await db.query.servers.findFirst({
      where: eq(servers.inviteCode, params.invitecode),
    });

    if (!serverToJoin) {
      return new NextResponse("Invalid invite code", { status: 404 });
    }

    const existingMember = await db.query.members.findFirst({
      where: and(
        eq(members.serverId, serverToJoin.id),
        eq(members.userId, userInDb.id)
      ),
    });

    if (existingMember) {
      return new NextResponse("You are already a member of this server", { status: 400 });
    }

    const [newMember] = await db
      .insert(members)
      .values({
        serverId: serverToJoin.id,
        userId: userInDb.id,
        role: "GUEST",
      })
      .returning();

    return NextResponse.json(newMember);
  } catch (error) {
    console.error("Error joining server via invite code:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}