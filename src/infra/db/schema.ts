import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const agents = sqliteTable("agents", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    accountIndex: integer("account_index").unique().notNull(),
    modelType: text("model_type").default("flash"),
    role: text("role").notNull(),
    status: text("status").default("idle"),
    lastUsed: integer("last_used", { mode: "timestamp" }),
});

export const agentSkills = sqliteTable("agent_skills", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    agentId: integer("agent_id").references(() => agents.id),
    skillName: text("skill_name").notNull(),
    isAllowed: integer("is_allowed", { mode: "boolean" }).default(true),
});

export const processes = sqliteTable("processes", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    department: text("department").notNull(),
    workflow: text("workflow").notNull(),
    status: text("status").default("idle"),
    currentStage: text("current_stage"),
    config: text("config"),
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
    metadata: text("metadata"),
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
