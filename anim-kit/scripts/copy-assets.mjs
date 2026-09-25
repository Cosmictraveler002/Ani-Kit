import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const from = join(root, "src", "styles", "anim-kit.css");
const to = join(root, "dist", "styles", "anim-kit.css");

await mkdir(dirname(to), { recursive: true });
await copyFile(from, to);
console.log(`copied styles -> ${to}`);
