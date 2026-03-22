import { eq } from "drizzle-orm";
import { agents } from "../../../infra/db/schema";
import type { AgentInsert } from "../../../shared/types";
import { db } from "../../../infra/db/client";
export class UpdateAgentUseCase {
    private db = db;
    async execute(request: Request, id: string): Promise<Response> {
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
}
