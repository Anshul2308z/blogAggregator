import { unique } from "drizzle-orm/pg-core";
import { pgTable, timestamp, uuid, text } from "drizzle-orm/pg-core";

export const users = pgTable("users",{
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
    name: text("name").notNull().unique()
});

export const feeds = pgTable("feeds",{
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
    name: text("name").notNull(),
    url: text("url").notNull().unique(),
    userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }) // A foreign key with a cascade delete means that if a record in the parent table is deleted, then the corresponding records in the child table will automatically be deleted. This is called a cascade delete.
})

export type User = typeof users.$inferSelect; // This will create a TypeScript type that represents the shape of a row in the "users" table, including all its columns and their types.
export type Feed = typeof feeds.$inferSelect; // This will create a TypeScript type that represents the shape of a row in the "feeds" table, including all its columns and their types.

export const feedFollows = pgTable("feed_follows",{
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(), 
    updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(()=> new Date),
    userId: uuid("user_id")
    .notNull()
    .references(()=> users.id, {onDelete: "cascade"}),
    feedId: uuid("feed_id")
    .notNull()
    .references(()=> feeds.id, {onDelete: "cascade"} ),
    }, (table)=>{
        return {
            useFeedUnique: unique("use_feed_unique").on(table.userId, table.feedId),
        }
    }
)