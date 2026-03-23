async function testAPI() {
    const baseURL = "http://localhost:3000";

    try {
        // 1. Test standard GET
        console.log("\n--- Testing standard GET /agents ---");
        const agentsResponse = await fetch(`${baseURL}/api/v1/agents`);
        console.log(
            "Status:",
            agentsResponse.status,
            await agentsResponse.json(),
        );
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
        // 2. Test Deep Path GET (The / / / / / / test)
        console.log("\n--- Testing Deep Path /agents/processes/101/true ---");
        const deepResponse = await fetch(
            `${baseURL}/api/v1/agents/processes/101/true`,
        );
        console.log("Status:", deepResponse.status, await deepResponse.json());

        // 3. Test POST with Body
        console.log("\n--- Testing POST /agents ---");
        const createResponse = await fetch(`${baseURL}/api/v1/agents`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                accountIndex: 0,
                role: "Architect",
                status: "active",
            }),
        });

        console.log(
            "Status:",
            createResponse.status,
            await createResponse.json(),
        );
    } catch (error) {
        console.error("🚨 Test failed:", error);
    }
}

testAPI();
