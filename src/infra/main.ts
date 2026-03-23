// src/infra/main.ts
// 🌐 Native Bun.serve() entry point
// HTTP + WebSocket gateway

import { ApiRouter } from "../api/routes";
import { spawn } from "bun";
export async function startDrizzleStudio() {
    const proc = spawn(["bunx", "drizzle-kit", "studio"], {
        stdio: ["inherit", "inherit", "inherit"],
    });

    await proc.exited;
}
export function startServer() {
    const apiRouter = new ApiRouter();

    const server = Bun.serve({
        port: process.env.PORT || 3000,
        async fetch(request) {
            const url = new URL(request.url);

            // API routes
            if (url.pathname.startsWith("/api/")) {
                return await apiRouter.handleRequest(request);
            }

            // Health check
            if (url.pathname === "/health") {
                return new Response(JSON.stringify({ status: "ok" }), {
                    headers: { "Content-Type": "application/json" },
                });
            }

            // Default response
            return new Response("AI-Workflow API Server", {
                headers: { "Content-Type": "text/plain" },
            });
        },
    });
    console.log(`🚀 Server running on ${server.url}`);
}

// Start the server when this file is run directly
if (import.meta.main) {
    startDrizzleStudio();
    startServer();
}
