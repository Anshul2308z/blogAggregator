import { setUser } from "src/config";
import { createUser, getUserByName } from "src/lib/db/queries/users";

export async function handlerRegister(cmdName: string, ...args: string[]) {
    const [username] = args;
    if (!username) {
        throw new Error("The register handler expects a single argument: the username");
    }
    const exists = await getUserByName(username);

    if (exists) {
        throw new Error(`User ${username} already exists`);
    }

    const user = await createUser(username);
    console.log(`User ${user.name} has been created`);

    setUser(username);
}
