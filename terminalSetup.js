window.addEventListener('load', function() {

  var terminalContainer = document.getElementById('Elemento-terminal');
  const term = new Terminal({ cursorBlink: true });        
  const fitAddon = new FitAddon.FitAddon();   //manage the size of the terminal
  term.loadAddon(fitAddon);
  term.open(terminalContainer);
  fitAddon.fit(); //fit the size of the terminal according to Elemento-terminal
  
  var socket = io() //.connect();
  socket.on('connect', function() {
     term.write('\r\n** Connected **\r\n');
  });

  term.onKey(function (ev) {
     socket.emit('data', ev.key);
  });

  socket.on('data', function(data) {
    term.write(data);
  });

  socket.on('disconnect', function() {
     term.write('\r\n** Disconnected **\r\n');
  });
}, false);
