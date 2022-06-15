import esbuild from 'esbuild';
import serve from "create-serve";
import copy from 'esbuild-copy-files-plugin';

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
            copy({
                source: ['./src/index.html', './src/images'],
                target: './public',
                copyWithFolder: true
            })
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
