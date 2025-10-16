import Sidebar from "@/app/components/layout/sidebar";
import Navbar from "@/app/components/layout/navbar";
import { redirect } from 'next/navigation';
import { currentUser as getClerkUser } from '@clerk/nextjs/server';
import { db } from '@/config/db';
import { users } from '@/config/schema';
import { eq } from 'drizzle-orm';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkUser = await getClerkUser();

  if (!clerkUser) {
    redirect('/sign-in');
  }

  const userInDb = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkUser.id),
  });

  if (!userInDb) {
    redirect('/create-profile');
  }

  return (
    <div className="flex h-screen bg-[#0f111a] text-white">
      <Sidebar user={userInDb} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar user={userInDb} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}