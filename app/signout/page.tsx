"use client";
import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

import { useConfigStore } from "@/stores/useConfigStore";

export default function SignInPage() {
  const config = useConfigStore((state) => state.config);
  const { data: session, status } = useSession();

  const handleSignOut = () => {
    console.log("Got session");
    console.log(session, status);
    signOut().then(() => {
      console.log("Signed out successfully");
      window.location.href = "/";
    });
  };

  useEffect(() => {
    if (config) {
      handleSignOut();
    }
  }, [config]);

  if (!config) return <div>Loading config...</div>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      ...existing code...
    </div>
  );
}
