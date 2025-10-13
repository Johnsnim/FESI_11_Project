"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setAuthToken } from "@/lib/api/api";

function TokenSync() {
  const { data } = useSession();
  useEffect(() => {
    setAuthToken(data?.accessToken ?? null);
  }, [data?.accessToken]);
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            gcTime: 5 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: { retry: 0 },
        },
      }),
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <TokenSync />
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
}
