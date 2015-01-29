var express = require('express');
var router = express.Router();


///////////////////////////////////////////////////////////////////////////

/* GET home page. */
router.get('/', function(req, res) {
  res.render('login');
});

router.get('/index.html', function(req, res) {
  console.log(req.session.redSession);
  if(req.session.redSession && req.session.loggedIn){ //check this for all routes after Login

    res.render('index');
  }
  else{
    res.send('No Session');
  }
  
});


router.get('/logout', function(req, res) {
  req.session.destroy(); 
  res.redirect('/');
});


router.get('/overview.html', function(req, res) {
  res.render('overview');
});

router.get('/users-home.html', function(req, res) {
  res.render('users-home');
});


router.get('/orders-home.html', function(req, res) {
  res.render('orders-home');
});

router.get('/orders-individual.html', function(req, res) {
  res.render('orders-individual');
});

router.get('/overview.html', function(req, res) {
  res.render('overview');
});


router.get('/users-individual.html', function(req, res) {
  res.render('users-individual');
});

router.get('/tasks.html', function(req, res) {
  res.render('tasks');
});

router.get('/calendar.html', function(req, res) {
  res.render('calendar');
});

//POST
router.post('/login', function(req, res) {

  if(req.param('username')==='123'&& req.param('password')==='test'){
    req.session.redSession = req.param('username');
    req.session.loggedIn = true;
    res.send({'loginStatus' : 'success'});
  }
  else{
    res.send({'loginStatus' : 'fail'});
  }
});
///////////////////////////////////////////////////////////////////////////

module.exports = router;