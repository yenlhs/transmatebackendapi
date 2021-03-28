const express = require('express');
const router = express.Router();

const {
	getCategories,
	getCategoriesNew,
	getQuestions,
} = require('../controllers/questionsController')

// middleware that is specific to this router
router.use((req, res, next) => {
	next();
});

router.get('/', (request, response) => {
	getQuestions(null, response);
});

router.get('/categories', (request, response) => {
	getCategories(request, response)
});

router.get('/categoriesnew', (request, response) => {
	getCategoriesNew(response)
})

router.get('/:category', (request, response) => {
	const category = request.params.category;
	// response.status(200).send(category);

	getQuestions(category, response);
});


module.exports = router;
