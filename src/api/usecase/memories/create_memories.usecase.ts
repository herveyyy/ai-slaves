import { db } from "../../../infra/db/client";
import { memories } from "../../../infra/db/schema";
import type { MemoryInsert } from "../../../shared/types";

export class CreateMemoriesUseCase {
    private db = db;
    async execute(request: Request): Promise<Response> {
        try {
            const body = (await request.json()) as MemoryInsert;

            if (
                !body.processId ||
                !body.department ||
                !body.agentRole ||
                !body.content
            ) {
                return new Response(
                    JSON.stringify({
                        error: "processId, department, agentRole, and content are required",
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            }

            const result = await this.db
                .insert(memories)
                .values(body)
                .returning();

            return new Response(JSON.stringify(result[0]), {
                status: 201,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error creating memory:", error);
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
