var expect = require('chai').expect
  , jakmar = require('../jakmar')

describe('Jakmar', function() {

	describe('state property', function() {

		it('should reflect the state of the stateful object', function() {

			var status = jakmar
				.create()
				.state('online')
				.state('offline')
				.transition('connect', 'offline', 'online')
				.transition('disconnect', 'online', 'offline')
				.build('offline', {})

			expect(status.state).to.equal('offline')
			status.connect()
			expect(status.state).to.equal('online')
			status.disconnect()
			expect(status.state).to.equal('offline')
		})

		it('should be able to create two stateful object form the same machine definition', function() {

			var machineDefinition = jakmar
				.create()
				.state('online')
				.state('offline')
				.transition('connect', 'offline', 'online')
				.transition('disconnect', 'online', 'offline')

			var statusOne = machineDefinition.build('offline')
			var statusTwo = machineDefinition.build('online')

			expect(statusOne.state).to.equal('offline')
			expect(statusTwo.state).to.equal('online')
			statusTwo.disconnect()
			expect(statusOne.state).to.equal('offline')
			expect(statusTwo.state).to.equal('offline')
			statusOne.connect()
			expect(statusOne.state).to.equal('online')
			expect(statusTwo.state).to.equal('offline')

		})

		it('should dispatch an error if trying to apply an invalid transition', function() {

			var status = jakmar
				.create()
				.state('online')
				.state('offline')
				.transition('connect', 'offline', 'online')
				.transition('disconnect', 'online', 'offline')
				.build('offline', {})

			expect(status.disconnect).to.throw(Error);
			expect(status.disconnect).to.throw(/Cannot apply transition/);
		})
	})
})
