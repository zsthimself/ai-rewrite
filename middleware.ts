import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define protected routes
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/account(.*)']);

// Define public routes - ensure all auth paths are public
const isPublicRoute = createRouteMatcher(['/', '/auth(.*)', '/auth/sign-in(.*)', '/auth/sign-up(.*)']);

// Configure middleware to protect specific routes
export default clerkMiddleware(async (auth, req) => {
  // If it's a protected route, require authentication
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 
