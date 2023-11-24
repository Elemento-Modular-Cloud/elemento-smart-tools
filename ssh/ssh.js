const fs = require('fs')
const path = require('path')
const server = require('http').createServer(onRequest)
const io = require('socket.io')(server)
const SSHClient = require('ssh2').Client

// Load static files into memory
const staticFiles = {}
let basePath = path.join(require.resolve('xterm'), '..')
staticFiles['/xterm.css'] = fs.readFileSync(path.join(basePath, '../css/xterm.css'))
staticFiles['/xterm.js'] = fs.readFileSync(path.join(basePath, 'xterm.js'))
basePath = path.join(require.resolve('xterm-addon-fit'), '..')
staticFiles['/xterm-addon-fit.js'] = fs.readFileSync(path.join(basePath, 'xterm-addon-fit.js'))
staticFiles['/'] = fs.readFileSync(path.join(__dirname, 'index.html'))

function onRequest (req, res) {
  let file
  if (req.method === 'GET' && (file = staticFiles[req.url])) {
    res.writeHead(200, {
      'Content-Type': 'text/' +
        (/css$/.test(req.url) ? 'css' : (/js$/.test(req.url) ? 'javascript' : 'html'))
    })
    return res.end(file)
  }
  res.writeHead(404)
  res.end()
}

io.on('connection', (socket) => {
  try {
    const ssh = new SSHClient()
    ssh.on('ready', () => {
      socket.emit('data', '> SSH CONNECTION ESTABLISHED\n\r')

      ssh.shell((err, stream) => {
        if (err) { return socket.emit('data', '> SSH SHELL ERROR: ' + err.message + '\n\r') }
        socket.on('data', (data) => {
          stream.write(data)
        })
        stream.on('data', (d) => {
          socket.emit('data', d.toString('binary'))
        }).on('close', () => {
          ssh.end()
        })
      })
    })

    ssh.on('close', () => {
      socket.emit('data', '> SSH CONNECTION CLOSED\n\r')
    })

    ssh.on('error', (err) => {
      socket.emit('data', '> SSH CONNECTION ERROR: ' + err.message + '\n\r')
    })

    ssh.connect({
      host: '172.16.24.182',
      port: 22,
      username: 'elemento',
      password: '0000'
    })
  } catch (error) {
    socket.emit('data', '> SSH CONNECTION ERROR: ' + error + '\n\r')
  }
})

const port = 8000
console.log('Listening on port', port)
server.listen(port)
