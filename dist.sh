rm -rf ./out &&
mkdir ./out &&
npx pkg --compress GZip --output ./out/elemento-remote-tools-1.0.0 -t node18-linux,node18-macos,node18-win elemento-remote-tools.js