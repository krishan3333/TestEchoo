import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { servers, channels, members, users } from "@/config/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    // 🔐 Get the currently signed-in Clerk user
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, imageUrl } = await req.json();
    if (!name) {
      return new NextResponse("Server name is required", { status: 400 });
    }

    // 🔍 Check if user exists in our local DB
    let userInDb = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkUser.id),
    });

    // 🧱 If not found, create one automatically
    if (!userInDb) {
      const fallbackUsername =
        clerkUser.username ||
        clerkUser.primaryEmailAddress?.emailAddress?.split("@")[0] ||
        clerkUser.firstName ||
        `user-${clerkUser.id.slice(0, 8)}`;

      const [newUser] = await db
        .insert(users)
        .values({
          clerkId: clerkUser.id,
          username: fallbackUsername,
          imageUrl: clerkUser.imageUrl || null,
        })
        .returning();
      userInDb = newUser;
      console.log("[SERVERS_POST] Created missing user:", newUser);
    }

    // ⚙️ Create a new server (with default 'general' channel + admin membership)
    // ❌ No transaction (Neon HTTP doesn’t support it)
const [createdServer] = await db
  .insert(servers)
  .values({
    ownerId: userInDb.id,
    name,
    imageUrl: imageUrl || null,
    inviteCode: uuidv4().substring(0, 8),
  })
  .returning();

await db.insert(channels).values({
  serverId: createdServer.id,
  name: "general",
  type: "TEXT",
});

await db.insert(members).values({
  serverId: createdServer.id,
  userId: userInDb.id,
  role: "ADMIN",
});

const newServer = createdServer;

    return NextResponse.json(newServer);
  } catch (error) {
    console.error("[SERVERS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userInDb = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkUser.id),
    });

    if (!userInDb) {
      return new NextResponse("User not found in database", { status: 404 });
    }

    const serverList = await db
      .select({ server: servers })
      .from(members)
      .leftJoin(servers, eq(members.serverId, servers.id))
      .where(eq(members.userId, userInDb.id));

    return NextResponse.json(
      serverList.map((item) => item.server).filter(Boolean)
    );
  } catch (error) {
    console.error("[SERVERS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
