// app/config-loader.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useConfigStore } from "@/stores/useConfigStore";

export default function ConfigLoader() {
  const router = useRouter();
  const pathname = usePathname();
  const setConfig = useConfigStore((state) => state.setConfig);

  useEffect(() => {
    // Skip /error route
    if (pathname === "/error") return;

    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/config");
        const data = await res.json();

        setConfig(data);
        if (!data) {
          router.push("/error");
        }
      } catch (err) {
        router.push("/error");
      }
    };

    fetchConfig();
  }, [pathname, setConfig, router]);

  return null; // nothing to render, just setup
}
