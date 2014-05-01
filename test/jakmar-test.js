if (typeof require !== 'undefined') {
	var expect = require('chai').expect
	  , sinon = require('sinon')
	  , jakmar = require('../jakmar')
} else {
	var expect = chai.expect
}

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

		it('should register states as an array', function() {
			var status = jakmar
				.create()
				.states(['online', 'offline'])
				.transition('connect', 'offline', 'online')
				.transition('disconnect', 'online', 'offline')
				.build('offline', {})

			expect(status.state).to.equal('offline')
			status.connect()
			expect(status.state).to.equal('online')
			status.disconnect()
			expect(status.state).to.equal('offline')
		})

		it('should register states as multiple args', function() {
			var status = jakmar
				.create()
				.states('online', 'offline')
				.transition('connect', 'offline', 'online')
				.transition('disconnect', 'online', 'offline')
				.build('offline', {})

			expect(status.state).to.equal('offline')
			status.connect()
			expect(status.state).to.equal('online')
			status.disconnect()
			expect(status.state).to.equal('offline')
		})

		it('should expose states', function() {
			var machineDefinition = jakmar
				.create()
				.state('online')
				.state('offline')

			expect(machineDefinition.getStates().hasOwnProperty('online')).to.be.true;
			expect(machineDefinition.getStates().hasOwnProperty('offline')).to.be.true;
		})

		it('should expose transitions', function() {
			var machineDefinition = jakmar
				.create()
				.state('online')
				.state('offline')
				.transition('connect', 'offline', 'online')
				.transition('disconnect', 'online', 'offline')

			expect(machineDefinition.getTransitions()[0].id).to.equal('connect')
			expect(machineDefinition.getTransitions()[1].id).to.equal('disconnect')
		})

		it('should register an onEnter function', function() {
      var spy = sinon.spy()

			var status = jakmar
				.create()
				.states('online', 'offline')
				.transition('connect', 'offline', 'online')
				.transition('disconnect', 'online', 'offline')
				.onEnter(spy)
				.build('offline', {})

      expect(spy.called).to.equal.false
      status.connect()
      expect(spy.called).to.equal.true
		})

		it('should register an onExit function', function() {
      var spy = sinon.spy()

			var status = jakmar
				.create()
				.states('online', 'offline')
				.transition('connect', 'offline', 'online')
				.transition('disconnect', 'online', 'offline')
				.onExit(spy)
				.build('offline', {})

      expect(spy.called).to.equal.false
      status.connect()
      expect(spy.called).to.equal.true
		})
		
	})
})