// src/api/controllers/agentSkills.ts
// CRUD operations for agent_skills table

import type { IAgentSkill } from "./agentSkills.interface";
import type { AgentSkillInsert } from "../../../shared/types";
import type { AgentSkillsService } from "../../services/agentSkills.service";
import { Delete, Get, Post, Put } from "../../decorators/http.decorator";

export class AgentSkillsController implements IAgentSkill {
    constructor(private readonly _agent_skills: AgentSkillsService) {}
    @Get("/")
    async getAll(request: Request): Promise<Response> {
        try {
            return await this._agent_skills.getAll(request);
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

    @Get("/:id")
    async getById(id: string): Promise<Response> {
        try {
            return await this._agent_skills.getById(id);
        } catch (error) {
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
    }

    @Post("/")
    async create(request: Request): Promise<Response> {
        try {
            console.log(request);
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
            return await this._agent_skills.create(body);
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

    @Put("/:id")
    async update(request: Request, id: string): Promise<Response> {
        try {
            return await this._agent_skills.update(request, id);
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

    @Delete("/:id")
    async delete(id: string): Promise<Response> {
        try {
            return await this._agent_skills.delete(id);
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
