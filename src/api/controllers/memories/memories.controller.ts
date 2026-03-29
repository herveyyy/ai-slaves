import type { IMemories } from "./memories.interface";
import { MemoriesService } from "../../services/memories.service";
import { Delete, Get, Post, Put } from "../../decorators/http.decorator";

export class MemoriesController implements IMemories {
    constructor(private readonly memoriesService: MemoriesService) {}

    @Get("/")
    async getAll(request: Request): Promise<Response> {
        return await this.memoriesService.getAll(request);
    }
    @Get("/:id")
    async getById(request: Request, id: string): Promise<Response> {
        return await this.memoriesService.getById(request, id);
    }

    @Post("/")
    async create(request: Request): Promise<Response> {
        return await this.memoriesService.create(request);
    }

    @Put("/:id")
    async update(request: Request, id: string): Promise<Response> {
        return await this.memoriesService.update(request, id);
    }

    @Delete("/:id")
    async delete(request: Request, id: string): Promise<Response> {
        return await this.memoriesService.delete(request, id);
    }
}
