import esbuild from 'esbuild';
// import copyPlugin from 'esbuild-plugin-copy';
import serve from "create-serve";
import copy from 'esbuild-copy-plugin';

// const copy = copyPlugin.copy;
const isDevServer = process.argv.includes('dev');

esbuild
    .build({
        entryPoints: ['./src/index.ts'],
        bundle: true,
        outfile: 'assets/index.js',
        minify: true,
        sourcemap: true,
        target: ['chrome58', 'firefox57', 'safari11', 'edge18'],
        plugins: [
            // copy({
            //     resolveFrom: 'cwd',
            //     assets: {
            //       from: ['./src/index.html'],
            //       to: ['./assets/index.html'],
            //     },
            // }),
            // copy({
            //     resolveFrom: 'cwd',
            //     assets: {
            //       from: ['./src/images'],
            //       to: ['./assets/']
            //     },
            // })
        ]
    })
    .catch(() => process.exit(1));

if (isDevServer) {
    serve.start({
        port: 3000,
        root: "./assets",
        live: true,
    });
}
