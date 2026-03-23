// src/api/router.ts

import { ActionLogsController } from "./controllers/actionLogs/actionLogs.controller";
import { AgentSkillsController } from "./controllers/agentSkills";
import { MemoriesController } from "./controllers/memories";
import { ProcessesController } from "./controllers/processes";
import { AgentsController } from "./controllers/agents/agents.controller";
import { AgentsService } from "./services/agents.service";
import { GetAgentsUseCase } from "./usecase/agents/get_agents.usecase";
import { GetAgentByIdUseCase } from "./usecase/agents/get_agent_by_id.usecase";
import { ROUTE_METADATA } from "./decorators/http.decorator";
import { CreateAgentUseCase } from "./usecase/agents/create_agent.usecase";
import { UpdateAgentUseCase } from "./usecase/agents/update_agent.usecase";
import { CreateActionLogsUseCase } from "./usecase/action_logs/create_action_logs.usecase";
import { ActionLogsService } from "./services/actionLogs.service";
import { GetAllActionLogsUseCase } from "./usecase/action_logs/get_all_action_logs.usecase";
import { DeleteAgentUseCase } from "./usecase/agents/delete_agent.usecase";
import { GetActionLogsByIdUseCase } from "./usecase/action_logs/get_action_logs_by_id.usecase";
import { UpdateActionLogsUseCase } from "./usecase/action_logs/update_action_logs.usecase";

export class ApiRouter {
    private controllers: Record<string, any>;

    constructor() {
        const agentsService = new AgentsService(
            new GetAgentsUseCase(),
            new GetAgentByIdUseCase(),
            new CreateAgentUseCase(),
            new UpdateAgentUseCase(),
            new DeleteAgentUseCase(),
        );
        const actionLogsService = new ActionLogsService(
            new CreateActionLogsUseCase(),
            new GetAllActionLogsUseCase(),
            new GetActionLogsByIdUseCase(),
            new UpdateActionLogsUseCase(),
        );
        this.controllers = {
            agents: new AgentsController(agentsService),
            // processes: new ProcessesController(),
            // memories: new MemoriesController(),
            actionLogs: new ActionLogsController(actionLogsService),
            // agentSkills: new AgentSkillsController(),
        };
    }

    async handleRequest(request: Request): Promise<Response> {
        const url = new URL(request.url);
        const pathParts = url.pathname.split("/").filter(Boolean);
        const resource = pathParts[2];
        if (!resource) return this.error("Resource Not Found", 404);
        const controller = this.controllers[resource];
        if (!controller) return this.error("Resource Not Found", 404);
        const fullPathTail = "/" + pathParts.slice(3).join("/");

        const routes: any[] =
            Reflect.getMetadata(ROUTE_METADATA, controller.constructor) || [];
        const method = request.method.toLowerCase();

        // 3. Regex Matching Engine
        for (const route of routes) {
            if (route.method !== method) continue;

            const pattern = route.path
                .replace(/\//g, "\\/") // Escape slashes
                .replace(/:[^/]+/g, "([^/]+)"); // Capture segments

            const regex = new RegExp(`^${pattern}$`);
            const match = fullPathTail.match(regex);

            if (match) {
                // Extract the captured variables (id, status, etc.)
                const params = match.slice(1);
                return await controller[route.methodName](request, ...params);
            }
        }

        return this.error("Route Not Found", 404);
    }

    error(message: string, status: number): Response {
        return new Response(JSON.stringify({ error: message }), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
}
