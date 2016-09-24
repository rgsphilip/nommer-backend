var Grocery = require('../models/database').Grocery;

module.exports = function(req, res) {
    console.log('we did it: ', req.body);

    var groceryId = req.body.groceries.map(grocery => {
        return grocery.id;
    });
    console.log("grocery id ", groceryId);
    
    Grocery.destroy({
        where: {
            id: {
                $in: groceryId
            }
        }
    })
    .then(() => {
            return Grocery.findAll({
                where: {
                    userId: req.user.sub 
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