import { createAuthClient,  } from "better-auth/react";
import { inferAdditionalFields, adminClient } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  plugins: [
    inferAdditionalFields<auth, { role: "USER" | "ADMIN" }>(),
    adminClient(),
  ],
});

export const { signUp, signOut, signIn } = authClient;
