var express = require('express');
var router = express.Router();


///////////////////////////////////////////////////////////////////////////

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
router.post('/login', function(req, res) {

  //Simulated User Database
  function DummyUser(username, password, roles){
    this.username = username;
    this.password = password;
    this.roles = roles;
  };

  var dummyUsersDatabase = [
    new DummyUser('123', 'test', ['appraiser', 'administrator']),
    new DummyUser('admin', 'test', ['administrator']),
    new DummyUser('user', 'test', ['user']),
  ];
  //////////////////////////////////////////////////////

  console.log(req.body);
  //Verify User Credentials
  var userFound = false;
  for(var x=0; x<dummyUsersDatabase.length; x++){
    if(dummyUsersDatabase[x].username == req.param('username')){
      for(var y=0; y<dummyUsersDatabase[x].roles.length; y++){
        if(dummyUsersDatabase[x].roles[y].toLowerCase() == req.param('role').toLowerCase()){
          if(dummyUsersDatabase[x].password == req.param('password')){
            userFound = true;
          }
        }
      }
    }
  }
  /////////////////////////////////////////////////////

  if(userFound){
    req.session.redSession = req.param('username');
    req.session.loggedIn = true;
    res.send({'loginStatus' : req.param('role').toLowerCase()});
  }
  else{
    res.send({'loginStatus' : 'fail'});
  }
});
///////////////////////////////////////////////////////////////////////////

module.exports = router;