import { db } from "../../../infra/db/client";
import { agents } from "../../../infra/db/schema";
import type { AgentInsert } from "../../../shared/types";

export class CreateAgentUseCase {
    private db = db;
    async execute(body: AgentInsert): Promise<Response> {
        try {
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
}
