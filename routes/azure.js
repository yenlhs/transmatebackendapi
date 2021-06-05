const express = require('express');
const router = express.Router();
const {
	getLanguages,
	getVoices,
	translate,
	translateQuestion,
} = require('../controllers/cognitiveController')

// middleware that is specific to this router
router.use((req, res, next) => {
	next();
});

router.post('/translate', async (request, response) => {
	translate(request.body, response);
});

router.post('/translateQuestion', async (request, response) => {
	translateQuestion(request.body.question, response)
})

router.get('/languages', async (request, response) => {
	getLanguages(response);
});

router.get('/voices', async (request, response) => {
	getVoices(response);
});



module.exports = router