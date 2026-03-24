import { eq } from "drizzle-orm";
import { db } from "../../../infra/db/client";
import { agentSkills } from "../../../infra/db/schema";
import type { AgentSkillInsert } from "../../../shared/types";

export class UpdateAgentSkillsUseCase {
    private db = db;
    async execute(request: Request, id: string): Promise<Response> {
        try {
            const body = (await request.json()) as AgentSkillInsert;
            const result = await this.db
                .update(agentSkills)
                .set(body)
                .where(eq(agentSkills.id, parseInt(id)))
                .returning();

            if (result.length === 0) {
                return new Response(
                    JSON.stringify({ error: "Agent skill not found" }),
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
}
