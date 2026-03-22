// src/api/controllers/agentSkills.ts
// CRUD operations for agent_skills table

import { eq, and, SQL } from "drizzle-orm";
import { agentSkills } from "../../infra/db/schema";
import { db } from "../../infra/db/client";

type AgentSkillInsert = typeof agentSkills.$inferInsert;
type AgentSkillSelect = typeof agentSkills.$inferSelect;

export class AgentSkillsController {
    private db = db;

    async getAll(request: Request): Promise<Response> {
        try {
            const url = new URL(request.url);
            const limit = parseInt(url.searchParams.get("limit") || "10");
            const offset = parseInt(url.searchParams.get("offset") || "0");
            const agentId = url.searchParams.get("agentId");
            const skillName = url.searchParams.get("skillName");

            let whereCondition: SQL | undefined = undefined;
            if (agentId)
                whereCondition = eq(agentSkills.agentId, parseInt(agentId));
            if (skillName) {
                const skillCond = eq(agentSkills.skillName, skillName);
                whereCondition = whereCondition
                    ? and(whereCondition, skillCond)
                    : skillCond;
            }

            const results = await this.db
                .select()
                .from(agentSkills)
                .where(whereCondition)
                .limit(limit)
                .offset(offset);

            return new Response(JSON.stringify(results), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error fetching agent skills:", error);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
    }

    // GET /api/v1/agentSkills/:id
    async getById(request: Request, id: string): Promise<Response> {
        try {
            const result = await this.db
                .select()
                .from(agentSkills)
                .where(eq(agentSkills.id, parseInt(id)))
                .limit(1);

            if (result.length === 0) {
                return new Response(
                    JSON.stringify({ error: "Agent skill not found" }),
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
            console.error("Error fetching agent skill by id:", error);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
    }

    // POST /api/v1/agentSkills
    async create(request: Request): Promise<Response> {
        try {
            const body = (await request.json()) as AgentSkillInsert;

            if (!body.agentId || !body.skillName) {
                return new Response(
                    JSON.stringify({
                        error: "agentId and skillName are required",
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }

            const result = await this.db
                .insert(agentSkills)
                .values(body)
                .returning();

            return new Response(JSON.stringify(result[0]), {
                status: 201,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error creating agent skill:", error);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
    }

    // PUT /api/v1/agentSkills/:id
    async update(request: Request, id: string): Promise<Response> {
        try {
            const body = (await request.json()) as Partial<AgentSkillInsert>;

            const result = await this.db
                .update(agentSkills)
                .set(body)
                .where(eq(agentSkills.id, parseInt(id)))
                .returning();

            if (result.length === 0) {
                return new Response(
                    JSON.stringify({ error: "Agent skill not found" }),
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
            console.error("Error updating agent skill:", error);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
    }

    // DELETE /api/v1/agentSkills/:id
    async delete(request: Request, id: string): Promise<Response> {
        try {
            const result = await this.db
                .delete(agentSkills)
                .where(eq(agentSkills.id, parseInt(id)))
                .returning();

            if (result.length === 0) {
                return new Response(
                    JSON.stringify({ error: "Agent skill not found" }),
                    {
                        status: 404,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }

            return new Response(
                JSON.stringify({ message: "Agent skill deleted successfully" }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                },
            );
        } catch (error) {
            console.error("Error deleting agent skill:", error);
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
