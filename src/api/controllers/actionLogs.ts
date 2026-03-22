// src/api/controllers/actionLogs.ts
// CRUD operations for action_logs table

import { eq, and, SQL } from "drizzle-orm";
import { actionLogs } from "../../infra/db/schema";
import { db } from "../../infra/db/client";
import type { ActionLogInsert } from "../../shared/types";

export class ActionLogsController {
    private db = db;

    // GET /api/v1/actionLogs
    async getAll(request: Request): Promise<Response> {
        try {
            const url = new URL(request.url);
            const limit = parseInt(url.searchParams.get("limit") || "10");
            const offset = parseInt(url.searchParams.get("offset") || "0");
            const processId = url.searchParams.get("processId");
            const agentId = url.searchParams.get("agentId");

            let whereCondition: SQL | undefined = undefined;
            if (processId)
                whereCondition = eq(actionLogs.processId, parseInt(processId));
            if (agentId) {
                const agentCond = eq(actionLogs.agentId, parseInt(agentId));
                whereCondition = whereCondition
                    ? and(whereCondition, agentCond)
                    : agentCond;
            }

            const results = await this.db
                .select()
                .from(actionLogs)
                .where(whereCondition)
                .limit(limit)
                .offset(offset);

            return new Response(JSON.stringify(results), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error fetching action logs:", error);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
    }

    // GET /api/v1/actionLogs/:id
    async getById(request: Request, id: string): Promise<Response> {
        try {
            const result = await this.db
                .select()
                .from(actionLogs)
                .where(eq(actionLogs.id, parseInt(id)))
                .limit(1);

            if (result.length === 0) {
                return new Response(
                    JSON.stringify({ error: "Action log not found" }),
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
            console.error("Error fetching action log by id:", error);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
    }

    // POST /api/v1/actionLogs
    async create(request: Request): Promise<Response> {
        try {
            const body = (await request.json()) as ActionLogInsert;

            if (!body.processId || !body.agentId || !body.skillUsed) {
                return new Response(
                    JSON.stringify({
                        error: "processId, agentId, and skillUsed are required",
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }

            const result = await this.db
                .insert(actionLogs)
                .values(body)
                .returning();

            return new Response(JSON.stringify(result[0]), {
                status: 201,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error creating action log:", error);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
    }

    // PUT /api/v1/actionLogs/:id
    async update(request: Request, id: string): Promise<Response> {
        try {
            const body = (await request.json()) as Partial<ActionLogInsert>;

            const result = await this.db
                .update(actionLogs)
                .set(body)
                .where(eq(actionLogs.id, parseInt(id)))
                .returning();

            if (result.length === 0) {
                return new Response(
                    JSON.stringify({ error: "Action log not found" }),
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
            console.error("Error updating action log:", error);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
    }

    // DELETE /api/v1/actionLogs/:id
    async delete(request: Request, id: string): Promise<Response> {
        try {
            const result = await this.db
                .delete(actionLogs)
                .where(eq(actionLogs.id, parseInt(id)))
                .returning();

            if (result.length === 0) {
                return new Response(
                    JSON.stringify({ error: "Action log not found" }),
                    {
                        status: 404,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }

            return new Response(
                JSON.stringify({ message: "Action log deleted successfully" }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                },
            );
        } catch (error) {
            console.error("Error deleting action log:", error);
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
