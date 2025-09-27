import { readConfig, registry, runCommand, setUser } from "./config.js";
import { argv } from 'node:process';

async function main() {
    const [cmdName, ...args] = argv.slice(2);
    await runCommand(registry, cmdName, ...args);
    process.exit(0);
}

main();