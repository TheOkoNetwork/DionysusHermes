// filepath: /home/gregory/workspace/DionysusHermes/app/client-layout.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { Link } from "@heroui/link";

import { Navbar } from "@/components/navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="relative flex flex-col h-screen">
        <Navbar />
        <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
          {children}
        </main>
        <footer className="w-full flex items-center justify-center py-3">
          <Link
            isExternal
            className="flex items-center gap-1 text-current"
            href="https://dionysusticketing.app?utm_source=hermes"
            title="Dionysus Ticketing homepage"
          >
            {/* <span className="text-default-600">Powered by</span> */}
            <p className="text-primary">
              <img
                alt="Dionysus Ticketing Logo"
                src="/img/logo/dionysus_with_slogan_light.svg"
                style={{ height: "50px" }}
              />
            </p>
          </Link>
        </footer>
      </div>
    </SessionProvider>
  );
}
