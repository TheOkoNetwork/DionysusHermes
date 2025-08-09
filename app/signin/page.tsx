"use client";
import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

import { useConfigStore } from "@/stores/useConfigStore";

export default function SignInPage() {
  const config = useConfigStore((state) => state.config);
  const { data: session, status } = useSession();

  const handleSignIn = () => {
    console.log("Got session");
    console.log(session, status);
    //If already signed in, redirect to home
    if (status === "authenticated") {
      let redirectTo = localStorage.getItem("redirectTo");

      if (localStorage.getItem("redirectTo")) {
        localStorage.removeItem("redirectTo");
      }
      window.location.href = redirectTo || "/";

      return;
    }
    if (config?.customer_identity_store_id) {
      signIn(
        "zitadel",
        {},
        {
          scope: `openid email profile offline_access urn:zitadel:iam:org:id:${config.customer_identity_store_id}`,
        },
      );
    } else {
      console.error(
        "Customer identity store ID is not available in the config.",
      );
    }
  };

  useEffect(() => {
    if (config) {
      handleSignIn();
    }
  }, [config]);

  if (!config) return <div>Loading config...</div>;

  return <div>Loading...</div>;
}
