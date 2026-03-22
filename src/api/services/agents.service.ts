// src/api/services/agents.service.ts
import type { request } from "http";
import type { GetAgentByIdUseCase } from "../usecase/agents/get_agent_by_id.usecase";
import { GetAgentsUseCase } from "../usecase/agents/get_agents.usecase";

export class AgentsService {
    constructor(
        private readonly _get_agents: GetAgentsUseCase,
        private readonly _get_agent_by_id: GetAgentByIdUseCase,
    ) {}

    async fetchAll(request: Request): Promise<Response> {
        return await this._get_agents.execute(request);
    }
    async fetchById(request: Request, id: string): Promise<Response> {
        return await this._get_agent_by_id.execute(request, id);
    }
}
