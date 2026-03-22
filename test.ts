import "dotenv/config";
import { DatabaseClient } from "./src/infra/db/client";

async function runDiagnostic() {
    console.log("---------------------------------------");
    console.log("🛠️  DIAGNOSTIC: DATABASE CONNECTION");
    console.log("---------------------------------------");
    console.log(`📂 Target: ${process.env.DB_FILE_NAME}`);

    try {
        const isHealthy = await DatabaseClient.test();

        if (isHealthy) {
            console.log("\n✅ SUCCESS: Connection established.");
            console.log("🚀 Your Drizzle client is ready for queries.");
        } else {
            console.log("\n❌ FAILED: DatabaseClient.test() returned false.");
        }
    } catch (error) {
        console.error("\n🚨 CRITICAL ERROR during execution:");
        console.error(error);
    }

    console.log("---------------------------------------");
}

runDiagnostic();
