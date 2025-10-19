import { cookies } from "next/headers";
import Script from "next/script";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataStreamProvider } from "@/components/data-stream-provider";
// import { AppSidebar } from "@/components/app-sidebar";
// import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
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
        {/*
          The SidebarProvider component was used to manage the state of the sidebar.
          It has been commented out to remove the sidebar from the UI.
        */}
        {/* <SidebarProvider defaultOpen={!isCollapsed}> */}
        {/*
          The AppSidebar component displayed the chat history and navigation.
          It's been commented out to create a more minimal interface.
        */}
        {/* {session.user.id ? <AppSidebar user={session.user} /> : null} */}
        {/*
          The SidebarInset component was used to create a layout with a sidebar.
          It has been commented out to remove the sidebar.
        */}
        {/* <SidebarInset>{children}</SidebarInset> */}
        {/* </SidebarProvider> */}
        
        {/* Main chat container with background image */}
        <div className="relative flex h-full w-full flex-col overflow-hidden">
          {/* Background Image with horizontal shift for chat route */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: "url(/static/landing_page.png)",
              backgroundSize: "cover",
              backgroundPosition: "right -100px center", // Shifted to show more of the image
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* White translucent overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
          </div>

          {/* New chat button - fixed position */}
          <Link href="/" className="fixed top-4 right-4 z-50">
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </Link>

          {/* Content wrapper with relative positioning */}
          <div className="relative z-10 flex h-full w-full flex-col">
            {children}
          </div>
        </div>
      </DataStreamProvider>
    </>
  );
}
