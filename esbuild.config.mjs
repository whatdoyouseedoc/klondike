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
        outfile: 'public/index.js',
        minify: true,
        sourcemap: true,
        target: ['chrome58', 'firefox57', 'safari11', 'edge18'],
        plugins: [
            // copy({
            //     resolveFrom: 'cwd',
            //     public: {
            //       from: ['./src/index.html'],
            //       to: ['./public/index.html'],
            //     },
            // }),
            // copy({
            //     resolveFrom: 'cwd',
            //     public: {
            //       from: ['./src/images'],
            //       to: ['./public/']
            //     },
            // })
        ]
    })
    .catch(() => process.exit(1));

if (isDevServer) {
    serve.start({
        port: 3000,
        root: "./public",
        live: true,
    });
}
