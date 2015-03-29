if (typeof require !== 'undefined') {
	var expect = require('chai').expect
		, sinon = require('sinon')
		, jakmar = require('../jakmar')
} else {
	var expect = chai.expect
}

describe('Jakmar test suite', function() {

	beforeEach(jakmar.reset)

	describe('jakmar', function() {

		describe('create()', function() {

			it('should return a machine definition with an id', function() {
				var fooDef = jakmar.create('fooDef')

				expect(fooDef.id).to.equal('fooDef')
			})

		})

		describe('get()', function() {

			it('should retrive a machine definition by id', function() {
				var fooDef = jakmar.create('fooDef')

				expect(jakmar.get('fooDef')).to.equal(fooDef)
			})

			it('should return undefined if trying to retrieve an unknown machine definition', function() {
				expect(jakmar.get('unknown')).to.be.undefined
			})

		})

		describe('reset()', function() {

			it('should delete all stored machine definitions', function() {
				var fooDef = jakmar.create('fooDef')
				
				expect(jakmar.get('fooDef')).to.be.defined
				jakmar.reset()
				expect(jakmar.get('fooDef')).to.be.undefined
			})

		})

	})

	describe('machine definition', function() {

		describe('state()', function() {

			it('should register a state', function() {
				var status = jakmar
					.create()
					.state('online')
					.build('online')

				expect(status.state).to.equal('online')
			})

		})

		describe('states()', function() {

			it('should accept states as an array', function() {
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

			it('should accepts states as multiple args', function() {
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

		})

		describe('transition()', function() {

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

			it('should allow transitions with the same name for different fromState', function() {
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

			it('should throw an Error if it involves an unknown state', function() {
				var machineDefinition = jakmar
					.create()
					.state('online')

				expect(function() { machineDefinition.transition('toggle', 'online', 'offline') }).to.throw(Error)
			})

			it('should not throw an Error if it involves an unknown state and the errorOnUnknownState flag is false', function() {
				var machineDefinition = jakmar
					.create('test', { errorOnUnknownState: false })
					.state('online')

				expect(function() { machineDefinition.transition('toggle', 'online', 'offline') }).not.to.throw(Error)
			})

		})

		describe('getStates()', function() {

			it('should expose states', function() {
				var machineDefinition = jakmar
					.create()
					.state('online')
					.state('offline')
				var states = machineDefinition.getStates()

				expect(states.hasOwnProperty('online')).to.be.true
				expect(states.hasOwnProperty('offline')).to.be.true
			})

		})

		describe('getTransitions()', function() {
			
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

		})

		describe('onEnter()', function() {

			it('should register a function called when entering any state', function() {
				var spy = sinon.spy()
				var status = jakmar
					.create()
					.states('online', 'offline')
					.transition('connect', 'offline', 'online')
					.onEnter(spy)
					.build('offline', {})

				expect(spy.called).to.equal.false
				status.connect()
				expect(spy.called).to.equal.true
			})

			it('should be called with the state entered as argument', function() {
				var spy = sinon.spy()
				var status = jakmar
					.create()
					.states('online', 'offline')
					.transition('connect', 'offline', 'online')
					.onEnter(spy)
					.build('offline', {})

				status.connect()
				expect(spy.calledWith('online')).to.equal.true
			})

		})

		describe('onExit()', function() {

			it('should register a function called when exiting any state', function() {
				var spy = sinon.spy()
				var status = jakmar
					.create()
					.states('online', 'offline')
					.transition('connect', 'offline', 'online')
					.onExit(spy)
					.build('offline', {})

				expect(spy.called).to.equal.false
				status.connect()
				expect(spy.called).to.equal.true
			})

			it('should be called with the state entered as argument', function() {
				var spy = sinon.spy()
				var status = jakmar
					.create()
					.states('online', 'offline')
					.transition('connect', 'offline', 'online')
					.onEnter(spy)
					.build('offline', {})

				status.connect()
				expect(spy.calledWith('offline')).to.equal.true
			})

		})

		describe('build()', function() {

			it('should create two stateful object form the same definition', function() {
				var machineDefinition = jakmar
					.create()
					.state('online')
					.state('offline')
					.transition('connect', 'offline', 'online')
					.transition('disconnect', 'online', 'offline')
				var statusOne = machineDefinition.build('offline')
					,	statusTwo = machineDefinition.build('online')

				expect(statusOne.state).to.equal('offline')
				expect(statusTwo.state).to.equal('online')
				statusTwo.disconnect()
				expect(statusOne.state).to.equal('offline')
				expect(statusTwo.state).to.equal('offline')
				statusOne.connect()
				expect(statusOne.state).to.equal('online')
				expect(statusTwo.state).to.equal('offline')
			})

			it('should throw an Error if the initial state is unknown', function() {
				var machineDefinition = jakmar.create()

				expect(machineDefinition.build).to.throw(Error)
				expect(function() { machineDefinition.build('unknown') }).to.throw(Error)
			})

			it('should not throw an error if no target is specified', function() {
				var machineDefinition = jakmar.create().state('online')

				expect(function() { machineDefinition.build('online') }).not.to.throw(Error)
			})

		})

	})

	describe('stateful object', function() {

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

		describe('applying transition', function() {

			it('should dispatch an error if transition is invalid', function() {
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

			it('should dispatch an error if options.errorOnInvalidTransition is true', function() {
				var status = jakmar
					.create('test', { errorOnInvalidTransition: true })
					.state('online')
					.state('offline')
					.transition('connect', 'offline', 'online')
					.transition('disconnect', 'online', 'offline')
					.build('offline', {})

				expect(status.disconnect).to.throw(Error)
			})

			it('should not dispatch an error if options.errorOnInvalidTransition is false', function() {
				var status = jakmar
					.create('test', { errorOnInvalidTransition: false })
					.state('online')
					.state('offline')
					.transition('connect', 'offline', 'online')
					.transition('disconnect', 'online', 'offline')
					.build('offline', {})

				expect(status.disconnect).not.to.throw(Error)
			})

			it('should return false if options.errorOnInvalidTransition is false', function() {
				var status = jakmar
					.create('test', { errorOnInvalidTransition: false })
					.state('online')
					.state('offline')
					.transition('connect', 'offline', 'online')
					.transition('disconnect', 'online', 'offline')
					.build('offline', {})

				var applied = status.disconnect()
				expect(applied).to.be.false
			})

			it('should return true if transition is valid', function() {
				var status = jakmar
					.create('test', { errorOnInvalidTransition: false })
					.state('online')
					.state('offline')
					.transition('connect', 'offline', 'online')
					.transition('disconnect', 'online', 'offline')
					.build('offline', {})

				var applied = status.connect()
				expect(applied).to.be.true
			})

		})

	})

})
