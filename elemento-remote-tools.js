const { runVNCServer } = require('./vnc/vnc')
const { runRDPServer } = require('./rdp/rdp')
const { runSSHServer } = require('./ssh/ssh')

/***
 * VNC server
 */
runVNCServer()

/***
 * SSH server
 */
runSSHServer()

/***
 * RDP server
 */
runRDPServer()
