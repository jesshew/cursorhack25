import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { healthCheck } from "@/lib/db/schema";

export const dynamic = "force-dynamic"; // prevent caching

export async function GET() {
  try {
    // Try to fetch one record from the health_check table.
    // This is a lightweight query to confirm the connection is alive.
    await db.select().from(healthCheck).limit(1);

    return NextResponse.json({
      status: "ok",
      message: "Database connection is healthy.",
    });
  } catch (error) {
    console.error("Database health check failed:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to connect to the database.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

