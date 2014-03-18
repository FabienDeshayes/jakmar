var jakmar = require('../jakmar')

var status = jakmar
	.create()
	.state('online')
	.state('offline')
	.transition('connect', 'offline', 'online')
	.transition('disconnect', 'online', 'offline')
	.build('offline', {})

var count = 0
status.stateChange = function() {
	count++;
}

status.connect()
status.disconnect()
console.log(count) // 2