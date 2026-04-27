"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import type { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLogin = mode === "login";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await apiFetch<{ user: User }>(isLogin ? "/auth/login" : "/auth/signup", {
        method: "POST",
        body: { email, password },
      });
      router.push("/dashboard");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-instrument-serif text-slate-900 mb-2">
          {isLogin ? "Welcome back" : "Create account"}
        </h1>
        <p className="text-slate-500">
          {isLogin
            ? "Sign in to access your folders"
            : "Get started with your personal workspace"}
        </p>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm rounded-3xl overflow-hidden">
        <CardContent className="p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-900" htmlFor={`${mode}-email`}>
                Email address
              </label>
              <Input
                id={`${mode}-email`}
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="rounded-xl border-slate-200 focus-visible:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-900" htmlFor={`${mode}-password`}>
                Password
              </label>
              <Input
                id={`${mode}-password`}
                placeholder="Minimum 6 characters"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
                required
                className="rounded-xl border-slate-200 focus-visible:ring-blue-500"
              />
            </div>

            {error ? <p className="text-sm text-rose-600 font-medium">{error}</p> : null}

            <Button className="w-full rounded-xl h-11 text-base bg-blue-600 hover:bg-blue-700" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Please wait..." : isLogin ? "Sign in" : "Sign up"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mt-8 text-center text-sm text-slate-600">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <Link className="font-semibold text-blue-600 hover:text-blue-700 hover:underline" href={isLogin ? "/signup" : "/login"}>
          {isLogin ? "Sign up" : "Sign in"}
        </Link>
      </p>
    </div>
  );
}
