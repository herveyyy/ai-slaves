// src/api/services/agents.service.ts
import type { GetAgentByIdUseCase } from "../usecase/agents/get_agent_by_id.usecase";
import { GetAgentsUseCase } from "../usecase/agents/get_agents.usecase";
import type { CreateAgentUseCase } from "../usecase/agents/create_agent.usecase";
import type { AgentInsert } from "../../shared/types";
import type { UpdateAgentUseCase } from "../usecase/agents/update_agent.usecase";

export class AgentsService {
    constructor(
        private readonly _get_agents: GetAgentsUseCase,
        private readonly _get_agent_by_id: GetAgentByIdUseCase,
        private readonly _create_agent: CreateAgentUseCase,
        private readonly _update_agent: UpdateAgentUseCase,
    ) {}

    async fetchAll(request: Request): Promise<Response> {
        return await this._get_agents.execute(request);
    }
    async fetchById(request: Request, id: string): Promise<Response> {
        return await this._get_agent_by_id.execute(request, id);
    }
    async create(request: AgentInsert): Promise<Response> {
        return await this._create_agent.execute(request);
    }
    async update(request: Request, id: string): Promise<Response> {
        return await this._update_agent.execute(request, id);
    }
}
