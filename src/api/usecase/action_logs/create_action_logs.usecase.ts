import { db } from "../../../infra/db/client";
import { actionLogs } from "../../../infra/db/schema";
import type { ActionLogInsert } from "../../../shared/types";

export class CreateActionLogsUseCase {
    private db = db;
    async execute(body: ActionLogInsert): Promise<Response> {
        try {
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
}
