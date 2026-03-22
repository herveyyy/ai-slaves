# AI-Workflow Project Guidelines

## Code Style

- Use TypeScript with ES modules (module: "ESNext" in tsconfig.json)
- Runtime: Bun (not Node.js) - use `bun run` for execution
- Follow existing patterns in src/ for agent classes and skill dispatchers

## Architecture

- **Domain-Driven Design**: Agents organized by department (software, finance, hr, construction) with role-specific implementations
- **4-Layer Architecture**: Domain → Workflows → Skills → Infrastructure
- **Execution Protocols**: Choose from Loop (iterative), Linear (sequential), or Event (state-driven) based on workflow needs
- **Session Isolation**: Each request gets a unique sessionId for state management
- **RAG Memory**: Context stored per process/department in memories table

## Build and Test

- Install: `bun install`
- Run: `bun run src/infra/main.ts` (entry point)
- Test: `bun run test.ts` (database connectivity only)
- No build step required - Bun executes TypeScript directly

## Conventions

- **Multi-Agent Scaling**: Use 5 Gemini API keys (GEMINI_KEY_1-5) for round-robin load balancing
- **File Operations**: Sandbox all I/O to ./sandbox directory (TARGET_PATH env var)
- **Skill Dispatch**: Map LLM function calls to executable handlers via SkillsRegistry
- **Database**: SQLite via Drizzle ORM - ensure DB_FILE_NAME env var matches schema expectations
- **Environment**: Copy .env.example and configure all required keys (Gemini, GitHub, etc.)

See README.md for project overview and setup details.
