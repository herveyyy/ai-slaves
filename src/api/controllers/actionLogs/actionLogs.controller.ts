// src/api/controllers/actionLogs.ts
// CRUD operations for action_logs table

import { eq, and, SQL } from "drizzle-orm";
import { actionLogs } from "../../../infra/db/schema";
import { db } from "../../../infra/db/client";
import type { ActionLogInsert } from "../../../shared/types";
import type { IActionLogs } from "./actionLogs.interface";
import type { ActionLogsService } from "../../services/actionLogs.service";
import { Delete, Get, Post, Put } from "../../decorators/http.decorator";

export class ActionLogsController implements IActionLogs {
    private db = db;
    constructor(private readonly _action_logs_service: ActionLogsService) {}

    @Get("/")
    async getAll(request: Request): Promise<Response> {
        try {
            const res = await this._action_logs_service.getAll(request);
            return res;
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

    @Get("/:id")
    async getById(request: Request, id: string): Promise<Response> {
        try {
            const res = await this._action_logs_service.getById(request, id);
            return res;
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

    @Post("/")
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
            return await this._action_logs_service.create(body);
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

    @Put("/:id")
    async update(request: Request, id: string): Promise<Response> {
        try {
            const body = (await request.json()) as ActionLogInsert;
            return await this._action_logs_service.update(body, id);
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
}
