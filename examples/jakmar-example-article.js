var jakmar = require('../jakmar')

var article = jakmar
	.create()
	.state('new')
	.state('draft')
	.state('inReview')
	.state('published')
	.state('archived')
	.transition('save', 'new', 'draft')
	.transition('review', 'draft', 'inReview')
	.transition('reject', 'inReview', 'draft')
	.transition('publish', 'inReview', 'published')
	.transition('archive', 'published', 'archived')
	.build('new', {})

article.stateChange = function(transition, fromState, toState) {
	console.log('Moving article from', fromState, 'to', toState, 'because of transition', transition)
}

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