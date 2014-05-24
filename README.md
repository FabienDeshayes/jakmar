# Jakmar.js

Jakmar is a finite state machine for Javascript.

# Usage

For Node.js, just include the library:

```javascript
var jakmar = require('jakmar')
```
## Stateful objects creation

First, build a MachineDefinition:

```javascript
var articleDefinition = jakmar.create()
```

Once it's created, start by adding states:

```javascript
articleDefinition
	.state('new')
	.state('draft')
	.state('inReview')
	.state('published')
	.state('archived')
```

And some transitions:

```javascript
articleDefinition
	.transition('save', 'new', 'draft')
	.transition('review', 'draft', 'inReview')
	.transition('reject', 'inReview', 'draft')
	.transition('publish', 'inReview', 'published')
	.transition('archive', 'published', 'archived')
```

Then just build the definition to get your stateful instance:

```javascript
var article = articleDefinition.build('new')
```

## Changing state

Your stateful instance has been enriched with methods defined by transitions. You can also very the current state using the ```state``` property:

```javascript
console.log(article.state) // new
article.save()
console.log(article.state) // draft
article.review()
console.log(article.state) // inReview
article.reject()
console.log(article.state) // draft
article.review()
console.log(article.state) // inReview
article.publish()
console.log(article.state) // published
article.archive()
console.log(article.state) // archived
```

## TODO

* Handle advanced options
* Publish to Bower

## Status

[![Build Status](https://travis-ci.org/FabienDeshayes/jakmar.png?branch=master)](https://travis-ci.org/FabienDeshayes/jakmar)
[![Coverage Status](https://coveralls.io/repos/FabienDeshayes/jakmar/badge.png)](https://coveralls.io/r/FabienDeshayes/jakmar)