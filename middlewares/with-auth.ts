import { NextRequest } from "next/server";

import { getBearerToken } from "../lib/utils";

export type Handler = (
  req: NextRequest,
  context?: unknown
) => Promise<Response>;

export function withAuth(handler: Handler): Handler {
  return async (req, context) => {
    const bearerToken = await getBearerToken();

    if (!bearerToken) {
      return new Response(
        JSON.stringify({
          error:
            "You’re not signed in—or your session has expired. Please sign in again to continue.",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return handler(req, context);
  };
}
