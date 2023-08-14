import path from "path";
import fs from "fs-extra";

import { logger } from "./utils/logger";

const RENDERER_DIST = path.join(process.cwd(), "..", "renderer", "dist");
const MAIN_DIST = path.join(process.cwd(), "..", "main", "dist");
const MAIN_PACKAGE_JSON_PATH = path.join(process.cwd(), "..", "main", "package.json");
const ELECTRON_DIST = path.join(process.cwd(), "dist");

async function build() {
    logger.info("cleaning dist directory...");
    await fs.remove(ELECTRON_DIST);

    // copy each dist to electron dist directory
    logger.info("copying dist files...");

    await fs.copy(MAIN_DIST, ELECTRON_DIST);
    await fs.copy(RENDERER_DIST, path.join(ELECTRON_DIST, "renderer"));

    // copy main package.json to electron dist directory
    const mainPackageJson = await fs.readJson(MAIN_PACKAGE_JSON_PATH);
    delete mainPackageJson.devDependencies;
    mainPackageJson.main = "./main.js";

    await fs.writeJson(path.join(ELECTRON_DIST, "package.json"), mainPackageJson, { spaces: 2 });

    // install dependencies
    logger.info("installing dependencies...");

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { execSync } = require("child_process");
    execSync("npm install --omit=dev", { cwd: ELECTRON_DIST, stdio: "ignore" });
}

build();
