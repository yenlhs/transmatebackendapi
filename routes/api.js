const express = require('express');
const router = express.Router();
// const moment = require('moment')
const moment = require('moment-timezone');
const {
	createConversation,
	sendMessage,
	updateMessage,
	endConversation,
	getConversations,
	setLanguage,
	getLanguage,
	getLanguages,
} = require('../controllers/transmateController');
const Pusher = require('pusher')
const { response } = require('express')

const pusher = new Pusher({
	appId: process.env.PUSHER_APPID,
	key: process.env.PUSHER_KEY,
	secret: process.env.PUSHER_SECRET,
	cluster: process.env.PUSHER_CLUSTER,
	encrypted: process.env.PUSHER_ENCRYPTED,
})

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

router.get('/getlanguages', async (request, response) => {
	getLanguages(request, response);
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
	// message.timestamp = moment().format('h:mm:ss');
	message.timestamp = moment().tz('Australia/Melbourne').format('HH:mm:ss');
	// console.log('message from API', message)
	sendMessage(chatId, message, response);
});

router.post('/updatemessage', async (request, response) => {
	const chatId = request.body.chatId;
	updateMessage(chatId, request.body, response)
})

router.get('/conversation', (request, response) => {
	// will retrieve the chat messages
	// query paramter chatId is passed to retrieve the messages
	const chatId = request.query.chatId || undefined;
	getConversations(chatId, response);
});

router.post('/userTyping', (request, response) => {
	const chatId = request.body.chatId
	const username = request.body.username
	pusher.trigger(`usertyping_${chatId}`, 'userIsTyping', {
		username: username,
	})
	response.status(200).send()
})


module.exports = router;
