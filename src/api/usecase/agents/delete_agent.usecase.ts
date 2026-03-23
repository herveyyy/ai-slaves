import { eq } from "drizzle-orm";
import { agents } from "../../../infra/db/schema";
import { db } from "../../../infra/db/client";
export class DeleteAgentUseCase {
    private db = db;
    async execute(id: string): Promise<Response> {
        try {
            const result = await this.db
                .update(agents)
                .set({ status: "deleted" })
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
}
