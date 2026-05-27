"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema, type ResetPasswordInput } from "@repo/validators";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Spinner } from "~/components/ui/spinner";
import { trpc } from "~/trpc/client";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { token, newPassword: "" },
  });

  useEffect(() => {
    if (token) {
      form.setValue("token", token);
    }
  }, [token, form]);

  const resetPassword = trpc.auth.resetPassword.useMutation({
    onSuccess: () => {
      toast.success("Password reset successfully! You can now log in.");
      router.push("/auth/login");
    },
    onError: (error) => {
      console.error("[ResetPassword Error]:", error);
      toast.error(error.message || "Invalid or expired token. Please try again.");
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 text-zinc-50">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-sm border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm shadow-2xl shadow-black/50">
          <div className="border-b border-zinc-800 px-8 py-6">
            <h1 className="text-xl font-semibold tracking-tight text-white">
              Reset Password
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Enter your new secure password below.
            </p>
          </div>

          <div className="px-8 py-7 flex flex-col gap-6">
            <form
              onSubmit={form.handleSubmit((values) => resetPassword.mutate(values))}
              className="flex flex-col gap-5"
            >
              <FieldGroup className="gap-5">
                <Field data-invalid={!!form.formState.errors.newPassword}>
                  <FieldLabel htmlFor="reset-password" className="text-zinc-300 text-sm font-medium">
                    New Password
                  </FieldLabel>
                  <Input
                    id="reset-password"
                    type="password"
                    autoComplete="new-password"
                    aria-invalid={!!form.formState.errors.newPassword}
                    className="mt-1.5 h-11 rounded-sm border-zinc-700 bg-zinc-800/60 text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:ring-0"
                    {...form.register("newPassword")}
                  />
                  <FieldError errors={[form.formState.errors.newPassword]} />
                </Field>
              </FieldGroup>

              <Button
                type="submit"
                className="w-full h-11 bg-white text-black hover:bg-zinc-200 rounded-sm font-medium text-sm transition-all mt-1"
                disabled={resetPassword.isPending || !token}
              >
                {resetPassword.isPending && <Spinner data-icon="inline-start" />}
                {resetPassword.isPending ? "Resetting..." : "Reset Password"}
              </Button>

              {!token && (
                <p className="text-sm text-red-500 text-center mt-2">
                  Missing reset token in URL.
                </p>
              )}
            </form>
          </div>

          <div className="border-t border-zinc-800 px-8 py-5 text-center">
            <p className="text-sm text-zinc-500">
              <Link
                href="/auth/login"
                className="text-zinc-300 hover:text-white underline underline-offset-4 transition-colors"
              >
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 text-zinc-50">
        <div className="text-zinc-400">Loading...</div>
      </main>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
