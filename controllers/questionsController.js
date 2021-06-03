const { questionsModel, questionsNewModel } = require('../models/dbTransmate')

const getQuestions = (payload, response) => {
	questionsNewModel.find({ categories: payload }, (err, data) => {
		if (err) {
			return response.status(500).send(err)
		} else {
			return response.status(200).send(data)
		}
	})
	
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
	let categories = [];
	let result = [];
	let combinedCategories = []
	questionsNewModel
		.find({}, { categories: 1 }, (err, data) => {
			if (err) {
				return response.status(500).send(err)
			} else {
				data.forEach(element => {
					combinedCategories.push(...element.categories)
				})

				result = combinedCategories.reduce(
					(unique, item) =>
						unique.includes(item) ? unique : [...unique, item],
					[]
				)

				Object.keys(result).map((key) => {
					categories.push({ id: parseInt(key), name: result[key]})
				})
				response.status(200).send(categories)
			}
		})
}

const getAllQuestions = (response) => {
	questionsNewModel.find({}, (err, data) => {
		if (err) {
			return response.status(500).send(err)
		} else {
			console.log(data)
			return response.status(200).send(data)
		}
	})
}

const getQuestionsByCategory = (payload, response) => {
	questionsNewModel.find({ 'category.id': payload }, (err, data) => {
		if (err) {
			return response.status(500).send(err)
		} else {
			return response.status(200).send(data)
		}
	})
}

const getCategoriesDistinct = (payload, response) => {
	questionsNewModel.find({}, (err, data) => {
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
	getCategoriesDistinct,
	getAllQuestions,
}
