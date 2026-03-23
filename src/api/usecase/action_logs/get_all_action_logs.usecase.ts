import { eq, and, SQL } from "drizzle-orm";
import { db } from "../../../infra/db/client";
import { actionLogs } from "../../../infra/db/schema";

export class GetAllActionLogsUseCase {
    private db = db;
    async execute(request: Request): Promise<Response> {
        try {
            const url = new URL(request.url);
            const limit = parseInt(url.searchParams.get("limit") || "10");
            const offset = parseInt(url.searchParams.get("offset") || "0");
            const processId = url.searchParams.get("processId");
            const agentId = url.searchParams.get("agentId");

            let whereCondition: SQL | undefined = undefined;
            if (processId)
                whereCondition = eq(actionLogs.processId, parseInt(processId));
            if (agentId) {
                const agentCond = eq(actionLogs.agentId, parseInt(agentId));
                whereCondition = whereCondition
                    ? and(whereCondition, agentCond)
                    : agentCond;
            }
            const results = await this.db
                .select()
                .from(actionLogs)
                .where(whereCondition)
                .limit(limit)
                .offset(offset);
            return new Response(JSON.stringify(results), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error fetching action logs:", error);
            return new Response(
                JSON.stringify({
                    error: "Error in Usecase while fetching data in db",
                }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
    }
}
