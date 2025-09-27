import { create } from "domain";
import fs from "fs";
import os from "os";
import path from "path";
import { createUser, getAllUsers, getUserByName, resetUsers } from "./lib/db/queries/users";
import { register } from "module";


type Config = {
    dbUrl :string ,
    currentUserName: string 
}

export function setUser(name: string){
    const fileContent = fs.readFileSync(getConfigFilePath(), 'utf-8');
    const config = JSON.parse(fileContent);
    writeConfig(config.dbUrl, name);
}

export function readConfig(): Config {
    const fileContent = fs.readFileSync(getConfigFilePath(), 'utf-8');
    const config = JSON.parse(fileContent);
    if (!validateConfig(config)) {
        throw new Error('Invalid configuration file');
    }
    return config;    
}

export function getConfigFilePath():string{
    return path.join(os.homedir(), '/.gatorconfig.json');
};

function writeConfig(path: string, name: string){
    if(!path || !name){
        throw new Error('Invalid parameters to write config');
    };
    fs.writeFileSync(getConfigFilePath(), JSON.stringify({
        dbUrl: path,
        currentUserName: name 
}),
)
}

function validateConfig(config: Config): boolean {
    return config.dbUrl !== undefined && config.currentUserName !== undefined;
}

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>; 

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

type CommandsRegistry = {
    [cmdName: string]: CommandHandler
};

export const registry: CommandsRegistry = {
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

registerCommand(registry, "login", handlerLogin); 

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


registerCommand(registry, "register", handlerRegister);

async function handlerReset(){
    await resetUsers();
    console.log("All users have been deleted");
};

registerCommand(registry, "reset", handlerReset); // For testing purposes

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

registerCommand(registry, "users", handlerGetUsers); // For testing purposes