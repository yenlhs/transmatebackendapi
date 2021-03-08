const { ObjectBuilder } = require('firebase-functions/lib/providers/storage');
const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI;

const dbCollection = process.env.MONGODB_COLLECTION;
const QuestionsCollection = process.env.MONGODB_QUESTIONS_COLLECTION
const LanguagesCollection = process.env.MONGODB_LANGUAGES_COLLECTION;

const transmateSchema = mongoose.Schema({
	donor: {
		name: String,
		mobile: String,
		donorid: String,
	},
	start_timestamp: Date,
	end_timestamp: Date,
	lang_from: String,
	lang_to: String,
	messages: [
		{
			message: String,
			text: String,
			translated_message: String,
			username: String,
			lang_to: String,
			timestamp: String,
			user: {
				_id: ObjectId,
				name: String,
			},
		},
	],
});

const transmateQuestionSchema = mongoose.Schema({
	title: String,
	questions: [
		{
			question: String,
			image: String,
			translations: [
				{
					language: String,
					question: String,
				}
			]
		}
	]
})

const transmateLanguagesSchema = mongoose.Schema({
	language_native: String,
	language: String,
	code: String
})

// const dbModel = mongoose.model(process.env.DB_COLLECTION, transmateSchema);
const dbModel = mongoose.model(dbCollection, transmateSchema);
const questionsModel = mongoose.model(
	QuestionsCollection,
	transmateQuestionSchema
);
const languagesModel = mongoose.model(
	LanguagesCollection,
	transmateLanguagesSchema
)

mongoose.connect(mongoURI, {
	useCreateIndex: true,
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;


module.exports = { db, dbModel, questionsModel, languagesModel, dbCollection };