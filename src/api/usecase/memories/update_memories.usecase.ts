import { eq } from "drizzle-orm";
import { db } from "../../../infra/db/client";
import { memories } from "../../../infra/db/schema";
import type { MemoryInsert } from "../../../shared/types";

export class UpdateMemoriesUseCase {
    private db = db;
    async execute(request: Request, id: string): Promise<Response> {
        try {
            const body = (await request.json()) as Partial<MemoryInsert>;

            const result = await this.db
                .update(memories)
                .set(body)
                .where(eq(memories.id, parseInt(id)))
                .returning();

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
            console.error("Error updating memory:", error);
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
