import { readConfig, registry, runCommand, setUser } from "./config.js";
import { argv } from 'node:process';

function main() {
    const [cmdName, ...args] = argv.slice(2);
    runCommand(registry, cmdName, ...args);
}

main();