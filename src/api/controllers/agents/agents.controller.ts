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
            const req = (await request.json()) as AgentInsert;
            return await this._agentsService.create(req);
        } catch (error) {
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
            );
        }
    }

    @Put("/:id")
    async update(request: Request, id: string): Promise<Response> {
        try {
            const req = (await request.json()) as AgentInsert;
            return await this._agentsService.create(req);
        } catch (error) {
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
            );
        }
    }

    @Delete("/:id")
    async delete(request: Request, id: string): Promise<Response> {
        try {
            const req = (await request.json()) as AgentInsert;
            return await this._agentsService.create(req);
        } catch (error) {
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
            );
        }
    }
}
