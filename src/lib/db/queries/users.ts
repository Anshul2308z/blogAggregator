import { db } from "../index.js";
import { users } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createUser(name: string) {
    const [user]= await db.insert(users).values({ name }).returning();
    return user;
}

export async function getUserByName(name: string) {
const user= await db.query.users.findFirst({ where: eq(users.name, name) });
return user;
}

export async function resetUsers(){
    await db.delete(users).where(eq(users.name, users.name));
};

export async function getAllUsers() {
    const allUsers = await db.select().from(users);
    return allUsers;
}
