require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Pusher = require('pusher');
const { db, dbCollection } = require('./models/dbTransmate');
const port = process.env.PORT || 9000;
const router = require('./routes/router');
const azRouter = require('./routes/azure');
const apiRouter = require('./routes/api');
const langRouter = require('./routes/language');
const questionsRouter = require('./routes/questions');

// - App config
const app = express();

const pusher = new Pusher({
	appId: process.env.PUSHER_APPID,
	key: process.env.PUSHER_KEY,
	secret: process.env.PUSHER_SECRET,
	cluster: process.env.PUSHER_CLUSTER,
	encrypted: process.env.PUSHER_ENCRYPTED,
});

// - Middlewares
app.use(cors());

app.use(express.json());
app.use('/', router); // TO BE REMOVED
app.use('/az', azRouter);
app.use('/api', apiRouter);
app.use('/language', langRouter);
app.use('/questions', questionsRouter);

// watches the mongodb collection and sends data to pusher
// whenever there is an insert operation
db.once('open', () => {
	console.log('DB connected');

	const msgCollection = db.collection(dbCollection);
	const changeStream = msgCollection.watch();

	changeStream.on('change', (change) => {
		if (change.operationType === 'update') {
			const field = change.updateDescription.updatedFields;
			if (field.end_timestamp) {
				console.log('end conversation updated');
			} else if (field.messages) {
				const chatId = change.documentKey._id;
				latest_update_pos =
					change.updateDescription.updatedFields.messages.length;
				const messageEvent =
					change.updateDescription.updatedFields.messages[
						latest_update_pos - 1
					];
				// pusher.trigger(`conversations_${chatId}`, 'updated', messageEvent);
				// console.log(field.messages);
				pusher.trigger(`conversations_${chatId}`, 'updated', field.messages);
			}
		} else {
			console.log('Error triggering Pusher');
		}
	});
});

// - Listen commands
app.listen(port, () => {
	console.log(`App listening...${port}`);
});
