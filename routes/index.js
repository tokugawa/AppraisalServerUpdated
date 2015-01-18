var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index.html');
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





module.exports = router;