"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function logoutAction() {
  try {
    await auth.api.signOut({
      headers: await headers(),
      fetchOptions: {
        onError: (ctx) => {
          throw new Error(ctx.error.message);
        },
      },
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Logout failed",
    };
  }
}

export async function signinAction(email: string, password: string) {
  try {
    await auth.api.signIn.email(
      { email, password },
      {
        fetchOptions: {
          onError: (ctx) => {
            throw new Error(ctx.error.message);
          },
        },
        headers: await headers(),
      }
    );
    redirect("/dashboard");
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Signin failed",
    };
  }
  return { success: true };
}
