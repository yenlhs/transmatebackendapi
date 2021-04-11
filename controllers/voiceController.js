const fs = require('fs')
const AWS = require('aws-sdk')

AWS.config.update({
	accessKeyId: process.env.ACCESS_ID,
	secretAccessKey: process.env.SECRET_KEY,
})
// Create an Polly client
const Polly = new AWS.Polly({
	signatureVersion: 'v4',
	region: 'us-east-1',
})

const s3 = new AWS.S3()

const uploadAudio = (key, audio) => {
	// Setting up S3 upload parameters
	const params = {
		Bucket: 'transmateaudio',
		Key: key, // File name you want to save as in S3
		Body: audio,
		ACL: 'public-read',
	}

	// Uploading files to the bucket
	s3.upload(params, function (err, data) {
		if (err) {
			throw err
		}
		console.log(`Audio uploaded successfully. ${data.Location}`)
	})
}

const getParams = (language) => {
	switch (language) {
		case 'en':
			return { voice: 'Emma', languageCode: 'en-GB' }
			break
		case 'fr':
			return { voice: 'Lea', languageCode: 'fr-FR' }
			break
		case 'es':
			return { voice: 'Conchita', languageCode: 'es-ES' }
			break
		case 'hi':
			return { voice: 'Aditi', languageCode: 'hi-IN' }
			break
		case 'zh-Hans':
			return { voice: 'Zhiyu', languageCode: 'cmn-CN' }
			break
		case 'ko':
			return { voice: 'Seoyeon', languageCode: 'ko-KR' }
			break
		case 'ru':
			return { voice: 'Tatyana', languageCode: 'ru-RU' }
			break
		case 'ar':
			return { voice: 'Zeina', languageCode: 'arb' }
			break
		default:
			return { voice: 'Kimberly', languageCode: 'en-US' }
			break
	}
}

const generateVoiceTranslation = (payload, response) => {
	console.log(payload)
	const voiceParam = getParams(payload.language)
	let params = {
		Text: payload.text,
		OutputFormat: 'mp3',
		VoiceId: voiceParam.voice,
		LanguageCode: voiceParam.languageCode,
	}
	Polly.synthesizeSpeech(params, (err, data) => {
		if (err) {
			console.log(err.code)
		} else if (data) {
			if (data.AudioStream instanceof Buffer) {
				const filename = `${payload.questionId}${payload.language}.mp3`
				console.log(filename)
				uploadAudio(filename, data.AudioStream)
				response.status(200).send(`${process.env.S3_AUDIO_BUCKET}/${filename}`)
			}
		}
	})
}

module.exports = {
	generateVoiceTranslation,
}
