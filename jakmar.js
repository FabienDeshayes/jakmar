(function (root, factory) {
	/* istanbul ignore next */
	// Ignore the UMD wrapper for coverage
	// UMD wrap - return exports style: https://github.com/umdjs/umd/blob/master/returnExports.js
	if (typeof define === 'function' && define.amd) {
		define(factory)
	} else if (typeof exports === 'object') {
		module.exports = factory()
	} else {
		root.jakmar = factory()
	}
}(this, function () {

	// State
	function State(options) {
		this.id = options.id
	}
	
	// Transition
	function Transition(options) {
		this.id = options.id
		this.applicableStates = {}

		this.addStates = function addStates(fromStateId, toStateId) {
			this.applicableStates[fromStateId] = toStateId
		}

		this.isApplicableForState = function isApplicableForState(stateId) {
			return this.applicableStates.hasOwnProperty(stateId)
		}

		this.getToState = function getToState(stateId) {
			return this.applicableStates[stateId]
		}
	}

	// MachineDefinition
	function MachineDefinition(id, options) {
		var states = {}
			, transitions = {}
			, transitionsArray = []
			, enterFn = function noop() {}
			, exitFn = function noop() {}
		
		this.id = id

		function _mixin(target) {
			var i = 0

			for ( ; i < transitionsArray.length ; i++) {
				target[transitionsArray[i].id] = function applyTransition(transition) {
					var applied = false

					if (transition.isApplicableForState(this.state)) {
						// fromState correct for transition, move to toState
						var fromStateId = this.state
						var toStateId = transition.getToState(fromStateId)

						this.state = toStateId
						exitFn(fromStateId)
						this.stateChange(transition.id, fromStateId, toStateId)
						enterFn(toStateId)
						applied = true
					} else {
						if (errorOnInvalidTransition) {
							// fromState incorrect, throw an error
							throw new Error('Cannot apply transition \'' + transition.id + '\' from state \'' + this.state + '\'.')	
						}
					}
					return applied
				}.bind(target, transitionsArray[i])
			}
		}

		function _registerStates(states) {
			var i = 0

			for ( ; i < states.length ; i++) {
				this.state(states[i])
			}
		}

		this.state = function(stateId) {
			states[stateId] = new State({
				id: stateId
			})

			return this
		}

		this.states = function() {
			var i = 0

			for ( ; i < arguments.length ; i++) {
				if (arguments[i] instanceof Array) {
					_registerStates.bind(this)(arguments[i])
				} else {
					// single state registration
					this.state(arguments[i])
				}
			}

			return this
		}

		this.transition = function(transitionId, fromStateId, toStateId) {
			var transition

			if (errorOnUnknownState && (!states.hasOwnProperty(fromStateId) || !states.hasOwnProperty(toStateId))) {
				throw new Error()
			}

			if (transitions.hasOwnProperty(transitionId)) {
				transition = transitions[transitionId]
			} else {
				transition = new Transition({
					id: transitionId
				})
				transitions[transitionId] = transition
				transitionsArray.push(transition)
			}

			transition.addStates(fromStateId, toStateId)

			return this
		}

		this.onEnter = function(onEnterFn) {
			enterFn = onEnterFn

			return this
		}

		this.onExit = function(onExitfn) {
			exitFn = onExitfn

			return this
		}

		this.build = function(initialState, target) {
			target = target || {}

			if (states.hasOwnProperty(initialState)) {
				_mixin(target)
				target.state = initialState
				target.stateChange = function noop() {}
			} else {
				throw new Error('Cannot build machine defintion with unknown initial state:', initialState)
			}

			return target
		}

		this.getStates = function() {
			return states
		}
		this.getTransitions = function() {
			return transitionsArray
		}
	}

	// Jakmar

	var jakmar = {}

	var _machineDefOptionsDefaults = {
		errorOnInvalidTransition: true,
		errorOnUnknownState: true
	}

	function _create(id, options) {
		return new MachineDefinition(id, options || _machineDefOptionsDefaults)
	}

	jakmar.create = _create

	return jakmar

}))