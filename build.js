const esbuild = require('esbuild');
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

// Output paths
const entryFile = 'public/js/index.js';
const outFile = 'public/js/bundle.js';

// Build and compress
async function build() {
  try {
    // 1. ESBuild build
    await esbuild.build({
      entryPoints: [entryFile],
      bundle: true,
      minify: true,
      outfile: outFile,
      sourcemap: false,
      loader: {
        '.css': 'text'
      },
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });

    console.log('✅ ESBuild bundle created');

    // 2. Gzip compression
    const bundle = fs.readFileSync(outFile);
    fs.writeFileSync(`${outFile}.gz`, zlib.gzipSync(bundle));
    console.log('✅ Gzipped bundle.js');

    // 3. Brotli compression (smaller than gzip)
    fs.writeFileSync(`${outFile}.br`, zlib.brotliCompressSync(bundle));
    console.log('✅ Brotli-compressed bundle.js');
  } catch (err) {
    console.error('❌ Build failed:', err);
  }
}

build();
