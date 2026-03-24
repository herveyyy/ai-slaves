import type { AgentSkillInsert } from "../../shared/types";
import type { CreateAgentSkillsUseCase } from "../usecase/agent_skills/create_agent_skills.usecase";
import type { DeleteAgentSkillsUseCase } from "../usecase/agent_skills/delete_agent_skills.usecase";
import type { GetAllAgentSkillsUseCase } from "../usecase/agent_skills/get_all_agent_skills.usecase";
import type { GetByIdAgentSkillsUseCase } from "../usecase/agent_skills/get_by_id_agent_skills.usecase";
import type { UpdateAgentSkillsUseCase } from "../usecase/agent_skills/update_agent_skills.usecase";

export class AgentSkillsService {
    constructor(
        private readonly _getAllAgentSkillsUseCase: GetAllAgentSkillsUseCase,
        private readonly _getAgentSkillByIdUseCase: GetByIdAgentSkillsUseCase,
        private readonly _createAgentSkillsUseCase: CreateAgentSkillsUseCase,
        private readonly _updateAgentSkillsUseCase: UpdateAgentSkillsUseCase,
        private readonly _deleteAgentSkillsUseCase: DeleteAgentSkillsUseCase,
    ) {}
    async getAll(request: Request): Promise<Response> {
        return await this._getAllAgentSkillsUseCase.execute(request);
    }
    async getById(id: string): Promise<Response> {
        return await this._getAgentSkillByIdUseCase.execute(id);
    }
    async create(body: AgentSkillInsert): Promise<Response> {
        return await this._createAgentSkillsUseCase.execute(body);
    }
    async update(request: Request, id: string): Promise<Response> {
        return await this._updateAgentSkillsUseCase.execute(request, id);
    }
    async delete(id: string): Promise<Response> {
        return await this._deleteAgentSkillsUseCase.execute(id);
    }
}
