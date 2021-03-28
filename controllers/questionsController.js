const { questionsModel, questionsNewModel } = require('../models/dbTransmate')

const getQuestions = (payload, response) => {
	if (payload) {
		questionsModel.find({ title: payload }, (err, data) => {
			if (err) {
				return response.status(500).send(err)
			} else {
				return response.status(200).send(data[0])
			}
		})
	} else {
		questionsModel.find((err, data) => {
			if (err) {
				return response.status(500).send(err)
			} else {
				return response.status(200).send(data)
			}
		})
	}
}

// returns the list of categories of questions
const getCategories = (payload, response) => {
	questionsModel.find({}, { title: 1 }, (err, data) => {
		if (err) {
			return response.status(500).send(err)
		} else {
			return response.status(200).send(data)
		}
	})
}

const getCategoriesNew = (response) => {
	questionsNewModel.find({},  {  category:  1  }, (err, data) => {
		if (err) {
			return response.status(500).send(err)
		} else {
			return response.status(200).send(data)
		}
	}).distinct("category")
}

const getQuestionsByCategory = (payload, response) => {
	questionsNewModel.find({ category: payload }, (err, data) => {
		if (err) {
			return response.status(500).send(err)
		} else {
			return response.status(200).send(data)
		}
	})
}

module.exports = {
	getQuestions,
	getCategories,
	getCategoriesNew,
	getQuestionsByCategory,
}
