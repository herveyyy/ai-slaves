import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import "dotenv/config";
export class DatabaseClient {
    private static instance: ReturnType<typeof drizzle<typeof schema>>;
    public static getInstance() {
        if (!this.instance) {
            const url = process.env.DB_FILE_NAME;

            if (!url) {
                throw new Error(
                    "❌ DB_FILE_NAME is missing in .env. Example: file:local.db",
                );
            }

            const client = createClient({ url });
            this.instance = drizzle(client, { schema });

            console.log("🐘 Database Client: Online (SQLite/LibSQL)");
        }
        return this.instance;
    }

    public static async test() {
        try {
            const db = this.getInstance();
            const result = await db.select().from(schema.agents).limit(1);
            console.log("✅ DB Test Query Result:", result);
            return true;
        } catch (e) {
            console.error("🚨 DB Connection Failed:", e);
            return false;
        }
    }
}

// Export the live DB instance
export const db = DatabaseClient.getInstance();
