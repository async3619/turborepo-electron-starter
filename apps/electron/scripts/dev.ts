import path from "path";
import { createServer } from "vite";
import viteConfig from "vite-config";

import { TypescriptCompiler } from "./compilers/typescript";

async function dev() {
    const mainCompiler = new TypescriptCompiler("main", path.join(process.cwd(), "..", "main", "tsconfig.build.json"));
    const rendererServer = await createServer({
        configFile: false,
        ...viteConfig,
        root: path.join(process.cwd(), "..", "renderer"),
    });

    await rendererServer.listen(3333);
    await mainCompiler.start();
}

dev();
