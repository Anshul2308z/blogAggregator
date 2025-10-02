import { argv } from 'node:process';
import { registry, runCommand } from './commandsRegistry';

async function main() {
    const [cmdName, ...args] = argv.slice(2);
    await runCommand(registry, cmdName, ...args);
    process.exit(0);
}

main();