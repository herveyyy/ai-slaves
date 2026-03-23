import type { ActionLogInsert } from "../../shared/types";
import { CreateActionLogsUseCase } from "../usecase/action_logs/create_action_logs.usecase";
import type { GetActionLogsByIdUseCase } from "../usecase/action_logs/get_action_logs_by_id.usecase";
import type { GetAllActionLogsUseCase } from "../usecase/action_logs/get_all_action_logs.usecase";
import type { UpdateActionLogsUseCase } from "../usecase/action_logs/update_action_logs.usecase";

export class ActionLogsService {
    constructor(
        private readonly _create_action_logs: CreateActionLogsUseCase,
        private readonly _get_all_action_logs: GetAllActionLogsUseCase,
        private readonly _get_action_logs_by_id: GetActionLogsByIdUseCase,
        private readonly _update_action_logs: UpdateActionLogsUseCase,
    ) {}

    async create(request: ActionLogInsert): Promise<Response> {
        return await this._create_action_logs.execute(request);
    }
    async getAll(request: Request): Promise<Response> {
        return await this._get_all_action_logs.execute(request);
    }
    async getById(request: Request, id: string): Promise<Response> {
        return await this._get_action_logs_by_id.execute(request, id);
    }
    async update(request: ActionLogInsert, id: string): Promise<Response> {
        return await this._update_action_logs.execute(request, id);
    }
}
