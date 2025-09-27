import fs from "fs";
import os from "os";
import path from "path";


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

type CommandHandler = (cmdName: string, ...args: string[]) => void; 

function handlerLogin(cmdName: string, ...args: string[]) {
    if(args.length < 1){
        throw new Error('The login handler expects a single argument, the username');
    };
    setUser(args[0]);
    console.log(`${args[0]} has been set`);

};

type CommandsRegistry = {
    [cmdName: string]: CommandHandler
};

export const registry: CommandsRegistry = {
};

function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler){
    registry[cmdName] = handler; 
};

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]){
    if(!registry?.[cmdName]){
        throw new Error("Invalid command");
    };
    registry[cmdName](cmdName,...args);

};

registerCommand(registry, "login", handlerLogin); 

