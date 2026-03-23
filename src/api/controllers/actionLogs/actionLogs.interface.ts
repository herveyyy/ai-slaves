export interface IActionLogs {
    getAll(request: Request): Promise<Response>;
    getById(request: Request, id: string): Promise<Response>;
    create(request: Request): Promise<Response>;
    update(request: Request, id: string): Promise<Response>;
}
