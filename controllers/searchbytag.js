var Recipe = require('../models/database').Recipe;
var Tag = require('../models/database').Tag;

module.exports = function(req, res) {
    console.log('we did it: ', req.body);
    var tags = req.body.tags;
    console.log('hello');
    Recipe.findAll({
        include: [{
        model: Tag,
        where: { tagName:  {
            $in: tags
        }}
    }]})
    .then(function(foundRecipes) {
        const recipeIds = foundRecipes.map(recipe => {return recipe.get('id')});
        return Recipe.findAll({
			where: { id: {
                    $in: recipeIds
                }
			},
			include: [{
				model: Tag,
			}]
			
	})})
    .then(function(recipes) {
        var allRecipes = recipes.map(recipe => {return recipe.get({plain : true})});
        res.status(200);  
        res.set({
            'Content-Type': 'application/json'  
        });  
		res.send(allRecipes);
	});
};