import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import "dotenv/config";

const url = process.env.DB_FILE_NAME;
if (!url) throw new Error("❌ DB_FILE_NAME is missing");

const client = createClient({ url });

// Exporting 'db' directly is the standard Drizzle pattern
export const db = drizzle(client, { schema });

// You can keep the class for testing/utility if you want
export class DatabaseUtils {
    public static async test() {
        try {
            const result = await db.select().from(schema.agents).limit(1);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
}
