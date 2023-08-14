import chalk from "chalk";
import getPort from "get-port";
import path from "path";
import { createServer } from "vite";
import viteConfig from "vite-config";
import { ChildProcess } from "child_process";

import { TypescriptCompiler } from "./compilers/typescript";

import { logger } from "./utils/logger";
import { spawnProcess, treeKillSync } from "./utils/process";

let childProcessRef: ChildProcess | undefined = undefined;
const handleClose = () => childProcessRef?.pid && treeKillSync(childProcessRef.pid);
process.on("SIGINT", handleClose);
process.on("SIGTERM", handleClose);
process.on("exit", handleClose);

function startElectronApp(port: number) {
    if (childProcessRef?.pid) {
        logger.info("restarting electron app...");

        childProcessRef.removeAllListeners("exit");
        childProcessRef.on("exit", () => {
            childProcessRef = spawnProcess(port);
            childProcessRef.on("exit", () => (childProcessRef = undefined));
        });

        childProcessRef.stdin && (childProcessRef.stdin as typeof process.stdin).pause();
        treeKillSync(childProcessRef.pid);
    } else {
        logger.info("starting electron app...");

        childProcessRef = spawnProcess(port);
        childProcessRef.on("exit", (code: number) => {
            (process as any).exitCode = code;
            childProcessRef = undefined;
        });
    }
}

async function dev() {
    const availablePort = await getPort({ port: 3000 });
    const mainCompiler = new TypescriptCompiler("main", path.join(process.cwd(), "..", "main", "tsconfig.build.json"));
    const rendererServer = await createServer({
        configFile: false,
        ...viteConfig,
        root: path.join(process.cwd(), "..", "renderer"),
    });

    await rendererServer.listen(availablePort);
    logger.info(`renderer dev server is started to listen on port ${chalk.green(availablePort)}.`);

    mainCompiler.on("success", async () => {
        startElectronApp(availablePort);
    });

    await mainCompiler.start();
}

dev();
