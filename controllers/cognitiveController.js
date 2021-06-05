const uuidv4 = require('uuid/v4');
const axios = require('axios');

//variables
const langBaseURL = process.env.AZ_API_BASE_URL
const langSubKey = process.env.AZ_API_SUB_KEY
const speechBaseURL = process.env.API_SPEECH_BASE_URL
const speechSubKey = process.env.API_SPEECH_SUB_KEY;
const az_region = process.env.AZ_REGION;


const getLanguages = async (response) => {
	const options = {
		method: 'GET',
		baseURL: langBaseURL,
		url: '/languages',
		params: {
			'api-version': '3.0',
		},
		headers: {
			'Ocp-Apim-Subscription-Key': langSubKey,
			'Ocp-Apim-Subscription-Region': az_region,
			'Content-type': 'application/json',
			'X-ClientTraceId': uuidv4().toString(),
		},
		json: true,
	};

	const result = await axios.request(options);
	if (result) {
		return response.status(200).send(result.data);
	}
};

const getVoices = async (response) => {
	const options = {
		method: 'GET',
		baseURL: speechBaseURL,
		url: '/cognitiveservices/voices/list',
		headers: {
			'Ocp-Apim-Subscription-Key': speechSubKey,
			// 'Ocp-Apim-Subscription-Region': az_region,
			'Content-type': 'application/json',
			'X-ClientTraceId': uuidv4().toString(),
		},
		json: true,
	};

	const result = await axios.request(options);
	if (result) {
		return response.status(200).send(result.data);
	}
};

const translate = async (payload, response) => {
	const options = {
		method: 'post',
		url: '/translate',
		baseURL: langBaseURL,
		params: {
			'api-version': '3.0',
			to: payload.to,
		},
		headers: {
			'Ocp-Apim-Subscription-Key': langSubKey,
			'Ocp-Apim-Subscription-Region': az_region,
			'Content-type': 'application/json',
			'X-ClientTraceId': uuidv4().toString(),
		},
		data: [{ Text: payload.text }],
	};

	const result = await axios.request(options);
	if (result) {
		return response.status(200).send(result.data[0].translations);
	}
};

const translateQuestion = async (payload, response) => {
	let translateArr = []
	let translations = []
	const languages = [
		'en',
		'fr',
		'es',
		'fa',
		'zh-Hans',
		'ko',
		'yue',
		'th',
		'vi',
		'hi',
		'ru',
		'ar',
	]
	languages.forEach((code, index) => {
		const options = {
			method: 'post',
			url: '/translate',
			baseURL: langBaseURL,
			params: {
				'api-version': '3.0',
				to: code,
			},
			headers: {
				'Ocp-Apim-Subscription-Key': langSubKey,
				'Ocp-Apim-Subscription-Region': az_region,
				'Content-type': 'application/json',
				'X-ClientTraceId': uuidv4().toString(),
			},
			data: [{ Text: payload }],
		}

		translateArr.push(axios.request(options))
	})
	await Promise.all(translateArr).then((results) => {
		results.forEach((result) => {
			let obj = {
				language: result.data[0].translations[0].to,
				question: result.data[0].translations[0].text,
			}
			translations.push(obj)
		})
	})
	return response.status(200).send(translations)
}


module.exports = {
	getLanguages,
	getVoices,
	translate,
	translateQuestion,
}