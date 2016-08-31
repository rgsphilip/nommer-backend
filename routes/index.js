var Recipe = require('../models/database').Recipe;
var Tag = require('../models/database').Tag;
var Grocery = require('../models/database').Grocery;
var addrecipe = require('../controllers/addrecipe');
var addtag = require('../controllers/addtag');
var searchbytag = require('../controllers/searchbytag');
var addgrocery= require('../controllers/addgrocery');
module.exports = function(app, authCheck) {
	
	//Return the user's recipes on the recipe page
	app.get('/recipes', authCheck, function(req, res, next) {
		Recipe.findAll({
			where: {
				userId: req.user.sub
			},
			include: [{
				model: Tag,
			}]
			
		}).then(function(recipes) {
			var allRecipes = recipes.map(recipe => {return recipe.get({plain : true})});
			res.status(200);  
			res.set({
				'Content-Type': 'application/json'  
			});  
			res.send(allRecipes);
		});
	})

	//Return the user's tags on the tag page
	app.get('/alltags', authCheck, function(req, res, next) {
		Tag.findAll({
			where: {
				userId: req.user.sub
			}
		}).then(function(tags) {
			var allTags = tags.map(tag => {return tag.get({plain : true})});
			res.status(200);  
			res.set({
				'Content-Type': 'application/json'  
			});  
			res.send(allTags);
		});
	});

	app.get('/allgroceries', authCheck, function(req, res, next) {
		Grocery.findAll({
			where: {
				userId: req.user.sub
			}
		}).then(function(groceries) {
			var allGroceries = groceries.map(grocery => {return grocery.get({plain : true})});
			res.status(200);  
			res.set({
				'Content-Type': 'application/json'  
			});  
			res.send(allGroceries);
		});
	});

	app.post('/postrecipe', authCheck, addrecipe);
	app.post('/addtag', authCheck, addtag);
	app.post('/searchbytag', authCheck, searchbytag);
	app.post('/postgroceries', authCheck, addgrocery);
};
