var jakmar = require('../jakmar')

var status = jakmar
	.create()
	.state('online')
	.state('offline')
	.transition('connect', 'offline', 'online')
	.transition('disconnect', 'online', 'offline')
	.build('offline', {})

console.log(status.state) // offline
status.disconnect() // should dispatch error