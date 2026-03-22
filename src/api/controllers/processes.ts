// src/api/controllers/processes.ts
// CRUD operations for processes table

import { eq, and, SQL } from "drizzle-orm";
import { processes } from "../../infra/db/schema";
import { db } from "../../infra/db/client";

type ProcessInsert = typeof processes.$inferInsert;
type ProcessSelect = typeof processes.$inferSelect;

export class ProcessesController {
    private db = db;

    // GET /api/v1/processes
    async getAll(request: Request): Promise<Response> {
        try {
            const url = new URL(request.url);
            const limit = parseInt(url.searchParams.get("limit") || "10");
            const offset = parseInt(url.searchParams.get("offset") || "0");
            const department = url.searchParams.get("department");
            const status = url.searchParams.get("status");

            let whereCondition: SQL | undefined = undefined;
            if (department)
                whereCondition = eq(processes.department, department);
            if (status) {
                const statusCond = eq(processes.status, status);
                whereCondition = whereCondition
                    ? and(whereCondition, statusCond)
                    : statusCond;
            }

            const results = await this.db
                .select()
                .from(processes)
                .where(whereCondition)
                .limit(limit)
                .offset(offset);

            return new Response(JSON.stringify(results), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error fetching processes:", error);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
    }

    // GET /api/v1/processes/:id
    async getById(request: Request, id: string): Promise<Response> {
        try {
            const result = await this.db
                .select()
                .from(processes)
                .where(eq(processes.id, parseInt(id)))
                .limit(1);

            if (result.length === 0) {
                return new Response(
                    JSON.stringify({ error: "Process not found" }),
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
            console.error("Error fetching process by id:", error);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
    }

    // POST /api/v1/processes
    async create(request: Request): Promise<Response> {
        try {
            const body = (await request.json()) as ProcessInsert;

            // Basic validation
            if (!body.name || !body.department || !body.workflow) {
                return new Response(
                    JSON.stringify({
                        error: "name, department, and workflow are required",
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }

            const result = await this.db
                .insert(processes)
                .values(body)
                .returning();

            return new Response(JSON.stringify(result[0]), {
                status: 201,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error creating process:", error);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
    }

    // PUT /api/v1/processes/:id
    async update(request: Request, id: string): Promise<Response> {
        try {
            const body = (await request.json()) as Partial<ProcessInsert>;

            const result = await this.db
                .update(processes)
                .set(body)
                .where(eq(processes.id, parseInt(id)))
                .returning();

            if (result.length === 0) {
                return new Response(
                    JSON.stringify({ error: "Process not found" }),
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
            console.error("Error updating process:", error);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
    }

    // DELETE /api/v1/processes/:id
    async delete(request: Request, id: string): Promise<Response> {
        try {
            const result = await this.db
                .delete(processes)
                .where(eq(processes.id, parseInt(id)))
                .returning();

            if (result.length === 0) {
                return new Response(
                    JSON.stringify({ error: "Process not found" }),
                    {
                        status: 404,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }

            return new Response(
                JSON.stringify({ message: "Process deleted successfully" }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                },
            );
        } catch (error) {
            console.error("Error deleting process:", error);
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
