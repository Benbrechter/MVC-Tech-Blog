const User = require('./Users')
const Post = require('./blog-post')
const Comment = require('./comments')

Post.hasMany(Comment, {
    foreignKey: 'post_id',
});

Comment.belongsTo(Post, {
    foreignKey: 'post_id',
});

User.hasMany(Post, {
    foreignKey: 'user_id',
});

Post.belongsTo(User, {
    foreignKey: 'user_id',
});


module.exports = {User, Post, Comment};