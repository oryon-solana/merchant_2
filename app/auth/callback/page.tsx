"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const userId = searchParams.get("user_id");
    const userEmail = searchParams.get("user_email");
    const userName = searchParams.get("user_name");
    const error = searchParams.get("error");

    if (error || !token || !userId || !userEmail) {
      router.replace("/login?error=google_failed");
      return;
    }

    setAuth(token, { id: userId, email: userEmail, name: userName || undefined });
    router.replace("/");
  }, [searchParams, router, setAuth]);

  return null;
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen bg-[#f4ead5] flex items-center justify-center">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#1034b8]">
        Signing you in…
      </p>
      <Suspense>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
