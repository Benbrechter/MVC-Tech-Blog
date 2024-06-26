const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Post extends Model {};

Post.init(
    {
      id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      post_title:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      post: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id:{
        type: DataTypes.INTEGER,
        references: {
          model: 'user',
          key: 'id',
        },
      }

    },
    {
        sequelize,
        timestamps: true, //go on time of creation   accesed at createdAt
        freezeTableName: true,
        underscored: true,
        modelName: 'post',
    }
)

module.exports = Post;