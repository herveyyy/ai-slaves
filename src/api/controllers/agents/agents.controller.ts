// src/api/controllers/agents.ts
// CRUD operations for agents table

import { eq } from "drizzle-orm";
import { agents } from "../../../infra/db/schema";
import { db } from "../../../infra/db/client";
import type { AgentInsert } from "../../../shared/types";
import type { IAgents } from "./agents.interface";
import { AgentsService } from "../../services/agents.service";
import { Delete, Get, Post, Put } from "../../decorators/http.decorator";
export class AgentsController implements IAgents {
    private db = db;
    constructor(private readonly _agentsService: AgentsService) {}

    @Get("/")
    async getAll(request: Request): Promise<Response> {
        try {
            return await this._agentsService.fetchAll(request);
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

    @Get("/:id")
    async getById(request: Request, id: string): Promise<Response> {
        try {
            return await this._agentsService.fetchById(request, id);
        } catch (error) {
            console.error("Error fetching agent by id:", error);
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
    @Post("/")
    async create(request: Request): Promise<Response> {
        try {
            const body = (await request.json()) as AgentInsert;

            // Basic validation
            if (!body.accountIndex || !body.role) {
                return new Response(
                    JSON.stringify({
                        error: "accountIndex and role are required",
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }

            const result = await this.db
                .insert(agents)
                .values(body)
                .returning();

            return new Response(JSON.stringify(result[0]), {
                status: 201,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error creating agent:", error);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
    }

    @Put("/:id")
    async update(request: Request, id: string): Promise<Response> {
        try {
            const body = (await request.json()) as Partial<AgentInsert>;

            const result = await this.db
                .update(agents)
                .set(body)
                .where(eq(agents.id, parseInt(id)))
                .returning();

            if (result.length === 0) {
                return new Response(
                    JSON.stringify({ error: "Agent not found" }),
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
            console.error("Error updating agent:", error);
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
    }

    @Delete("/:id")
    async delete(request: Request, id: string): Promise<Response> {
        try {
            const result = await this.db
                .delete(agents)
                .where(eq(agents.id, parseInt(id)))
                .returning();

            if (result.length === 0) {
                return new Response(
                    JSON.stringify({ error: "Agent not found" }),
                    {
                        status: 404,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }

            return new Response(
                JSON.stringify({ message: "Agent deleted successfully" }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                },
            );
        } catch (error) {
            console.error("Error deleting agent:", error);
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
