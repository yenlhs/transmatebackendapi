// const dbModel = require('./dbTransmateModel');
const { dbModel, questionsModel, languagesModel } = require('../models/dbTransmate');

const createConversation = (payload, response) => {
  const conversation = {
		start_timestamp: new Date(),
		lang_from: payload.lang_from,
		lang_to: payload.lang_to
  };
  dbModel.create(conversation, (err, data) => {
		if (err) {
			return response.status(500).send(err);
		} else {
			return response.status(201).send(data);
		}
	});
}

const sendMessage = (id, payload, response) => {
  dbModel.findByIdAndUpdate(
		{
			_id: id,
		},
		{
			$addToSet: { messages: [ payload ] }
		},
		{new: true},
		(err, data) => {
			if (err) {
				return response.status(500).send(err);
			} else {
				return response.status(201).send(data.messages[data.messages.length - 1]);
			}
		}
	);
}

const sendSystemMessage = (id, payload, response) => {
	dbModel.findByIdAndUpdate(
		{
			_id: id,
		},
		{
			$addToSet: { messages: [payload] },
		},
		{ new: true },
		(err, data) => {
			if (err) {
				return response.status(500).send(err)
			} else {
				return response
					.status(201)
					.send(data.messages[data.messages.length - 1])
			}
		}
	)
}

const updateMessage = (id, payload, response) => {
	dbModel.findOneAndUpdate(
		{ 
			_id: id, "messages._id": payload.messageId 
		},
    { 
			$set: {
					"messages.$.translated_message": payload.translated_message,
					"messages.$.lang_to": payload.lang_to
			}
		},
		{ upsert: true },
    (err, data) => {
			if (err) {
				return response.status(500).send(err);
			} else {
				return response.status(201).send('message updated');
			}
		}
	)
}

const endConversation = (id, payload, response) => {
  dbModel.findOneAndUpdate(
		{
			_id: id,
		},
		payload,
		{ new: true },
		(err, data) => {
			if (err) {
				return response.status(500).send(err);
			} else {
				return response.status(201).send(data);
			}
		}
	);
}

const getConversations = (payload, response) => {
	//finds conversation based on ID provided
	if (payload) {
		dbModel.findById(payload, (err, data) => {
			if (err) {
				return response.status(404).send(err);
			} else {
				return response.status(200).send(data);
			}
		});
	}
	//returns all the conversations
	else {
		dbModel.find((err, data) => {
			if (err) {
				return response.status(500).send(err);
			} else {
				return response.status(200).send(data);
			}
		});
	} 
}

const setLanguage = (payload, response) => {
	let lang = {}
	if (payload.lang_from){
		lang = {
			lang_from: payload.lang_from
		}
	}
	else if (payload.lang_to) {
		lang = {
			lang_to: payload.lang_to
		}
	}
	dbModel.findByIdAndUpdate(
		{
			_id: payload.chatId,
		},
		lang,
		{ new: true },
		(err, data) => {
			if (err) {
				return response.status(500).send(err);
			} else {
				return response
					.status(201)
					.send(data);
			}
		}
	);
}

const getLanguage = (payload, response) => {
	let langs = {}
	if (payload) {
		dbModel.findById(payload,
			{ lang_from:1, lang_to:1 }, 
			(err, data) => {
			if (err) {
				return response.status(404).send(err);
			} else {
				return response.status(200).send(data);
			}
		});
	}
}

const getLanguages = (payload, response) => {

	languagesModel.find((err, data) => {
		if (err) {
			return response.status(500).send(err);
		} else {
			return response.status(200).send(data);
		}
	});
};


const getQuestions = (payload, response) => {
	questionsModel.find((err, data) => {
			if (err) {
				return response.status(500).send(err);
			} else {
				return response.status(200).send(data);
			}
		});
}

module.exports = {
	createConversation,
	sendMessage,
	sendSystemMessage,
	updateMessage,
	endConversation,
	getConversations,
	setLanguage,
	getLanguage,
	getLanguages,
	getQuestions,
}