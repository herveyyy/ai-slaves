import { eq } from "drizzle-orm";
import { db } from "../../../infra/db/client";
import { actionLogs } from "../../../infra/db/schema";
import type { ActionLogInsert } from "../../../shared/types";

export class UpdateActionLogsUseCase {
    private db = db;
    async execute(body: ActionLogInsert, id: string): Promise<Response> {
        try {
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
}
