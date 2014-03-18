(function (root, factory) {
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
		this.fromState = options.fromState
		this.toState = options.toState
	}

	// MachineDefinition
	function MachineDefinition(id) {
		var states = {}
			, transitions = []
		
		this.id = id

		function _mixin(target) {
			var i = 0

			for ( ; i < transitions.length ; i++) {
				target[transitions[i].id] = function transition(transition) {
					if (this.state === transition.fromState.id) {
						// fromState correct for transition, move to toState
						this.state = transition.toState.id
						this.stateChange(transition.id, transition.fromState.id, transition.toState.id)
					} else {
						// fromState incorrect, throw an error
						throw new Error('Cannot apply transition \'' + transition.id + '\', current state is not \'' + transition.fromState.id + '\'.')
					}
				}.bind(target, transitions[i])
			}

			return target
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
			transitions.push(new Transition({
				id: transitionId,
				fromState: states[fromStateId],
				toState: states[toStateId]
			}))

			return this
		}

		this.build = function(initialState, target) {
			target = target || {}

			_mixin(target)
			target.state = initialState
			target.stateChange = function noop() {}

			return target
		}

		this.getStates = function() {
			return states
		}
		this.getTransitions = function() {
			return transitions
		}
	}

	// Jakmar

	var jakmar = function() {}

	function _create(id) {
		return new MachineDefinition(id)
	}

	jakmar.create = _create

	return jakmar

}))