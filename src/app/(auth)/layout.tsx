import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }
  return <div className="flex h-screen w-screen items-center justify-center">{children}</div>;
}
