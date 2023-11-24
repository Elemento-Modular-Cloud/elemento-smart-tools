const express = require('express')
const http = require('http')
const path = require('path')

const app = express()
app.use(express.static(path.join(__dirname, '/client')))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/html/index.html'))
})
console.log('Listening on port 9000')
const server = http.createServer(app).listen(9000)

require('./server/mstsc')(server)
