"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import { signinAction } from "../../app/actions/auth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Handle form submission logic here
      setIsPending(true);
      const result = await signIn.email(
        { email: data.email, password: data.password },
        {
          fetchOptions: {
            onResponse: () => {
              setIsPending(false);
            },
            onError: (ctx) => {
              throw new Error(ctx.error.message);
            },
            onSuccess: () => {
            },
          },
        }
      );
      toast.success("Successfully logged in!");
      router.push("/dashboard");

      // Redirect to dashboard or perform other actions
    } catch (error) {
      toast.error("Invalid email or password. Please try again.");
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold font-serif text-primary">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register("email")}
          />
          {errors.email && (
            <FieldDescription className="text-destructive">
              {errors.email.message}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && (
            <FieldDescription className="text-destructive">
              {errors.password.message}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <Button
            className="bg-primary text-[#F4D2AF] font-serif hover:bg-primary/90 px-6 py-3 rounded-full font-medium hover:scale-105 transition-transform shadow-[0_4px_0_rgba(0,0,0,1)] border-2 border-[#0E0000] disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center text-black">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
