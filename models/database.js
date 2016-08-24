var Sequelize = require('Sequelize');
var sequelize = new Sequelize('postgres://localhost:5432/nommer');

var User = sequelize.define('user', {
  authId: {
      type: Sequelize.STRING,
      field: 'authId' 
  },
  authType: {
      type: Sequelize.STRING,
      field: 'authType' 
  },
  token: {
      type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
    field: 'email' 
  },
  name: {
    type: Sequelize.STRING,
    field: 'name'
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

var Recipe = sequelize.define('recipe', {
  recipeName: {
    type: Sequelize.STRING,
    field: 'recipe_name' 
  },
  recipeLink: {
    type: Sequelize.STRING,
    field: 'recipe_link' 
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

Recipe.belongsTo(User);

var Tag = sequelize.define('tag', {
  tagName: {
    type: Sequelize.STRING,
    field: 'tag_name' 
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

Tag.belongsTo(User);

//Recipe.belongsToMany(Tag, { as: 'recipeId', through: 'tag', foreignKey: 'id'});
Recipe.belongsToMany(Tag, {through: 'RecipeTag'});
Tag.belongsToMany(Recipe, {through: 'RecipeTag'});

sequelize.sync();

module.exports = {
    User,
    Recipe,
    Tag
};