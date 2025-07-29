import { NextRequest } from "next/server";

import { errorResponse, getBearerToken } from "../lib/utils";

export type Handler = (
  req: NextRequest,
  context?: unknown
) => Promise<Response>;

export function withAuth(handler: Handler): Handler {
  return async (req, context) => {
    const bearerToken = await getBearerToken();

    if (!bearerToken) {
      return errorResponse(
        "You’re not signed in—or your session has expired. Please sign in again to continue.",
        401
      );
    }

    return handler(req, context);
  };
}
