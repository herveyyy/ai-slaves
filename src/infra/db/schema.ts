import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const agents = sqliteTable("agents", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    accountIndex: integer("account_index").unique().notNull(), // 0-4 mapping to .env keys
    modelType: text("model_type").default("flash"), // 'pro' or 'flash'
    role: text("role").notNull(), // 'Lead', 'Worker', 'Auditor'
    status: text("status").default("idle"), // 'idle', 'busy', 'cooldown'
    lastUsed: integer("last_used", { mode: "timestamp" }),
});

export const agentSkills = sqliteTable("agent_skills", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    agentId: integer("agent_id").references(() => agents.id),
    skillName: text("skill_name").notNull(), // e.g., 'fs-write', 'accounting-calc'
    isAllowed: integer("is_allowed", { mode: "boolean" }).default(true),
});

export const processes = sqliteTable("processes", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    department: text("department").notNull(), // 'software', 'finance', 'hr', 'construction'
    workflow: text("workflow").notNull(), // 'agile', 'linear', 'pipeline'
    status: text("status").default("idle"),
    currentStage: text("current_stage"),
    config: text("config"), // JSON string for paths/settings
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
        () => new Date(),
    ),
});

export const memories = sqliteTable("memories", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    processId: integer("process_id").references(() => processes.id),
    department: text("department").notNull(),
    agentRole: text("agent_role").notNull(),
    content: text("content").notNull(),
    metadata: text("metadata"), // JSON for { file: "...", error: "..." }
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
        () => new Date(),
    ),
});

export const actionLogs = sqliteTable("action_logs", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    processId: integer("process_id").references(() => processes.id),
    agentId: integer("agent_id").references(() => agents.id),
    skillUsed: text("skill_used").notNull(),
    input: text("input"),
    output: text("output"),
    timestamp: integer("timestamp", { mode: "timestamp" }).$defaultFn(
        () => new Date(),
    ),
});
