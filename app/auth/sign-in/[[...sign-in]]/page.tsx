"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="container mx-auto max-w-5xl py-12">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Welcome back to AI Writer</h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue using our powerful AI writing tools.
          </p>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Benefits of using AI Writer</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Text paraphrasing and enhancement</li>
              <li>Grammar checking and proofreading</li>
              <li>Text summarization and simplification</li>
              <li>Personalized settings and history</li>
            </ul>
          </div>
        </div>
        <div>
          <SignIn />
        </div>
      </div>
    </div>
  );
} 