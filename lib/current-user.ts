import { auth } from '@clerk/nextjs/server';
import { db } from '@/config/db';      // Your path to the Drizzle client
import { users } from '@/config/schema'; // Your path to the Drizzle schema
import { eq } from 'drizzle-orm';

/**
 * Retrieves the current user from your database based on the active Clerk session.
 * This is a server-side helper.
 * @returns {Promise<User | null>} The user object from your database, or null if not found or not logged in.
 */
export const currentUser = async () => {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    return null;
  }

  // Use Drizzle to find the user in your 'users' table that matches the clerkId
  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkId),
  });

  return user;
};