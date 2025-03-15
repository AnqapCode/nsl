import { relations } from "drizzle-orm/relations";
import { users, urls, sessions, accounts } from "./schema";

export const urlsRelations = relations(urls, ({one}) => ({
	user: one(users, {
		fields: [urls.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	urls: many(urls),
	sessions: many(sessions),
	accounts: many(accounts),
}));

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
}));

export const accountsRelations = relations(accounts, ({one}) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	}),
}));