var jakmar = require('../jakmar')

var connectionStatusMachineDefinition = jakmar
	.create()
	.state('online')
	.state('offline')
	.transition('connect', 'offline', 'online')
	.transition('disconnect', 'online', 'offline')

var statusOne = connectionStatusMachineDefinition.build('offline')
var statusTwo = connectionStatusMachineDefinition.build('online')

console.log('one', statusOne.state) // offline
console.log('two', statusTwo.state) // online
statusTwo.disconnect()
console.log('one', statusOne.state) // offline
console.log('two', statusTwo.state) // offline
statusOne.connect()
console.log('one', statusOne.state) // online
console.log('two', statusTwo.state) // offline
