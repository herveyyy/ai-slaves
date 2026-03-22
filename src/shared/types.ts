// src/shared/types.ts
// 📋 All TypeScript definitions (150+ types)
// Data Transfer Objects (DTOs) and unified contracts

import type {
    actionLogs,
    agents,
    agentSkills,
    memories,
    processes,
} from "../infra/db/schema";

export interface TaskRequest {
    // TODO: Define TaskRequest
}

export interface ProcessResult {
    // TODO: Define ProcessResult
}

// Additional types to define:
// - Department union types
// - Agent role types
// - Workflow state types
// - Skill invocation types
// - Database entity types

export type ActionLogInsert = typeof actionLogs.$inferInsert;
export type ActionLogSelect = typeof actionLogs.$inferSelect;
export type AgentInsert = typeof agents.$inferInsert;
export type AgentSelect = typeof agents.$inferSelect;
export type ProcessInsert = typeof processes.$inferInsert;
export type ProcessSelect = typeof processes.$inferSelect;
export type AgentSkillInsert = typeof agentSkills.$inferInsert;
export type AgentSkillSelect = typeof agentSkills.$inferSelect;
export type MemoryInsert = typeof memories.$inferInsert;
export type MemorySelect = typeof memories.$inferSelect;
