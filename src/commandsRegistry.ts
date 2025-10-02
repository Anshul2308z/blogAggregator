import { handlerAddFeed } from "./commands/handlerAddFeed.js";
import { handlerAgg } from "./commands/handlerAgg.js";
import { handlerGetFeeds } from "./commands/handlerGetFeeds.js";
import { handlerGetUsers } from "./commands/handlerGetUsers.js";
import { handlerLogin } from "./commands/handlerLogin.js";
import { handlerRegister } from "./commands/handlerRegister.js";
import { handlerReset } from "./commands/handlerReset.js";




type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>; 

type CommandsRegistry = {
    [cmdName: string]: CommandHandler
}; 

export const registry: CommandsRegistry = {}; // Initially empty, will be populated by registerCommand functions linked to a string to call them in this obj.

function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler){
    registry[cmdName] = handler; 
}; // used on registry obj to add commands.


export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]){
    if(!registry?.[cmdName]){
        throw new Error("Invalid command");
    };
    await registry[cmdName](cmdName,...args);
};

/* Populating registry object using registerCommand fn */
registerCommand(registry, "register", handlerRegister);
registerCommand(registry, "login", handlerLogin); 
registerCommand(registry, "reset", handlerReset); // For testing purposes
registerCommand(registry, "users", handlerGetUsers); 
registerCommand(registry, "agg", handlerAgg);
registerCommand(registry, "addfeed", handlerAddFeed)
registerCommand(registry, "feeds", handlerGetFeeds)