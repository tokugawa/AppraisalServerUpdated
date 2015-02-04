var express = require('express');
var router = express.Router();
var User = require('../vo/UserVO').getInstance();
var Order = require('../vo/OrderVO').getInstance();
///////////////////////////////////////////////////////////////////////////

module.exports = function(passport){

  /* GET home page. */
  router.get('/', function(req, res) {
    res.render('login');
  });

  /*router.get('/index.html', function(req, res) {
    //console.log(req.session.redSession);
    if(req.session.redSession && req.session.loggedIn){ //check this for all routes after Login

      res.render('index',{
        session: req.session
      });
    }
    else{
      //res.redirect('/logout');
      res.send('No Session');
    }
  });*/

  router.get('/index.html', isLoggedIn, function(req, res){
    res.render('index',{
      session: req.session
    });
  });

  router.get('/logout', function(req, res) {
    req.session.destroy(); 
    req.logout();
    res.redirect('/');
  });

  /*router.get('/overview.html', function(req, res) {
    if(req.session.redSession && req.session.loggedIn){ //check this for all routes after Login

      res.render('overview',{
        session: req.session
      });
    }
    else{
      //res.redirect('/logout');
      res.send('No Session');
    }
  });*/

  router.get('/overview.html', isLoggedIn, function(req, res){
    res.render('overview',{
      session: req.session
    });
  });

  /*router.get('/overview-appraiser.html', function(req, res) {
    if(req.session.redSession && req.session.loggedIn){ //check this for all routes after Login

      res.render('overview-appraiser',{
        session: req.session
      });
    }
    else{
      //res.redirect('/logout');
      res.send('No Session');
    }
  });*/
  router.get('/overview-appraiser.html', isLoggedIn, function(req, res){
    res.render('overview-appraiser',{
      session: req.session
    });
  });

  /*router.get('/users-home.html', function(req, res) {
    if(req.session.redSession && req.session.loggedIn){ //check this for all routes after Login

      res.render('users-home',{
        session: req.session
      });
    }
    else{
      //res.redirect('/logout');
      res.send('No Session');
    }
  });*/
  router.get('/users-home.html', isLoggedIn, function(req, res){
    res.render('users-home',{
      session: req.session
    });
  });

  /*router.get('/orders-home.html', function(req, res) {
    if(req.session.redSession && req.session.loggedIn){ //check this for all routes after Login

      res.render('orders-home',{
        session: req.session
      });
    }
    else{
      //res.redirect('/logout');
      res.send('No Session');
    }
  });*/
  router.get('/orders-home.html', isLoggedIn, function(req, res){
    res.render('orders-home',{
      session: req.session
    });
  });

  /*router.get('/orders-individual.html', function(req, res) {
    if(req.session.redSession && req.session.loggedIn){ //check this for all routes after Login

      res.render('orders-individual',{
        session: req.session
      });
    }
    else{
      //res.redirect('/logout');
      res.send('No Session');
    }
  });*/
  router.get('/orders-individual.html', isLoggedIn, function(req, res){
    res.render('orders-individual',{
      session: req.session
    });
  });

  /*router.get('/users-individual.html', function(req, res) {
    if(req.session.redSession && req.session.loggedIn){ //check this for all routes after Login

      res.render('users-individual',{
        session: req.session
      });
    }
    else{
      //res.redirect('/logout');
      res.send('No Session');
    }
  });*/
  router.get('/users-individual.html', isLoggedIn, function(req, res){
    res.render('users-individual',{
      session: req.session
    });
  });

  /*router.get('/tasks.html', function(req, res) {
    if(req.session.redSession && req.session.loggedIn){ //check this for all routes after Login

      res.render('tasks',{
        session: req.session
      });
    }
    else{
      //res.redirect('/logout');
      res.send('No Session');
    }
  });*/
  router.get('/tasks.html', isLoggedIn, function(req, res){
    res.render('tasks',{
      session: req.session
    });
  });

  /*router.get('/calendar.html', function(req, res) {
    if(req.session.redSession && req.session.loggedIn){ //check this for all routes after Login

      res.render('calendar',{
        session: req.session
      });
    }
    else{
      //res.redirect('/logout');
      res.send('No Session');
    }
  });*/
  router.get('/calendar.html', isLoggedIn, function(req, res){
    res.render('calendar',{
      session: req.session
    });
  });

  //POST
  /*router.post('/login', function(req, res) {

    //console.log(req.body);

    //Verify User Credentials
    var status = userVO.validateUserWithRole(req.param('username'), req.param('role').toLowerCase(), req.param('password'), function(status){
      if(status){
        req.session.redSession = req.param('username');
        req.session.loggedIn = true;
        res.send({'loginStatus' : req.param('role').toLowerCase()});
      }
      else if(status == null){
        res.send({'loginStatus' : 'error'});
      }
      else{
        res.send({'loginStatus' : 'fail'});
      }
    });
    /////////////////////////////////////////////////////
  });*/
  router.post('/login', function(req, res, next){
    passport.authenticate('local-login', function(err, user){

      if(user){
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          req.session.redSession = req.param('username');
          req.session.loggedIn = true;
          return res.send({'loginStatus' : req.param('role').toLowerCase() });
        });
      }
      else{
        res.send({'loginStatus' : 'failed' });
      }
    })(req, res, next);
  });

  router.post('/getAllUsers', isLoggedIn, function(req, res){

    User.getAllUsers(function(result){
      if(result){
        res.send({'query' : result });
      }
      else{
        res.send({'query' : 'failed' });
      }
    });
  });

  router.post('/getAllOrders', isLoggedIn, function(req, res){

    Order.getAllOrders(function(result){
      if(result){
        res.send({'query' : result });
      }
      else{
        res.send({'query' : 'failed' });
      }
    });
  });

  router.post('/getOrdersCompletedPerAppraiser', isLoggedIn, function(req, res){

    User.getOrdersCompletedPerAppraiser(function(result){
      if(result){
        res.send({'query' : result });
      }
      else{
        res.send({'query' : 'failed' });
      }
    });
  });

  router.post('/getCompletedPendingActiveOrderCount', isLoggedIn, function(req, res){

    Order.getCompletedPendingActiveOrderCount(function(result){
      if(result){
        res.send({'query' : result });
      }
      else{
        res.send({'query' : 'failed' });
      }
    });
  });

  router.post('/getUserWithOrders', isLoggedIn, function(req, res){

    User.getUserWithOrders(req.param('user_id'), function(result){
      if(result){
        res.send({'query' : result });
      }
      else{
        res.send({'query' : 'failed' });
      }
    });
  });
  ///////////////////////////////////////////////////////////////////////////


  return router;
}

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.send('No Session');
}