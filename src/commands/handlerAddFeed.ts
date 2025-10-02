import { createFeed } from "src/lib/db/queries/feeds";
import type { Feed, User } from "src/lib/db/schema";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length < 2) {
        throw new Error("The addFeed handler expects two arguments: the feed URL and the name of the feed");
    }
    const [url, nameOfFeed] = args;
    const {feed, user} = await createFeed(url, nameOfFeed);
    printFeed(feed, user);
}



export function printFeed(feed: Feed, user: User){
    for (const key in feed) {
        if (Object.prototype.hasOwnProperty.call(feed, key)) {
            const value = feed[key as keyof Feed];
            console.log(`${key}: ${value}`);
        }
    }
} ;