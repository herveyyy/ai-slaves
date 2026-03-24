import { eq, and, SQL } from "drizzle-orm";
import { agentSkills } from "../../../infra/db/schema";
import { db } from "../../../infra/db/client";

export class GetAllAgentSkillsUseCase {
    private db = db;
    async execute(request: Request): Promise<Response> {
        try {
            const url = new URL(request.url);
            const limit = parseInt(url.searchParams.get("limit") || "10");
            const offset = parseInt(url.searchParams.get("offset") || "0");
            const agentId = url.searchParams.get("agentId");
            const skillName = url.searchParams.get("skillName");

            let whereCondition: SQL | undefined = undefined;
            if (agentId)
                whereCondition = eq(agentSkills.agentId, parseInt(agentId));
            if (skillName) {
                const skillCond = eq(agentSkills.skillName, skillName);
                whereCondition = whereCondition
                    ? and(whereCondition, skillCond)
                    : skillCond;
            }

            const results = await this.db
                .select()
                .from(agentSkills)
                .where(whereCondition)
                .limit(limit)
                .offset(offset);

            return new Response(JSON.stringify(results), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error fetching agent skills:", error);
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
