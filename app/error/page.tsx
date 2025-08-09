"use client";

import { subtitle, title } from "@/components/primitives";
import { useConfigStore } from "@/stores/useConfigStore";

export default function ErrorPage() {
  const config = useConfigStore((state) => state.config);

  // if (!config) return <div>Loading config...</div>;

  // return <div>Config loaded: {JSON.stringify(config)}</div>;

  return (
    <div>
      <h1 className={title()}>Error</h1>
      <h1 className={subtitle()}>
        {config ? config.error : "No configuration loaded"}
      </h1>
    </div>
  );
}
