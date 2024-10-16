// JS Bundling Tools
import * as esbuild from "npm:esbuild";
import { denoPlugins  } from "jsr:@luca/esbuild-deno-loader";

const result = await esbuild.build({
    plugins: [...denoPlugins()],
    entryPoints: ["./src/sigma/graph.js"],
    outfile: "./dist/graph.bundle.js",
    bundle: true,
    format: "esm",
    platform: "browser",
    target:"es2023",
    sourcemap:true,
    treeShaking:true,
});

esbuild.stop();