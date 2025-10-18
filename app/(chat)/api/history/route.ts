import type { NextRequest } from "next/server";
// import { auth } from "@/app/(auth)/auth";
import { getChats, deleteAllChatsByUserId } from "@/lib/db/queries";
import { ChatSDKError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
  const startingAfter = searchParams.get("starting_after");
  const endingBefore = searchParams.get("ending_before");

  if (startingAfter && endingBefore) {
    return new ChatSDKError(
      "bad_request:api",
      "Only one of starting_after or ending_before can be provided."
    ).toResponse();
  }

  const chats = await getChats({
    limit,
    startingAfter,
    endingBefore,
  });

  return Response.json(chats);
}

export async function DELETE() {
  // const session = await auth();
  const session = {
    user: {
      id: '6a74b95e-cda9-4868-8196-e80783cc8d07',
      type: 'guest' as const,
      name: 'Guest',
      email: 'guest@example.com',
      image: null,
    },
  };

  if (!session?.user) {
    return new ChatSDKError("unauthorized:chat").toResponse();
  }

  const result = await deleteAllChatsByUserId({ userId: session.user.id });

  return Response.json(result, { status: 200 });
}
