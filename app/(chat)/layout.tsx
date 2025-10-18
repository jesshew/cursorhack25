import { cookies } from "next/headers";
import Script from "next/script";
import { AppSidebar } from "@/components/app-sidebar";
import { DataStreamProvider } from "@/components/data-stream-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { AppUser } from "@/lib/types";
// import { auth } from "../(auth)/auth";

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
        <SidebarProvider defaultOpen={!isCollapsed}>
          {session.user.id ? <AppSidebar user={session.user} /> : null}
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </DataStreamProvider>
    </>
  );
}
