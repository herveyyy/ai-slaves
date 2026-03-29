import { eq } from "drizzle-orm";
import { db } from "../../../infra/db/client";
import { memories } from "../../../infra/db/schema";

export class GetMemoriesByIdUseCase {
    private db = db;
    async execute(id: string): Promise<Response> {
        try {
            const result = await this.db
                .select()
                .from(memories)
                .where(eq(memories.id, parseInt(id)))
                .limit(1);

            if (result.length === 0) {
                return new Response(
                    JSON.stringify({ error: "Memory not found" }),
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
            console.error("Error fetching memory by id:", error);
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
