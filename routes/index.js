var Recipe = require('../models/database').Recipe;
var Tag = require('../models/database').Tag;
var addrecipe = require('../controllers/addrecipe');
var addtag = require('../controllers/addtag');

module.exports = function(app, passport) {
	
	

	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
		
		// the callback after facebook has authenticated the user    
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : 'http://localhost:3000/#/',
			failureRedirect : 'http://localhost:3000/#/login'
	}));

	app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

	// the callback after google has authenticated the user
	app.get('/auth/google/callback',
		passport.authenticate('google', {
			successRedirect : 'http://localhost:3000/#/',
			failureRedirect : 'http://localhost:3000/#/login'
		}));

	//logout
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('http://localhost:3000/#/login');
	});


	//Return the user's recipes on the recipe page
	app.get('/recipes', function(req, res, next) {
		Recipe.findAll({
			where: {
				userId: 1 // need to replace this with the actual user's id
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
	app.get('/alltags', function(req, res, next) {
		Tag.findAll({
			where: {
				userId: 1 // need to replace this with the actual user's id
			}
		}).then(function(tags) {
			var allTags = tags.map(tag => {return tag.get({plain : true})});
			res.status(200);  
			res.set({
				'Content-Type': 'application/json'  
			});  
			res.send(allTags);
		});
	})

	app.post('/postrecipe', addrecipe);
	app.post('/addtag', addtag);
};

function isLoggedIn(req, res, next) {
	console.log(req.isAuthenticated());	
	if (req.isAuthenticated()) {
		console.log('is logged in');
		return next();
	}
	console.log('not logged in');
	res.redirect('http://localhost:3000/#/login/');
}