import fs from "fs";
import os from "os";
import path from "path";


type Config = {
    dbUrl :string ,
    currentUserName: string 
}

// export function setUser(){
//     const fileContent = fs.readFileSync(getConfigFilePath(), 'utf-8');
//     const config = JSON.parse(fileContent);
//     writeConfig(config.db_url);

// }

// export function readConfig(): Config {
//     const configPath = path.join(os.homedir(), '.blog_aggregator_config.json');
// }

// function getConfigFilePath():string{
//     return path.join(os.homedir(), '/.gatorconfig.json');
// };

// function writeConfig(path: string){
//     fs.writeFileSync(getConfigFilePath(), JSON.stringify({
//         dbUrl: path,
//         currentUserName: 
// }),
// )
// }

// function validateConfig(config: Config): boolean {
//     return config.dbUrl !== undefined && config.currentUserName !== undefined;
// }

const a = fs.readFileSync(path.join(os.homedir(), '.gatorconfig.json'), 'utf-8');
const b = JSON.parse(a); 
console.log(b); 
// export function getConfig(): Config {