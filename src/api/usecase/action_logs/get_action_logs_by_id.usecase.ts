import { eq } from "drizzle-orm";
import { db } from "../../../infra/db/client";
import { actionLogs } from "../../../infra/db/schema";

export class GetActionLogsByIdUseCase {
    private db = db;
    async execute(request: Request, id: string): Promise<Response> {
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
}
