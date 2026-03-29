export interface IMemories {
    getAll(request: Request): Promise<Response>;
    getById(request: Request, id: string): Promise<Response>;
    // getByAgentId(request: Request, agentId: string): Promise<Response>;
    // getByProcessId(request: Request, processId: string): Promise<Response>;
    create(request: Request): Promise<Response>;
    update(request: Request, id: string): Promise<Response>;
    delete(request: Request, id: string): Promise<Response>;
}
