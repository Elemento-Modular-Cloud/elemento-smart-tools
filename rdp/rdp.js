/*
 * Copyright (c) 2015 Sylvain Peyrefitte
 *
 * This file is part of mstsc.js.
 *
 * mstsc.js is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

const express = require('express')
const http = require('http')
const path = require('path')

async function runRDPServer () {
  const app = express()
  app.use(express.static(path.join(__dirname, '/client')))
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'html', 'index.html'))
  })
  const server = http.createServer(app).listen(process.env.PORT || 9000)
  console.log('[RDP service] Listening on port 9000')
  require('./server/mstsc')(server)
}

module.exports.runRDPServer = runRDPServer
