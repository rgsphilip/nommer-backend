var Grocery = require('../models/database').Grocery;

module.exports = function(req, res) {
    console.log('we did it: ', req.body);
    //need to delimit these based on /n or /r
    var ingredientArray = req.body.groceries.split("\n");
    console.log("ingredient array: ", ingredientArray);
    var ingredients = ingredientArray.map(ingredient => {
        return {
            groceryName: ingredient,
            userId: req.user.sub,
        };
    });

    Grocery.bulkCreate(ingredients)
        .then(() => {
            return Grocery.findAll({
                where: {
                    userId: req.user.sub // need to replace this with the actual user's id
                }      
            });
        })
        .then(function(groceries) {
            var allGroceries = groceries.map(grocery => {return grocery.get({plain : true})});
            res.status(200);  
            res.set({
                'Content-Type': 'application/json'  
            });  
            res.send(allGroceries);
        });
    
};