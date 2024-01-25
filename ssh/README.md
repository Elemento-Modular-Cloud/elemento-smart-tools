- $> npm install express socket.io ssh2 xterm xterm-addon-fit

### documentation:

1. xterm.js: http://xtermjs.org/docs/   show the terminal on "Elemento terminal"
2. ssh2: https://www.npmjs.com/package/ssh2?activeTab=readme    js client for ssh connection
3. socket.io: https://socket.io/docs/v4/    provide the communication to set up the ssh connection
4. expressjs: https://expressjs.com/ web framework for node.js

### license:

1. xterm.js: MIT license https://github.com/xtermjs/xterm.js/blob/master/LICENSE
2. ssh2: MIT license https://github.com/mscdex/ssh2/blob/master/LICENSE  
3. socket.io: MIT license https://github.com/socketio/socket.io/blob/main/LICENSE
4. expressjs: Creative Commons Attribution-ShareAlike 3.0 https://github.com/expressjs/expressjs.com/blob/gh-pages/LICENSE.md

- add at the end of sshClient.js the infos for the connection
- $> node sshClient.js
- open on browser at localhost:8000

### code infos:

some parts of the code are copied from the documentation or from others sources

#### index.html
lines 21 to 37: socket.io documentation https://socket.io/docs/v4/emit-cheatsheet/ 

#### sshClient.js
lines 9 to 15 and 33 to 59 https://devissuefixer.com/questions/connecting-to-remote-ssh-server-via-nodejshtml5-console
