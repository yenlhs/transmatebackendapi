const express = require('express');
const router = express.Router();
const {
	createConversation,
	sendMessage,
	endConversation,
	getConversations,
	setLanguage,
	getLanguage,
} = require('../controllers/transmateController');


// middleware that is specific to this router
router.use((req, res, next) => {
	next();
});

router.get('/', (request, response) => {
	response.status(200).send('TransMate API v1');
});

router.post('/setlanguage', async (request, response) => {
	setLanguage(request.body, response);
});

router.post('/getlanguage', async (request, response) => {
	getLanguage(request.body.chatId, response);
});

router.post('/startconversation', (request, response) => {
	createConversation(request.body, response);
});

router.post('/endconversation', (request, response) => {
	const chatId = request.body.chatId;
	const req_payload = {
		end_timestamp: new Date(),
	};
	endConversation(chatId, req_payload, response);
});

router.post('/message', async (request, response) => {
	const chatId = request.body.chatId;
	const message = request.body;
	message.timestamp = new Date();
	sendMessage(chatId, message, response);
});

router.get('/conversation', (request, response) => {
	// will retrieve the chat messages
	// query paramter chatId is passed to retrieve the messages
	const chatId = request.query.chatId || undefined;
	getConversations(chatId, response);
});

module.exports = router;
