# Jakmar.js

Jakmar is a finite state machine for Javascript.

# Example

If you want to see examples of Jakmar, please see the following:

* [Game of life](https://github.com/FabienDeshayes/react-jakmar-example) with Jakmar and React
* [Workflow visualization](https://github.com/FabienDeshayes/vue-jakmar-example) with Jakmar and Vue (and d3)

# Usage

For Node.js, just include the library:

```javascript
var jakmar = require('jakmar')
```
## Stateful objects creation

First, build a MachineDefinition:

```javascript
var definition = jakmar.create('foo-def') // foo-def is an identifier
```

Once it's created, start by adding states:

```javascript
definition
	.state('opened') // a state is justdefined by a string
	.state('closed')
```

And some transitions:

```javascript
definition
	.transition('open', 'closed', 'opened') // open transition, from the closed state to the opened state
	.transition('close', 'opened', 'closed') // close: opened => closed
```

Then just build the definition to get your stateful instance:

```javascript
var stateful = definition.build('opened') // opened will be the initial state
```

## Changing state

Your stateful instance has been enriched with methods defined by transitions. You can also verify the current state using the ```state``` property:

```javascript
console.log(stateful.state) // opened
stateful.close()
console.log(stateful.state) // closed
stateful.open()
console.log(stateful.state) // opened
```

# API

### jakmar.create(id, options)

The ```create``` method creates and returns a new instance of a ```MachineDefinition``` with ```id``` as an identifier. The following ```options``` are valid (and all are optional):
* ```errorOnInvalidTransition```: will throw an Error if a transition tries to be applied but the stateful object is not in an expected state. Default is ```true```.

```javascript
machineDefinition = jakmar.create('fooDef', {errorOnInvalidTransition: false})
```

### machineDefinition.state(stateId)

Register a new state with ```stateId``` as an identifier to the ```machineDefinition```. Returns ```this``` for chained calls.

```javascript
machineDefinition.state('opened')
```

### machineDefinition.states(stateIds)

Register an array of new states with ```stateIds``` being an Array of identifier for the ```machineDefinition```. Returns ```this``` for chained calls.

```javascript
machineDefinition.states(['opened', 'closed'])
```

### machineDefinition.states(...args)

Alternate way of registering new states, using any number of string, each a ```stateId```for the ```machineDefinition```. Returns ```this``` for chained calls.

```javascript
machineDefinition.states('opened', 'closed')
```

### machineDefinition.transition(transitionId, fromStateId, toStateId)

Register a new transition with ```transitionId``` as an identifier to the ```machineDefinition```. The transition will change the stateful object from the state defined by ```fromStateId``` to the state defined by ```toStateId```. Returns ```this``` for chained calls.

```javascript
machineDefinition.transition('open', 'closed', 'opened')
```

### machineDefinition.build(initialState, target)

Transform the ```target``` into a ```statefulObject``` with the current ```machineDefinition``` states and transitions applied to it. ```target``` is optional ; a new object is created if missing. The stateful object initial state is mandatory and defined by the ```initialState```. Returns a ```statefulObject```.

```javascript
var statefulObject = machineDefinition.build('opened', {})
```

### machineDefinition.getStates()

Expose the registered states of the ```machineDefinition```. Returns an object with key / value pairs, key being the state ids and the value being the ```State``` objects. A ```State``` object only has an ```id``` at the moment.

```javascript
var states = machineDefinition.getStates()
console.log(states)
// {
//	opened: { id: 'opened' },
//	closed: { id: 'closed' }
// }
```

### machineDefinition.getTransitions()

Expose the registered transitions of the ```machineDefinition```. Returns an Arrat of ```Transition``` objects. A ```Transition``` object has two properties: the transition ```id``` and an ```applicableStates``` object of key / value pairs, where the key is the applicable ```fromState``` and the value is the corresponding ```toState``` for that transition.

```javascript
machineDefinition.transition('toggle', 'opened', 'closed')
machineDefinition.transition('toggle', 'closed', 'opened')
var transitions = machineDefinition.getTransitions()
console.log(transitions)
// [
//	{ id: 'toggle', applicableStates : { opened: 'closed', closed: 'opened' } }
// ]
```

### machineDefinition.onEnter(onEnterFn)

Register a function that will be called every time the ```statefulObject``` enter a new state. It is called after the ```onExitFn```, once the new state has been applied. The ```onEnterFn``` should be a function accepting one argument, being the ```id``` of state that has just been entered. Returns ```this``` for chained calls.

```javascript
var onEnter = function(stateId) {
	console.log('Entering', stateId)
}
machineDefinition.onEnterFn(onEnter)
var statefulObject = machineDefinition.build('opened')
statefulObject.close()
// Entering closed
```

### machineDefinition.onExit(onExitFn)

Register a function that will be called every time the ```statefulObject``` exits a state. It is called before the ```onEnterFn```, once the new state has been applied. The ```onExitFn``` should be a function accepting one argument, being the ```id``` of state that will be exited. Returns ```this``` for chained calls.

```javascript
var onExit = function(stateId) {
	console.log('Exiting', stateId)
}
machineDefinition.onExitFn(onExit)
var statefulObject = machineDefinition.build('opened')
statefulObject.close()
// Exiting opened
```

### statefulObject.state

Return the current state id of the ```statefulObject```.

```javascript
var statefulObject = machineDefinition.build('opened')
statefulObject.state // 'opened'
```

### statefulObject.stateChange

Function that gets called every time the ```statefulObject``` changes state. It gets called with three arguments: the ```transition``` id that trigerred the change of state, the ```fromState``` id and the ```toState``` id. It gets called ```after the state has changed.

```javascript
var statefulObject = machineDefinition.build('opened')
statefulObject.stateChange = function(transitionId, fromStateId, toStateId) {
	console.log('Going from', fromStateId, 'to', toStateId, 'because of transition', transitionId)
}
statefulObject.open()
// Going from opened to closed because of transition open
```

### statefulObject.\<transition>

Apply a registered ```transition``` to the ```statefulObject```. Returns ```true``` id the transitions was applied, throws an ```Error``` if the transition can't be applied (because the ```statefulObject``` is not in a state where the ```transition``` can be applied) or returns ```false``` if the ```errorOnInvalidTransition``` option is set to false.

```javascript
statefulObject.state // closed
statefulObject.open() // returns true
statefulObject.state // opened
statefulObject.open() // throws an Error
```

## TODO

* Retrieve machine definition by id
* Add a minified version

## Status

[![Build Status](https://travis-ci.org/FabienDeshayes/jakmar.png?branch=master)](https://travis-ci.org/FabienDeshayes/jakmar)
[![Coverage Status](https://coveralls.io/repos/FabienDeshayes/jakmar/badge.png)](https://coveralls.io/r/FabienDeshayes/jakmar)
