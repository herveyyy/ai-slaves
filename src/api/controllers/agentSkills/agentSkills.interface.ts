export interface IAgentSkill {
    getAll(request: Request): Promise<Response>;
    getById(id: string): Promise<Response>;
    create(request: Request): Promise<Response>;
    update(request: Request, id: string): Promise<Response>;
    delete(id: string): Promise<Response>;
}
