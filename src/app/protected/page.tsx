"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "authenticated" && session?.user) {
    return (
      <div>
        <h1>Protected Page</h1>
        <p>Welcome, {session.user.email}</p>
        <button onClick={() => signOut()}>Logout</button>
      </div>
    );
  }

  return null;
}
