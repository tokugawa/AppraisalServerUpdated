var express = require('express');
var router = express.Router();

///////////////////////////////////////////////////////////////////////////

module.exports = function(passport){

  /* GET home page. */
  router.get('/', function(req, res) {
    res.render('login');
  });

  router.get('/index.html', function(req, res) {
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
  });

  router.get('/logout', function(req, res) {
    req.session.destroy(); 
    res.redirect('/');
  });

  router.get('/overview.html', function(req, res) {
    if(req.session.redSession && req.session.loggedIn){ //check this for all routes after Login

      res.render('overview',{
        session: req.session
      });
    }
    else{
      //res.redirect('/logout');
      res.send('No Session');
    }
  });

  router.get('/overview-appraiser.html', function(req, res) {
    if(req.session.redSession && req.session.loggedIn){ //check this for all routes after Login

      res.render('overview-appraiser',{
        session: req.session
      });
    }
    else{
      //res.redirect('/logout');
      res.send('No Session');
    }
  });

  router.get('/users-home.html', function(req, res) {
    if(req.session.redSession && req.session.loggedIn){ //check this for all routes after Login

      res.render('users-home',{
        session: req.session
      });
    }
    else{
      //res.redirect('/logout');
      res.send('No Session');
    }
  });

  router.get('/orders-home.html', function(req, res) {
    if(req.session.redSession && req.session.loggedIn){ //check this for all routes after Login

      res.render('orders-home',{
        session: req.session
      });
    }
    else{
      //res.redirect('/logout');
      res.send('No Session');
    }
  });

  router.get('/orders-individual.html', function(req, res) {
    if(req.session.redSession && req.session.loggedIn){ //check this for all routes after Login

      res.render('orders-individual',{
        session: req.session
      });
    }
    else{
      //res.redirect('/logout');
      res.send('No Session');
    }
  });

  router.get('/overview.html', function(req, res) {
    if(req.session.redSession && req.session.loggedIn){ //check this for all routes after Login

      res.render('overview',{
        session: req.session
      });
    }
    else{
      //res.redirect('/logout');
      res.send('No Session');
    }
  });

  router.get('/users-individual.html', function(req, res) {
    if(req.session.redSession && req.session.loggedIn){ //check this for all routes after Login

      res.render('users-individual',{
        session: req.session
      });
    }
    else{
      //res.redirect('/logout');
      res.send('No Session');
    }
  });

  router.get('/tasks.html', function(req, res) {
    if(req.session.redSession && req.session.loggedIn){ //check this for all routes after Login

      res.render('tasks',{
        session: req.session
      });
    }
    else{
      //res.redirect('/logout');
      res.send('No Session');
    }
  });

  router.get('/calendar.html', function(req, res) {
    if(req.session.redSession && req.session.loggedIn){ //check this for all routes after Login

      res.render('calendar',{
        session: req.session
      });
    }
    else{
      //res.redirect('/logout');
      res.send('No Session');
    }
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
          return res.send({'loginStatus' : req.param('role').toLowerCase()});
        });
      }
      else{
        res.send({'loginStatus' : 'failed' });
      }
    })(req, res, next);
  });
  ///////////////////////////////////////////////////////////////////////////


  return router;
}


// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}