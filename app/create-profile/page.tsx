import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/config/db';
import { users } from '@/config/schema';
import { eq } from 'drizzle-orm';

const CreateProfilePage = async () => {
  const clerkUser = await currentUser();

  // If no user is logged in, redirect to sign-in
  if (!clerkUser) {
    redirect('/sign-in');
  }

  // Check if the user already has a profile in our database
  const userInDb = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkUser.id),
  });

  // If they already exist, they're all set. Send them to the dashboard.
  if (userInDb) {
    redirect('/dashboard');
  }

  // If they don't exist, create a new user record in our database
  try {
    // The username is guaranteed to exist because we made it "Required" in Clerk
    await db
      .insert(users)
      .values({
        clerkId: clerkUser.id,
        username: clerkUser.username!, // The '!' asserts that username is not null
        imageUrl: clerkUser.imageUrl,
      });
  } catch (error) {
    console.error("Failed to create user in DB:", error);
    // You can redirect to a specific error page if you want
    // redirect('/error?code=USER_CREATION_FAILED');
  }

  // After creating the profile, send them to the dashboard
  redirect('/dashboard');

  // This page never renders any UI
  return null;
};

export default CreateProfilePage;