import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { members, servers, users } from "@/config/schema";
import { and, eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: { inviteCode: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.inviteCode) {
      return new NextResponse("Invite Code missing", { status: 400 });
    }

    const userInDb = await db.query.users.findFirst({
        where: eq(users.clerkId, user.id)
    });

    if (!userInDb) {
        return new NextResponse("User not found in database", { status: 404 });
    }

    const [serverToJoin] = await db
      .select()
      .from(servers)
      .where(eq(servers.inviteCode, params.inviteCode));

    if (!serverToJoin) {
      return new NextResponse("Server not found", { status: 404 });
    }

    const existingMember = await db.query.members.findFirst({
      where: and(
        eq(members.serverId, serverToJoin.id),
        eq(members.userId, userInDb.id)
      ),
    });

    if (existingMember) {
      return new NextResponse("Already a member of this server", { status: 400 });
    }

    const [newMember] = await db
      .insert(members)
      .values({
        serverId: serverToJoin.id,
        userId: userInDb.id,
        role: "GUEST",
      })
      .returning();

    return NextResponse.json(serverToJoin);

  } catch (error) {
    console.log("[INVITE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}