import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes:['/api/clerk-webhook(.*)']
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};