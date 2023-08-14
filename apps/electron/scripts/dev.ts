import chalk from "chalk";
import getPort from "get-port";
import path from "path";
import { createServer } from "vite";
import viteConfig from "vite-config";

import { TypescriptCompiler } from "./compilers/typescript";
import { logger } from "./utils/logger";

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

    await mainCompiler.start();
}

dev();
