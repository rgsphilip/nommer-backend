var Recipe = require('../models/database').Recipe;
var Tag = require('../models/database').Tag;

module.exports = function(req, res) {
    console.log('we did it: ', req.body);
    var tagTitle = req.body.tag; 
    var recipeId = req.body.recipeId;
    Recipe.findOne({
        where: {
            id: recipeId
        }
        
    }).then(function(foundRecipe) {
        console.log("inside then", foundRecipe);
        Tag
        .findOrCreate({where: {tagName: tagTitle}, defaults: {}})
        .spread(function(tag, created) {
            foundRecipe.addTag(tag); //add the tag to the join
            console.log(tag.get({
            plain: true
            }))
            console.log(created)
        });
        res.sendStatus(200);  
    });
};