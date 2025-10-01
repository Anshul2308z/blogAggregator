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

