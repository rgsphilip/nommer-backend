var addrecipe = require('../controllers/addrecipe');

module.exports = function(app, passport) {
	
	app.post('/postrecipe', addrecipe);

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

	app.get('/recipes', isLoggedIn, function(req, res, next) {
		res.sendStatus(500);
	})
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