var jakmar = require('../jakmar')

var onExit = function(from) {
	console.log('leaving state', from)
}

var status = jakmar
	.create()
	.states('online', 'offline')
	.transition('connect', 'offline', 'online')
	.transition('disconnect', 'online', 'offline')
	.onExit(onExit)
	.build('offline', {})

status.connect() // should show 'leaving state offline'