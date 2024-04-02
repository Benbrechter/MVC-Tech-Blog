const router = require('express').Router();
const  {User, Post, Comment} = require('../models/index');
const withAuth = require('../utils/auth');

router.get('/', async (req,res) => {
   try{
    const postData = await Post.findAll({    //assume findAll will always give an array
      include:[User]
    });
    const posts = postData.map(post => post.get({plain: true})) //strips the data of sequilize and gives post data
    res.render('homepage', {posts, loggedIn: req.session.loggedIn});
   }catch(err){
    res.status(500).json(err)
   }
    
});

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

router.get('/post/:id', async (req, res) => {
  try{
  const postData = await Post.findByPk(req.params.id, {include:[User,{model: Comment, include: [User]}]});
  //the first user is who wrote the post and the second user is who wrote the comments
  const post = postData.get({plain: true});
  res.render('post', {...post, loggedIn: req.session.loggedIn}); // ... is a spread opperator
  }catch (err){

  }
})

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