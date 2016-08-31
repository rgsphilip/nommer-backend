var Recipe = require('../models/database').Recipe;
var Tag = require('../models/database').Tag;

module.exports = function(req, res) {
    console.log('we did it: ', req.body);
    var title = req.body.title;
    var link = req.body.link;
    var tags = req.body.tags;
    var userId = req.user.sub;
    //Possible refactor: right now only one-word tags are allowed
    var tagArray = tags.split(" ");

    var newRecipe = Recipe.build({
        recipeName: title,
        recipeLink: link,
        userId: userId,
    });

    newRecipe.save().catch(function(err) {
        if (err)
            throw err;
        return done(null, newRecipe);
    })
    //need to findOrCreate tags
    //how do we capture what recipe was just added and associate it with the right tag?
    for (var i = 0; i < tagArray.length; i++) {
        Tag
        .findOrCreate({where: {
            tagName: tagArray[i],
            userId: userId,
        }, defaults: {}})
        .spread(function(tag, created) {
            newRecipe.addTag(tag); //add the tag to the join
            console.log(tag.get({
                plain: true
            }))
            console.log(created)
            res.status(200);
            res.set({
                'Content-Type': 'application/json'  
            });
            res.send(newRecipe);
        })
    }
};