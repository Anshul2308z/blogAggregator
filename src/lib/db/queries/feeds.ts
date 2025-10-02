import { readConfig } from "src/config.js";
import { db } from "../index.js";
import { feeds,  users } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createFeed(url: string, nameOfFeed: string) {
    const {currentUserName} = readConfig();
    const user= await db.query.users.findFirst({ where: eq(users.name, currentUserName) });

    if(!user) throw new Error("Current user not found. Please set a valid user in config.");
    const [existingFeed]= await db.select().from(feeds).where(eq(feeds.url, url)).limit(1);
    if(existingFeed) throw new Error("Feed with this URL already exists.");

    const userId= user.id;

    const [feed]= await db.insert(feeds).values({ name: nameOfFeed, url: url , userId: userId }).returning();
    
    return {feed, user};
}

export async function getAllFeeds() {
    const allFeeds = await db.select().from(feeds);
    return allFeeds;
};