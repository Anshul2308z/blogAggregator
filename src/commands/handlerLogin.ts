import { setUser } from "src/config";
import { getUserByName } from "src/lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if(args.length < 1){
        throw new Error('The login handler expects a single argument, the username');
    };
    const username = args[0]; 
    const exists = await getUserByName(username); 
    if(exists){
        setUser(args[0]);
        console.log(`${args[0]} has been set`);
    }else{
        throw new Error(`User ${username} does not exist`);
    };

};
