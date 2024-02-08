const path = require('path')
const express = require('express')
const cors = require('cors')
const http = require('http')
const socketIO = require('socket.io')
const SSHClient = require('ssh2').Client

async function runSSHServer () {
  const app = express()
  const server = http.createServer(app)
  const io = socketIO(server)

  app.use(cors({ origin: '*' }))
  // Serve static files
  app.use('/socket.io.min.js', express.static(path.join(__dirname, 'socket.io.min.js')))
  app.use('/xterm.css', express.static(path.join(__dirname, 'xterm.css')))
  app.use('/xterm.js', express.static(path.join(__dirname, 'xterm.js')))
  app.use('/xterm-addon-fit.js', express.static(path.join(__dirname, 'xterm-addon-fit.js')))

  // Serve index.html for the root URL
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
  })

  io.on('connection', (socket) => {
    try {
      const host = socket.handshake.query.host
      const username = socket.handshake.query.username
      const password = socket.handshake.query.password

      const ssh = new SSHClient()
      ssh.on('ready', () => {
        socket.emit('data', '> SSH CONNECTION ESTABLISHED\n\r')

        ssh.shell((err, stream) => {
          if (err) {
            return socket.emit('data', '> SSH SHELL ERROR: ' + err.message + '\n\r')
          }
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
        host,
        port: 22,
        username,
        password
      })
    } catch (error) {
      socket.emit('data', '> SSH CONNECTION ERROR: ' + error + '\n\r')
    }
  })

  const port = 8000
  console.log('Listening on port', port)

  server.listen(port)
}

module.exports.runSSHServer = runSSHServer
