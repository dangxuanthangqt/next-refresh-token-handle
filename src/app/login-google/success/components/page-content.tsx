"use client";

import { saveTokensForInternalServer } from "@/api/internal-auth-token-api";
import { saveTokensToCookies } from "@/app/actions/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

const tokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

function LoadingPage() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100 z-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

// Two method to save tokens to cookies
// 1. Save tokens to cookies by calling the server action
// 2. Save tokens to cookies by calling the internal server action

export default function PageContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const { accessToken, refreshToken } = await tokensSchema.parseAsync({
          accessToken: searchParams.get("accessToken"),
          refreshToken: searchParams.get("refreshToken"),
        });

        // Can add more step to check if the token is valid or not before saving to cookies
        // For example, check if the token is expired or not

        // Save tokens to cookies by calling the server action
        await saveTokensToCookies({ accessToken, refreshToken });

        router.push("/dashboard");
      } catch (error) {
        console.error({ error });

        router.push("/login-google");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [router, searchParams]);

  useEffect(() => {
    (async () => {
      try {
        const { accessToken, refreshToken } = await tokensSchema.parseAsync({
          accessToken: searchParams.get("accessToken"),
          refreshToken: searchParams.get("refreshToken"),
        });

        // Can add more step to check if the token is valid or not before saving to cookies
        // For example, check if the token is expired or not

        // Save tokens to cookies by calling the server action
        await saveTokensForInternalServer({ accessToken, refreshToken });

        router.push("/dashboard");
      } catch (error) {
        console.error({ error });

        router.push("/login-google");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [router, searchParams]);

  return isLoading ? <LoadingPage /> : null;
}
