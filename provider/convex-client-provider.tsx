"use client";

import { ClerkProvider, RedirectToSignIn, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { AuthLoading, Authenticated, ConvexReactClient, Unauthenticated } from "convex/react";
import Loading from "@/components/auth/loading";

interface ConvexClientProviderProps {
  children: React.ReactNode;
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;
const publicKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
const convex = new ConvexReactClient(convexUrl)

export const ConvexClientProvider = ({ children }: ConvexClientProviderProps) => {
  return (
    <ClerkProvider publishableKey={publicKey}>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <AuthLoading>
          <Loading />
        </AuthLoading>
        <Unauthenticated>
          <RedirectToSignIn />
        </Unauthenticated>
        <Authenticated>
          {children}
        </Authenticated>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}