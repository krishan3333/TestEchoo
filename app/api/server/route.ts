// app/api/server/route.ts
import { NextResponse } from "next/server";
import { currentUser as getClerkUser } from "@clerk/nextjs/server"; // Renamed import
import { db } from "@/config/db";
import { servers, channels, members, users } from "@/config/schema";
import { eq, inArray } from "drizzle-orm"; // Added inArray
import { v4 as uuidv4 } from "uuid";

// POST: Create a new server
export async function POST(req: Request) {
  try {
    const clerkUser = await getClerkUser();
    if (!clerkUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, imageUrl } = await req.json();
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return new NextResponse("Server name is required", { status: 400 });
    }

    // Find the user in your database
    let userInDb = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkUser.id),
    });

    // If user doesn't exist in DB (should ideally not happen after create-profile)
    if (!userInDb) {
       console.warn("[SERVERS_POST] User not found in DB for clerkId:", clerkUser.id);
       // Optional: Attempt to create the user here if necessary
       // return new NextResponse("User profile not found", { status: 404 });
       // For robustness, let's try creating them if missing (like in echoo)
        const fallbackUsername =
            clerkUser.username ||
            clerkUser.primaryEmailAddress?.emailAddress?.split("@")[0] ||
            clerkUser.firstName ||
            `user-${clerkUser.id.slice(0, 8)}`;

        const [newUser] = await db
            .insert(users)
            .values({
            clerkId: clerkUser.id,
            username: fallbackUsername!, // Assert non-null, handle potential null better if needed
            imageUrl: clerkUser.imageUrl || null,
            })
            .returning();
        userInDb = newUser;
        console.log("[SERVERS_POST] Created missing user during server creation:", newUser);

    }

    // --- Create Server, Default Channel, and Owner Membership ---
    // Note: Drizzle with Neon HTTP doesn't support transactions easily.
    // These run as separate operations. Handle potential partial failures if needed.

    // 1. Create the server
    const [createdServer] = await db
      .insert(servers)
      .values({
        ownerId: userInDb.id, // Use the ID from your database user record
        name: name.trim(), // Use trimmed name
        imageUrl: imageUrl || null,
        inviteCode: uuidv4().substring(0, 8), // Generate invite code
      })
      .returning(); // Get the created server back

     if (!createdServer) {
        throw new Error("Server creation failed.");
     }

    // 2. Create the default 'general' channel
    await db.insert(channels).values({
      serverId: createdServer.id,
      name: "general",
      type: "TEXT", // Default channel type
    });

    // 3. Add the owner as the first member with ADMIN role
    await db.insert(members).values({
      serverId: createdServer.id,
      userId: userInDb.id, // Use the ID from your database user record
      role: "ADMIN", // Or 'OWNER' if you prefer
    });

    // Return the newly created server object
    return NextResponse.json(createdServer);

  } catch (error) {
    console.error("[SERVERS_POST_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// GET: Fetch servers the current user is a member of
export async function GET(req: Request) {
  try {
    const clerkUser = await getClerkUser();
    if (!clerkUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the user in your database
    const userInDb = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkUser.id),
    });

    if (!userInDb) {
      // This might happen if they signed up but create-profile failed/redirected too soon
      console.warn("[SERVERS_GET] User not found in DB for clerkId:", clerkUser.id);
      return new NextResponse("User profile not found", { status: 404 });
    }

    // Find all memberships for the user
    const userMemberships = await db.query.members.findMany({
        where: eq(members.userId, userInDb.id),
        columns: {
            serverId: true // Only need the serverId
        }
    });

    // Extract server IDs
    const serverIds = userMemberships.map(m => m.serverId);

    if (serverIds.length === 0) {
        return NextResponse.json([]); // No servers joined yet
    }

    // Fetch the actual server details for those IDs
    const serverList = await db.query.servers.findMany({
        where: inArray(servers.id, serverIds)
    });


    return NextResponse.json(serverList); // Return the list of server objects

  } catch (error) {
    console.error("[SERVERS_GET_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}