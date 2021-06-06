const express = require('express');
const router = express.Router();

const {
	getCategories,
	getCategoriesNew,
	getQuestionsByCategory,
	getQuestions,
	getCategoriesDistinct,
	getAllQuestions,
	createQuestion,
	deleteQuestion,
} = require('../controllers/questionsController')

// middleware that is specific to this router
router.use((req, res, next) => {
	next();
});

router.get('/', (request, response) => {
	const category = decodeURIComponent(request.query.category)
	getQuestions(category, response)
});

router.post('/', (request, response) => {
	const question = request.body
	createQuestion(question, response)
})

router.delete('/delete/:id', (request, response) => {
	const id = request.params.id
	deleteQuestion(id, response)
})

router.get('/all', (request, response) => {
	getAllQuestions(response)
})

router.get('/categories', (request, response) => {
	getCategories(request, response)
});

router.get('/categoriesnew', (request, response) => {
	getCategoriesNew(response)
})

router.get('/categoriesnew/:category', (request, response) => {
	const category = request.params.category
	getQuestionsByCategory(parseInt(category), response)
})

router.get('/:category', (request, response) => {
	const category = request.params.category
	// response.status(200).send(category);
	getQuestions(category, response)
});

router.get('/categoriesdistinct', (request, response) => {
	getCategoriesDistinct(response)
})



module.exports = router;
