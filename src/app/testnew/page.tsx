"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const MinimalRouterTest: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const router = useRouter();
      if (router.isReady) {
        const queryToken = new URL(window.location.href).searchParams.get("token");
        if (queryToken) {
          setToken(queryToken);
        }
      }
    }
  }, []);

  return (
    <div>
      <p>Token: {token}</p>
    </div>
  );
};

export default MinimalRouterTest;
