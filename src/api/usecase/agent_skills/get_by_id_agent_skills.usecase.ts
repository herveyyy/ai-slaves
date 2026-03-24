import { eq } from "drizzle-orm";
import { db } from "../../../infra/db/client";
import { agentSkills } from "../../../infra/db/schema";

export class GetByIdAgentSkillsUseCase {
    private db = db;
    async execute(id: string): Promise<Response> {
        try {
            const result = await this.db
                .select()
                .from(agentSkills)
                .where(eq(agentSkills.id, parseInt(id)))
                .limit(1);

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
            console.error("Error fetching agent skill by id:", error);
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
