var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json())

/* GET home page. */
router.get('/', function(req, res) {
  res.render('login.html');
});

router.get('/index.html', function(req, res) {
  res.render('index.html');
});

router.post('/login', function(req, res) {
  console.log(req.param);
  console.log(req.param('username'));
  console.log(req.query.username);
  console.log(req.body);
  console.log(req.route);
  //console.log(req);
  if(false){
    res.send({'loginStatus' : 'success'});
  }
  else{
    res.send({'loginStatus' : 'fail'});
  }
});

router.get('/overview.html', function(req, res) {
  res.render('overview.html');
});

router.get('/users-home.html', function(req, res) {
  res.render('users-home.html');
});


router.get('/orders-home.html', function(req, res) {
  res.render('orders-home.html');
});

router.get('/orders-individual.html', function(req, res) {
  res.render('orders-individual.html');
});

router.get('/overview.html', function(req, res) {
  res.render('overview.html');
});


router.get('/users-individual.html', function(req, res) {
  res.render('users-individual.html');
});

router.get('/tasks.html', function(req, res) {
  res.render('tasks.html');
});

router.get('/calendar.html', function(req, res) {
  res.render('calendar.html');
});

module.exports = router;