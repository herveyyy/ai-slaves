import type { CreateMemoriesUseCase } from "../usecase/memories/create_memories.usecase";
import type { DeleteMemoriesUseCase } from "../usecase/memories/delete_memories.usecase";
import type { GetMemoriesByIdUseCase } from "../usecase/memories/get_memories_by_Id.usecase";
import type { GetAllMemoriesUseCase } from "../usecase/memories/getAll.usecase";
import type { UpdateMemoriesUseCase } from "../usecase/memories/update_memories.usecase";

export class MemoriesService {
    constructor(
        private readonly getAllMemoriesUseCase: GetAllMemoriesUseCase,
        private readonly getMemoriesByIdUseCase: GetMemoriesByIdUseCase,
        private readonly createMemoriesUseCase: CreateMemoriesUseCase,
        private readonly updateMemoriesUseCase: UpdateMemoriesUseCase,
        private readonly deleteMemoriesUseCase: DeleteMemoriesUseCase,
    ) {}
    async getAll(request: Request): Promise<Response> {
        return this.getAllMemoriesUseCase.execute(request);
    }
    async getById(request: Request, id: string): Promise<Response> {
        return this.getMemoriesByIdUseCase.execute(id);
    }
    async create(request: Request): Promise<Response> {
        return this.createMemoriesUseCase.execute(request);
    }
    async update(request: Request, id: string): Promise<Response> {
        return this.updateMemoriesUseCase.execute(request, id);
    }
    async delete(request: Request, id: string): Promise<Response> {
        return this.deleteMemoriesUseCase.execute(request, id);
    }
}
