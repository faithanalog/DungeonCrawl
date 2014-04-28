Dungeon Crawl JS
---
A basic dungeon crawler in js/typescript

Building
---
* Install the TypeScript compiler

        npm install -g typescript
* Navigate to the root directory of the repo.
* Run build.sh

        sh build.sh
    or use this command instead (contents of build.sh)

        tsc --target ES5 --removeComments --out site/game.js code/game.ts

Running
---
Install required node depedencies (run in same directory as package.json)

    npm install
To run, simply launch server.js in node.

    node server.js
You can now access the page by navigating to hostname:8080

If you would like to specify a custom port or ip to bind on:

    PORT=<port> IP=<ip> node server.js
