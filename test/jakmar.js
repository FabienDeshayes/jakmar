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
	})
})
