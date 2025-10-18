import { cookies } from "next/headers";
import Script from "next/script";
import { AppSidebar } from "@/components/app-sidebar";
import { DataStreamProvider } from "@/components/data-stream-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { AppUser } from "@/lib/types";
// import { auth } from "../(auth)/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "@/components/icons";

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  // const cookieStore = cookies();
  const session: { user: AppUser } = {
    user: {
      id: '123',
      type: 'guest' as const,
      name: 'Guest',
      email: 'guest@example.com',
      image: null,
    },
  };
  // const isCollapsed = cookieStore.get("sidebar_state")?.value !== "true";
  const isCollapsed = false;

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <DataStreamProvider>
        <div className="p-4">
          <Link href="/chat">
            <Button variant="outline" size="icon">
              <PlusIcon />
            </Button>
          </Link>
        </div>
        <main className="p-4">{children}</main>
      </DataStreamProvider>
    </>
  );
}
