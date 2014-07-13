if (typeof require !== 'undefined') {
	var expect = require('chai').expect
	  , sinon = require('sinon')
	  , jakmar = require('../jakmar')
} else {
	var expect = chai.expect
}

describe('Jakmar', function() {

	describe('stateful object', function() {

		it('should have a state property reflecting the state of the stateful object', function() {
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

		it('should dispatch an error if trying to apply an invalid transition', function() {
			var status = jakmar
				.create()
				.state('online')
				.state('offline')
				.transition('connect', 'offline', 'online')
				.transition('disconnect', 'online', 'offline')
				.build('offline', {})

			expect(status.disconnect).to.throw(Error)
			expect(status.disconnect).to.throw(/Cannot apply transition/)
		})

		it('should dispatch an error if trying to apply an invalid transition but options.errorOnInvalidTransition is true', function() {
			var status = jakmar
				.create('test', { errorOnInvalidTransition: true })
				.state('online')
				.state('offline')
				.transition('connect', 'offline', 'online')
				.transition('disconnect', 'online', 'offline')
				.build('offline', {})

			expect(status.disconnect).to.throw(Error)
		})

		it('should not dispatch an error if trying to apply an invalid transition but options.errorOnInvalidTransition is false', function() {
			var status = jakmar
				.create('test', { errorOnInvalidTransition: false })
				.state('online')
				.state('offline')
				.transition('connect', 'offline', 'online')
				.transition('disconnect', 'online', 'offline')
				.build('offline', {})

			expect(status.disconnect).not.to.throw(Error)
		})
	})

	describe('machine definition', function() {

		it('shoud be created with an id', function() {
			var fooDef = jakmar.create('fooDef')

			expect(fooDef.id).to.equal('fooDef')
		})

		it('should be able to create two stateful object form the same definition', function() {
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

			var states = machineDefinition.getStates()
			expect(states.hasOwnProperty('online')).to.be.true
			expect(states.hasOwnProperty('offline')).to.be.true
		})

		it('should expose transitions', function() {
			var machineDefinition = jakmar
				.create()
				.state('online')
				.state('offline')
				.transition('connect', 'offline', 'online')
				.transition('disconnect', 'online', 'offline')

			var transitions = machineDefinition.getTransitions()
			expect(transitions[0].id).to.equal('connect')
			expect(transitions[1].id).to.equal('disconnect')
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

		it('should allow multiple transitions from the same state', function() {
			var status = jakmar
				.create()
				.states(['online', 'offline', 'idle'])
				.transition('connect', 'offline', 'online')
				.transition('disconnect', 'online', 'offline')
				.transition('away', 'online', 'idle')
				.build('online', {})

			expect(status.state).to.equal('online')
			status.disconnect()
			expect(status.state).to.equal('offline')
			status.connect()
			expect(status.state).to.equal('online')
			status.away()
			expect(status.state).to.equal('idle')
		})

		it('should allow registering transitions with the same name for different fromState', function() {
			var status = jakmar
				.create()
				.states(['online', 'offline'])
				.transition('toggle', 'offline', 'online')
				.transition('toggle', 'online', 'offline')
				.build('online', {})

			expect(status.state).to.equal('online')
			status.toggle()
			expect(status.state).to.equal('offline')
			status.toggle()
			expect(status.state).to.equal('online')
		})

		it('should throw an Error if trying to build a stateful object with an unknown transition', function() {
			var machineDefinition = jakmar.create()

			expect(machineDefinition.build).to.throw(Error)
			expect(function() { machineDefinition.build('unknown') }).to.throw(Error)
		})
	})
})
