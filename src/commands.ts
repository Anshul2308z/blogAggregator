import { readConfig, setUser } from "./config.js";
import { createUser, getAllUsers, getUserByName, resetUsers } from "./lib/db/queries/users";
import { fetchFeed } from "./rss.js";

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>; 

type CommandsRegistry = {
    [cmdName: string]: CommandHandler
};

export const registry: CommandsRegistry = {
};

async function handlerLogin(cmdName: string, ...args: string[]) {
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

function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler){
    registry[cmdName] = handler; 
};

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]){
    if(!registry?.[cmdName]){
        throw new Error("Invalid command");
    };
    await registry[cmdName](cmdName,...args);

};

async function handlerRegister(cmdName: string, ...args: string[]) {
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

async function handlerReset(){
    await resetUsers();
    console.log("All users have been deleted");
};

async function handlerGetUsers(){
    const users = await getAllUsers();
    users.forEach(
        (u)=>{
            const name = u.name;
            if(u.name === readConfig().currentUserName){
                console.log(`* ${name} (current)`);
            }else{
                console.log(`* ${name}`);
            }
        });
};

export async function handlerAgg(_: string) {
  const feedURL = "https://www.wagslane.dev/index.xml";

  const feedData = await fetchFeed(feedURL);
  const feedDataStr = JSON.stringify(feedData, null, 2);
  console.log(feedDataStr);
}



registerCommand(registry, "register", handlerRegister);
registerCommand(registry, "login", handlerLogin); 
registerCommand(registry, "reset", handlerReset); // For testing purposes
registerCommand(registry, "users", handlerGetUsers); 
registerCommand(registry, "agg", handlerAgg);

