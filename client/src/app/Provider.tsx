"use client";
import React, { ReactNode } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Suspense } from "react";
import Loading from "@/components/ui/Loading";
interface Children {
  children: ReactNode;
}
const queryClient = new QueryClient();
function Provider({ children }: Children) {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<Loading>Loading...</Loading>}>{children}</Suspense>
      </QueryClientProvider>
    </div>
  );
}

export default Provider;
