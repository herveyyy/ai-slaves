async function testAgents() {
    const baseURL = "http://localhost:3000";

    try {
        // 1. Test standard GET
        console.log("\n--- Testing standard GET /agents ---");
        const agentsResponse = await fetch(`${baseURL}/api/v1/agents`);
        const agentsData = await agentsResponse.json();
        console.log("Status:", agentsResponse.status, agentsData);

        // Test GET by ID
        console.log("\n--- Testing GET /agents/:id ---");
        const agentId = "1";
        const getByIdResponse = await fetch(
            `${baseURL}/api/v1/agents/${agentId}`,
        );
        console.log(
            "Status:",
            getByIdResponse.status,
            await getByIdResponse.json(),
        );

        // 3. Test POST with Body (use unique accountIndex)
        console.log("\n--- Testing POST /agents ---");
        const timestamp = Date.now();
        const createResponse = await fetch(`${baseURL}/api/v1/agents`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                accountIndex: timestamp % 1000000, // Use unique value
                role: "Engineer",
                status: "active",
            }),
        });
        const createdAgent = await createResponse.json();
        console.log("Status:", createResponse.status, createdAgent);

        return createdAgent;
    } catch (error) {
        console.error("🚨 Test agents failed:", error);
    }
}

async function testActionLogs() {
    const baseURL = "http://localhost:3000";

    try {
        // First, get an agent to use valid ID
        const agentsResponse = await fetch(`${baseURL}/api/v1/agents`);
        const agents = await agentsResponse.json();

        if (!Array.isArray(agents) || agents.length === 0) {
            console.log("\n⚠️  No agents found. Create an agent first.");
            return;
        }

        const agentId = agents[0].id;
        console.log("\n=== ACTION LOGS TESTS ===");
        console.log("Using Agent ID:", agentId);

        // 1. Test GET all action logs
        console.log("\n--- Testing GET /actionLogs ---");
        const allResponse = await fetch(`${baseURL}/api/v1/actionLogs`);
        const allLogs = await allResponse.json();
        console.log(
            "Status:",
            allResponse.status,
            "Count:",
            Array.isArray(allLogs) ? allLogs.length : 0,
        );

        // 2. Test GET action log by ID
        console.log("\n--- Testing GET /actionLogs/:id ---");
        const logId = "1";
        const getByIdResponse = await fetch(
            `${baseURL}/api/v1/actionLogs/${logId}`,
        );
        console.log(
            "Status:",
            getByIdResponse.status,
            await getByIdResponse.json(),
        );

        // 3. Test CREATE action log
        // NOTE: You need to create a process first.
        // Either enable ProcessesController or use Drizzle Studio to insert a process record.
        console.log("\n--- Testing POST /actionLogs ---");
        console.log("⚠️  NOTE: You need a process with ID 1 in the database.");
        console.log(
            "   Use Drizzle Studio (https://local.drizzle.studio) to insert a process.",
        );
        console.log(
            "   Example process: { name: 'Test', department: 'Engineering', workflow: 'linear', status: 'active' }",
        );

        const createResponse = await fetch(`${baseURL}/api/v1/actionLogs`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                processId: 1, // This process must exist in the database
                agentId: agentId,
                skillUsed: "communication",
            }),
        });
        const createdData = await createResponse.json();
        console.log("Status:", createResponse.status);
        if (createResponse.ok) {
            console.log("Response:", createdData);
            const newLogId = createdData?.[0]?.id || "1";

            // 4. Test UPDATE action log
            console.log("\n--- Testing PUT /actionLogs/:id ---");
            const updateResponse = await fetch(
                `${baseURL}/api/v1/actionLogs/${newLogId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        processId: 1,
                        agentId: agentId,
                        skillUsed: "communication",
                    }),
                },
            );
            console.log(
                "Status:",
                updateResponse.status,
                await updateResponse.json(),
            );
        } else {
            console.log("Error:", createdData);
        }
    } catch (error) {
        console.error("🚨 Action Logs test failed:", error);
    }
}
async function testAgentSkills() {
    const baseURL = "http://localhost:3000";

    try {
        // First, get an agent to use valid ID
        const agentsResponse = await fetch(`${baseURL}/api/v1/agents`);
        const agents = await agentsResponse.json();

        if (!Array.isArray(agents) || agents.length === 0) {
            console.log("\n⚠️  No agents found. Create an agent first.");
            return;
        }

        const agentId = agents[0].id;
        console.log("\n=== AGENT SKILLS TESTS ===");
        console.log("Using Agent ID:", agentId);

        // 1. Test GET all agent skills
        console.log("\n--- Testing GET /agentSkills ---");
        const allResponse = await fetch(`${baseURL}/api/v1/agentSkills`);
        const allSkills = await allResponse.json();
        console.log(
            "Status:",
            allResponse.status,
            "Count:",
            Array.isArray(allSkills) ? allSkills.length : 0,
        );

        // 2. Test GET agent skill by ID
        console.log("\n--- Testing GET /agentSkills/:id ---");
        const skillId = "1";
        const getByIdResponse = await fetch(
            `${baseURL}/api/v1/agentSkills/${skillId}`,
        );
        console.log(
            "Status:",
            getByIdResponse.status,
            await getByIdResponse.json(),
        );

        // 3. Test CREATE agent skill
        console.log("\n--- Testing POST /agentSkills ---");
        const createResponse = await fetch(`${baseURL}/api/v1/agentSkills`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                agentId: agentId,
                skillName: "communication",
                isAllowed: true,
                status: "active",
            }),
        });
        const createdData = await createResponse.json();
        console.log("Status:", createResponse.status);
        if (createResponse.ok) {
            console.log("Response:", createdData);
            const newSkillId = createdData.id || "1";

            // 4. Test UPDATE agent skill
            console.log("\n--- Testing PUT /agentSkills/:id ---");
            const updateResponse = await fetch(
                `${baseURL}/api/v1/agentSkills/${newSkillId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        agentId: agentId,
                        skillName: "communication",
                        isAllowed: false,
                        status: "inactive",
                    }),
                },
            );
            console.log(
                "Status:",
                updateResponse.status,
                await updateResponse.json(),
            );

            // 5. Test DELETE agent skill
            console.log("\n--- Testing DELETE /agentSkills/:id ---");
            const deleteResponse = await fetch(
                `${baseURL}/api/v1/agentSkills/${newSkillId}`,
                {
                    method: "DELETE",
                },
            );
            console.log(
                "Status:",
                deleteResponse.status,
                await deleteResponse.json(),
            );
        } else {
            console.log("Error:", createdData);
        }
    } catch (error) {
        console.error("🚨 Agent Skills test failed:", error);
    }
}

// Run specific test based on command line argument
const args = process.argv.slice(2);
const testType = args[0] || "all";

if (testType === "agents" || testType === "all") {
    await testAgents();
}

if (testType === "action-logs" || testType === "all") {
    await testActionLogs();
}

if (testType === "agent-skills" || testType === "all") {
    await testAgentSkills();
}
