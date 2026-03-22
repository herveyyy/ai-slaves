// src/api/controllers/agents.ts
// Template for CRUD operations on agents table
// Replace 'agents' with actual table name (e.g., processes, memories)

import { eq, and, or, sql } from "drizzle-orm";
import { agents } from "../../infra/db/schema";
import { db } from "../../infra/db/client";

// Type definitions (replace with actual types from schema)
type AgentsInsert = typeof agents.$inferInsert;
type AgentsSelect = typeof agents.$inferSelect;

export class AgentsController {
    private db = db;

    async getAll(request: Request): Promise<Response> {
        try {
            const url = new URL(request.url);
            const limit = parseInt(url.searchParams.get("limit") || "10");
            const offset = parseInt(url.searchParams.get("offset") || "0");

            const results = await this.db
                .select()
                .from(agents)
                .limit(limit)
                .offset(offset);

            return new Response(JSON.stringify(results), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error fetching agents:", error);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
    }

    async getById(request: Request, id: string): Promise<Response> {
        try {
            const result = await this.db
                .select()
                .from(agents)
                .where(eq(agents.id, parseInt(id)))
                .limit(1);

            if (result.length === 0) {
                return new Response(JSON.stringify({ error: "Not found" }), {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                });
            }

            return new Response(JSON.stringify(result[0]), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error fetching agents by id:", error);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
    }

    // POST /api/v1/agents
    async create(request: Request): Promise<Response> {
        try {
            const body = (await request.json()) as AgentsInsert;

            // Add validation logic here
            const result = await this.db
                .insert(agents)
                .values(body)
                .returning();

            return new Response(JSON.stringify(result[0]), {
                status: 201,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error creating agents:", error);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
    }

    // PUT /api/v1/agents/:id
    async update(request: Request, id: string): Promise<Response> {
        try {
            const body = (await request.json()) as Partial<AgentsInsert>;

            const result = await this.db
                .update(agents)
                .set(body)
                .where(eq(agents.id, parseInt(id)))
                .returning();

            if (result.length === 0) {
                return new Response(JSON.stringify({ error: "Not found" }), {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                });
            }

            return new Response(JSON.stringify(result[0]), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error updating agents:", error);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
    }

    // DELETE /api/v1/agents/:id
    async delete(request: Request, id: string): Promise<Response> {
        try {
            const result = await this.db
                .delete(agents)
                .where(eq(agents.id, parseInt(id)))
                .returning();

            if (result.length === 0) {
                return new Response(JSON.stringify({ error: "Not found" }), {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                });
            }

            return new Response(
                JSON.stringify({ message: "Deleted successfully" }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                },
            );
        } catch (error) {
            console.error("Error deleting agents:", error);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
    }
}
