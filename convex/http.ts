import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();

// Register Better Auth routes with CORS enabled for client-side frameworks
authComponent.registerRoutes(http, createAuth, { cors: true });

// Export the HTTP router (Convex expects this as default export)
export default http;
