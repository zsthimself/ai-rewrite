"use client";

import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";

export default function SignUpPage() {
  return (
    <div className="container mx-auto max-w-5xl py-12">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Join AI Writer</h1>
          <p className="text-muted-foreground">
            Create an account to access powerful AI writing tools.
          </p>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Why join AI Writer?</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Advanced text paraphrasing and rewriting</li>
              <li>Professional grammar checking</li>
              <li>Intelligent text summarization</li>
              <li>Track your usage and unlock premium features</li>
            </ul>
          </div>
        </div>
        <div>
          <SignUp />
        </div>
      </div>
    </div>
  );
} 