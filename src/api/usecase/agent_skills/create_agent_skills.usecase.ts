import { db } from "../../../infra/db/client";
import { agentSkills } from "../../../infra/db/schema";
import type { AgentSkillInsert } from "../../../shared/types";

export class CreateAgentSkillsUseCase {
    private db = db;
    async execute(body: AgentSkillInsert): Promise<Response> {
        try {
            const result = await this.db
                .insert(agentSkills)
                .values(body)
                .returning();
            return new Response(JSON.stringify(result[0]), {
                status: 201,
                headers: { "Content-Type": "application/json" },
            });
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
}
