const express = require('express')
const router = express.Router()

const { generateVoiceTranslation } = require('../controllers/voiceController')

// middleware that is specific to this router
router.use((req, res, next) => {
	next()
})

router.post('/', (request, response) => {
	const body = request.body
	generateVoiceTranslation(body, response)
})

module.exports = router
