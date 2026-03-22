// src/api/controllers/memories.ts
// CRUD operations for memories table

import { eq, and, SQL } from "drizzle-orm";
import { memories } from "../../infra/db/schema";
import { db } from "../../infra/db/client";

type MemoryInsert = typeof memories.$inferInsert;
type MemorySelect = typeof memories.$inferSelect;

export class MemoriesController {
    private db = db;

    // GET /api/v1/memories
    async getAll(request: Request): Promise<Response> {
        try {
            const url = new URL(request.url);
            const limit = parseInt(url.searchParams.get("limit") || "10");
            const offset = parseInt(url.searchParams.get("offset") || "0");
            const processId = url.searchParams.get("processId");
            const department = url.searchParams.get("department");

            let whereCondition: SQL | undefined = undefined;
            if (processId)
                whereCondition = eq(memories.processId, parseInt(processId));
            if (department) {
                const deptCond = eq(memories.department, department);
                whereCondition = whereCondition
                    ? and(whereCondition, deptCond)
                    : deptCond;
            }

            const results = await this.db
                .select()
                .from(memories)
                .where(whereCondition)
                .limit(limit)
                .offset(offset);

            return new Response(JSON.stringify(results), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error fetching memories:", error);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
    }

    // GET /api/v1/memories/:id
    async getById(request: Request, id: string): Promise<Response> {
        try {
            const result = await this.db
                .select()
                .from(memories)
                .where(eq(memories.id, parseInt(id)))
                .limit(1);

            if (result.length === 0) {
                return new Response(
                    JSON.stringify({ error: "Memory not found" }),
                    {
                        status: 404,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }

            return new Response(JSON.stringify(result[0]), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error fetching memory by id:", error);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
    }

    // POST /api/v1/memories
    async create(request: Request): Promise<Response> {
        try {
            const body = (await request.json()) as MemoryInsert;

            if (
                !body.processId ||
                !body.department ||
                !body.agentRole ||
                !body.content
            ) {
                return new Response(
                    JSON.stringify({
                        error: "processId, department, agentRole, and content are required",
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }

            const result = await this.db
                .insert(memories)
                .values(body)
                .returning();

            return new Response(JSON.stringify(result[0]), {
                status: 201,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error creating memory:", error);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
    }

    // PUT /api/v1/memories/:id
    async update(request: Request, id: string): Promise<Response> {
        try {
            const body = (await request.json()) as Partial<MemoryInsert>;

            const result = await this.db
                .update(memories)
                .set(body)
                .where(eq(memories.id, parseInt(id)))
                .returning();

            if (result.length === 0) {
                return new Response(
                    JSON.stringify({ error: "Memory not found" }),
                    {
                        status: 404,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }

            return new Response(JSON.stringify(result[0]), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error updating memory:", error);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
    }

    // DELETE /api/v1/memories/:id
    async delete(request: Request, id: string): Promise<Response> {
        try {
            const result = await this.db
                .delete(memories)
                .where(eq(memories.id, parseInt(id)))
                .returning();

            if (result.length === 0) {
                return new Response(
                    JSON.stringify({ error: "Memory not found" }),
                    {
                        status: 404,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }

            return new Response(
                JSON.stringify({ message: "Memory deleted successfully" }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                },
            );
        } catch (error) {
            console.error("Error deleting memory:", error);
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
