import { createAPIFileRoute } from "@tanstack/react-start/api";
import { handler } from "@/lib/convex";

export const APIRoute = createAPIFileRoute("/api/auth/$")({
  GET: handler,
  POST: handler,
  OPTIONS: handler,
});
