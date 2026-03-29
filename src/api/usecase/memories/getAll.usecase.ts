import { and, eq, type SQL } from "drizzle-orm";
import { db } from "../../../infra/db/client";
import { memories } from "../../../infra/db/schema";

export class GetAllMemoriesUseCase {
    private db = db;
    async execute(request: Request): Promise<Response> {
        try {
            const url = new URL(request.url);
            const limit = parseInt(url.searchParams.get("limit") || "10");
            const offset = parseInt(url.searchParams.get("offset") || "0");
            const processId = url.searchParams.get("processId");
            const department = url.searchParams.get("department");

            let whereCondition: SQL | undefined = undefined;
            if (processId)
                whereCondition = eq(memories.processId, parseInt(processId));
            if (department) {
                const deptCond = eq(memories.department, department);
                whereCondition = whereCondition
                    ? and(whereCondition, deptCond)
                    : deptCond;
            }

            const results = await this.db
                .select()
                .from(memories)
                .where(whereCondition)
                .limit(limit)
                .offset(offset);

            return new Response(JSON.stringify(results), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error fetching memories:", error);
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
