const router = require('express').Router();
const  {User, Post, Comment} = require('../models/index');
const withAuth = require('../utils/auth');

//create a post
router.post('/post',async (req,res) => {
  try{
    console.log(req.session.user_id, "user_id")
    const postData = await Post.create({
      post_title: req.body.post_title,
      post: req.body.post,
      user_id: req.session.user_id,
    });
    res.status(200).json(postData)
  }catch (err){
    res.status(500).json(err)
  }
});
router.get('/post', withAuth, async (req,res) =>{
  res.render('create-post')
})
router.get('/update/:id', async (req,res) => {
  res.render('update')
} )
//update a post
router.put('/update/:id', async (req, res) => {
  try{
    const updatedPost = await Post.update({
      post_title: req.body.post_title,
      post: req.body.post
    },
    {
      where: {
        id : req.params.id
      }
    }
    );
    if (!updatedPost[0]) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json({ message: 'Post updated successfully' });
  }catch (err){
    res.status(500).json(err)
  }
});
//delete a post
router.delete('/post/:id', async (req,res) => {
  try{
   const deletedPost = await Post.destroy({
    where: {
      id: req.params.id
    }
   });
   if (!deletedPost) {
    return res.status(404).json({ error: 'Post not found' });
  }

  res.status(200).json({ message: 'Post deleted successfully' });
  }catch (err){
  res.status(500).json(err)
  }
})
//create a comment
router.post('/comment', async (req,res) => {
try{
   const commentData = await Comment.create({
  
     comment: req.body.comment,
     post_id: req.body.post_id
   });
   console.log(commentData);
   res.status(200).json(commentData)
}catch (err){
  res.status(500).json(err)
}
});

//this loads all the post on the homepage
router.get('/', async (req,res) => {
   try{
    const postData = await Post.findAll({    //assume findAll will always give an array
      include:[{ model: User }]
    });
    const posts = postData.map(post => post.get({plain: true})) //strips the data of sequilize and gives post data
    res.render('homepage', {posts, loggedIn: req.session.loggedIn});
   }catch(err){
    res.status(500).json(err)
   }
    
});
//this loads all the post that the user creates
router.get('/dashboard', withAuth, async (req,res) => {
  try{
   const postData = await Post.findAll({
    where: {
      user_id: req.session.user_id    //get all the post that match the user id
    }
   })
   const posts = postData.map(post => post.get({plain: true})) //strips the data of sequilize and gives post data
    res.render('dashboard', {posts, loggedIn: req.session.loggedIn});
  }catch(err){
    res.status(500).json(err)
  }
});
//when you click the post title it will bring you to this post
router.get('/post/:id' , withAuth , async (req, res) => {
  try{
  const postData = await Post.findByPk(req.params.id, {include:[{ model: User }]});
  const commentData = await Comment.findAll({where: { post_id: req.params.id}}, {include:[{ model: User }]});
  //the first user is who wrote the post and the second user is who wrote the comments
  const post = postData.get({plain: true});
  const comments =  commentData.map(comments => comments.get({plain: true}))
  console.log(comments); 
  res.render('post', {...post,comments, loggedIn: req.session.loggedIn}); // ... is a spread opperator
  }catch (err){
   res.status(500).json(err)
  }
});

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
    res.render('login');
  });
  
router.get('/signUp', (req,res) => {
  res.render('sign-up')
})


module.exports = router;