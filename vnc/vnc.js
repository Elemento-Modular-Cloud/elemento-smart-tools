const express = require('express')
const app = express()
const net = require('net')
const { URL } = require('url')
const path = require('path')
const bodyParser = require('body-parser')
const WebSocketServer = require('ws').Server

async function runVNCServer () {
  app.use(express.static(path.join(__dirname, 'public')))
  app.use(bodyParser.urlencoded({ extended: true }))

  const server = app.listen(10000, () => {
    console.log('[VNC service] Listening on port 10000')
  })

  const wsServer = new WebSocketServer({ server, path: '/websockify' })

  wsServer.on('connection', (wsClient, req) => {
    const clientAddr = wsClient._socket.remoteAddress
    console.log(req ? req.url : wsClient.upgradeReq.url)
    const log = msg => console.log(' ' + clientAddr + ': ' + msg)
    log('WebSocket connection from : ' + clientAddr)
    log('Version ' + wsClient.protocolVersion + ', subprotocol: ' + wsClient.protocol)

    const query = new URL(req.url, 'http://elemento.cloud').searchParams

    const targetHost = query.get('host')
    const targetPort = parseInt(query.get('port'))

    console.log('websockify: connecting to', targetHost, targetPort)

    const tcpTarget = net.createConnection(targetPort, targetHost, () => log('connected to target'))
    tcpTarget.on('data', data => {
      try {
        wsClient.send(data)
      } catch (e) {
        log('Client closed, cleaning up target')
        tcpTarget.end()
      }
    })
    tcpTarget.on('end', () => {
      log('target disconnected')
      wsClient.close()
    })
    tcpTarget.on('error', (e) => {
      console.log(e)
      log('target connection error')
      tcpTarget.end()
      wsClient.close()
    })
    wsClient.on('message', msg => {
      tcpTarget.write(msg)
    })
    wsClient.on('close', (code, reason) => {
      log(`WebSocket client disconnected: ${code} [ ${reason} ]`)
      tcpTarget.end()
    })
    wsClient.on('error', error => {
      log('WebSocket client error: ' + error)
      tcpTarget.end()
    })
  })
}

module.exports.runVNCServer = runVNCServer
