import { db } from "../../../infra/db/client";
import { agents } from "../../../infra/db/schema";

export class GetAgentsUseCase {
    private db = db;
    async execute(request: Request): Promise<Response> {
        try {
            const url = new URL(request.url);
            const limit = parseInt(url.searchParams.get("limit") || "10");
            const offset = parseInt(url.searchParams.get("offset") || "0");
            const department = url.searchParams.get("department");
            const status = url.searchParams.get("status");

            const query = this.db
                .select()
                .from(agents)
                .limit(limit)
                .offset(offset);

            const results = await query;

            return new Response(JSON.stringify(results), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error fetching agents:", error);
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
