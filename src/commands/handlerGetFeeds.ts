import { db } from "src/lib/db";
import { users } from "src/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAllFeeds } from "src/lib/db/queries/feeds";

export async function handlerGetFeeds():Promise<void>{
    const feeds = await getAllFeeds();
    for(const feed of feeds){
        const [user] = await db.select({name: users.name}).from(users).where(eq(users.id, feed.userId))
        console.log("name:",feed.name);
        console.log("url:", feed.url);
        console.log("createdBy:", user.name)
    }
}