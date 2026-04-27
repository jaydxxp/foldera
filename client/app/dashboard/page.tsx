import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import type { User } from "@/lib/types";

async function getInitialUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

  try {
    const response = await fetch(`${apiUrl}/auth/me`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as { user: User };
    return payload.user;
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const user = await getInitialUser();

  if (!user) {
    redirect("/login");
  }

  return <DashboardClient initialUser={user} />;
}
