var jakmar = require('../jakmar')

var onEnter = function(to) {
	console.log('entering state', to)
}

var status = jakmar
	.create()
	.states('online', 'offline')
	.transition('connect', 'offline', 'online')
	.transition('disconnect', 'online', 'offline')
	.onEnter(onEnter)
	.build('offline', {})

status.connect() // should show 'entering state online'