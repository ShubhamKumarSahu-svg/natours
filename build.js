/*eslint-disable*/
// build.js
const esbuild = require('esbuild');

esbuild
  .build({
    entryPoints: ['./public/js/index.js'],
    bundle: true,
    outfile: './public/js/bundle.js',
    loader: { '.css': 'text', '.png': 'file', '.jpg': 'file', '.svg': 'file' },
    minify: true,
    sourcemap: true,
    logLevel: 'info'
  })
  .catch(() => process.exit(1));
