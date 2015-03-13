var express = require('express');
var router = express.Router();
var User = require('../vo/UserVO').getInstance();
var Order = require('../vo/OrderVO').getInstance();
var Address = require('../vo/AddressVO').getInstance();
///////////////////////////////////////////////////////////////////////////

module.exports = function(passport){

  /* GET home page. */
  router.get('/', function(req, res) {
    res.render('login');
  });

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

  router.get('/overview.html', isLoggedIn, function(req, res){
    res.render('overview',{
      session: req.session
    });
  });

  router.get('/overview-appraiser.html', isLoggedIn, function(req, res){
    res.render('overview-appraiser',{
      session: req.session
    });
  });

  router.get('/users-home.html', isLoggedIn, function(req, res){
    res.render('users-home',{
      session: req.session
    });
  });

  router.get('/orders-home.html', isLoggedIn, function(req, res){
    res.render('orders-home',{
      session: req.session
    });
  });

  router.get('/orders-individual.html', isLoggedIn, function(req, res){
    res.render('orders-individual',{
      session: req.session
    });
  });

  router.get('/users-individual.html', isLoggedIn, function(req, res){
    res.render('users-individual',{
      session: req.session
    });
  });

  router.get('/tasks.html', isLoggedIn, function(req, res){
    res.render('tasks',{
      session: req.session
    });
  });

  router.get('/calendar.html', isLoggedIn, function(req, res){
    res.render('calendar',{
      session: req.session
    });
  });
  ////////////////////////////////////////////////////////////////////////

  //POST
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

  router.post('/getOrderById', isLoggedIn, function(req, res){

    Order.getOrderById(req.param('order_id'), function(result){
      if(result){
        console.log('getOrderById SUCCESS');
        res.send({'query' : result });
      }
      else{
        console.log('getOrderById Failed');
        res.send({'query' : 'failed' });
      }
    });
  });

  router.post('/insertNewUser', isLoggedIn, function(req, res){

    Address.createNewAddress(req.param('addressLine1'), req.param('addressLine2'), req.param('city'), req.param('state'), req.param('zip'), '', '', '', '', '', '', function(result){

      if(result){
        console.log('insertNewAddress SUCCESS');
        User.createNewUser(req.param('email'), '', req.param('firstName'), req.param('lastName'), result._id, false, req.param('role'), function(result){
          if(result){
            console.log('insertNewUser SUCCESS');
            res.send({'query' : result });
          }
          else{
            console.log('insertNewUser Failed');
            res.send({'query' : 'failed' });
          }
        });
      }
      else{
        console.log('insertNewAddress Failed');
        res.send({'query' : 'failed' });
      }
    });

  });

  router.post('/updateUserInfo', isLoggedIn, function(req, res){

    //TODO
    User.updateUser(req.param('username'), {user_id: req.param('email'), password: req.param('password'), firstName: req.param('firstName'), lastName: req.param('lastName')}, function(result){

      if(result){
        console.log('updateUserInfo SUCCESS');
        res.send({'query' : result });
      }
      else{
        console.log('updateUserInfo Failed');
        res.send({'query' : 'failed' });
      }
    });
  });

  router.post('/updateAddress', isLoggedIn, function(req, res){


  });

  router.post('/getAllAddresses', isLoggedIn, function(req, res){

    Address.getAllAddresses(function(result){

      if(result){
        res.send({'query' : result });
      }
      else{
        res.send({'query' : 'failed' });
      }
    });
  });
  ///////////////////////////////////////////////////////////////////////////

  //REST API
  router.route('/users')
    .post(function(req, res){

      //TODO insert new user
    })
    .get(function(req, res){

      //TODO get list of all users
    });
  router.route('/users/:user_id')
    .get(function(req, res){

      //TODO get specific user
    })
    .put(function(req, res){

      //TODO update specific user with user_id
    })
    .delete(function(req, res){

      //TODO delete specific user by user_id
    });
  router.route('/tasks/user_id')
    .post(function(req, res){

      //TODO insert a new task for user
    })
    .get(function(req, res){

      //TODO get list of all tasks for a user
    });
  router.route('/tasks/:task_id')
    .get(function(req, res){

      //TODO get specific task
    })
    .put(function(req, res){

      //TODO update a specific taks
    })
    .delete(function(req, res){

      //TODO delete a specific task
    });
  router.route('/orders')
    .post(function(req, res){

      //TODO insert a new order
    })
    .get(function(req, res){

      //TODO get list of all orders
    });
  router.route('/orders/:order_id')
    .get(function(req, res){

      //TODO get specific information for an order
    })
    .put(function(req, res){

      //TODO update a specific order
    })
    .delete(function(req, res){

      //TODO delete a specific order
    });
  router.route('/customers')
    .post(function(req, res){

      //TODO insert a new customer
    })
    .get(function(req, res){

      //TODO get list of all customers
    });
  router.route('/customers/:customer_id')
    .get(function(req, res){

      //TODO get specific information for a customer
    })
    .put(function(req, res){

      //TODO update a specific customer
    })
    .delete(function(req, res){

      //TODO delete a specific customer
    });
  router.route('/properties')
    .post(function(req, res){

      //TODO insert a new property
    })
    .get(function(req, res){

      //TODO get list of all properties
    });
  router.route('/properties/:property_id')
    .get(function(req, res){

      //TODO get specific property
    })
    .put(function(req, res){

      //TODO update a specific property
    })
    .delete(function(req, res){

      //TODO delete a specific property
    });
  router.route('/clients')
    .post(function(req, res){

      //TODO insert a new client
    })
    .get(function(req, res){

      //TODO get list of all clients
    });
  router.route('/clients/:client_id')
    .get(function(req, res){

      //TODO get specific client
    })
    .put(function(req, res){

      //TODO update a specific client
    })
    .delete(function(req, res){

      //TODO delete a specific client
    });
  router.route('/addresses')
    .post(function(req, res){

      //TODO insert a new address
    })
    .get(function(req, res){

      //TODO get list of all addresses
    });
  router.route('/addresses/:address_id')
    .get(function(req, res){

      //TODO get specific address
    })
    .put(function(req, res){

      //TODO update a specific address
    })
    .delete(function(req, res){

      //TODO delete a specific address
    });
  /////////////////////////////////////////////////////////////////////////////

  return router;
}

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.send('No Session');
}