/*******************************************************************************************************/
/*********************************restApiV2.js is the REST server routes.*******************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Brandon Rodenmayer       Date: March, 2015         Desc: Initial Built
/*******************************************************************************************************/

var express = require('express');
var router = express.Router();
var mongoInterface = require('./MongoInterface.js').getInstance();
///////////////////////////////////////////////////////////////////////////

module.exports = function(){

  //Generate temporary API Key
  router.route('/api/v2/authenticate')
    .post(function(req, res){

      console.log('Starting to authenticate user API V2');
      //console.log(req.param('user_id'));
      //console.log(req.param('password'));
      mongoInterface.authenticateUser({user_id: req.param('user_id'), password: req.param('password')}, function(result){

        if(result){
          res.send({query: result});
        }
        else{
          res.send({query: 'failed'});
        }
      });
    });
  //Destroy current API Key for user
  router.route('/api/v2/destroyApiKey/:user_id')
    .post(function(req, res){

      console.log('Starting to destroy the current API Key for '+req.params.userId);
      mongoInterface.destroyApiKey({user_id: req.params.user_id}, function(result){

        if(result){
          res.send({query: 'success'});
        }
        else{
          res.send({query: 'failed'});
        }
      });
    });

  //Users
  router.route('/api/v2/users')
    .post(function(req, res){

      //TODO CHECK ABILITY
      console.log('Inserting a new user REST');
      mongoInterface.updateKey({api_key: req.param('api_key')}, function(result){

        if(result){
          console.log('key updated');
          mongoInterface.createUser(
            {
              email: req.param('email'),
              password: req.param('password'),
              first_name: req.param('first_name'),
              last_name: req.param('last_name'),
              address_id: req.param('address_id'),
              user_active: false,
              role: req.param('role')
            }, 
            function(result){

              if(result){
                res.send({query: result});
              }
              else{
                res.send({query: 'failed'});
              }
            });
        }
        else{
          res.send({query: 'failed'});
        }
      });
    })
    .get(function(req, res){

      mongoInterface.updateKey({api_key: req.param('api_key')}, function(result){

        if(result){
          console.log('key updated');
          mongoInterface.getUsers({}, function(result){

            if(result){
              res.send({query: result});
            }
            else{
              res.send({query: 'failed'});
            }
          });
        }
        else{
          res.send({query: 'failed'});
        }
      });
    });
  router.route('/api/v2/users/:user_id')
    .get(function(req, res){

      mongoInterface.updateKey({api_key: req.param('api_key')}, function(result){

        if(result){
          console.log('key updated');
          mongoInterface.getUser({user_id: req.params.user_id}, function(result){

            if(result){
              res.send({query: result});
            }
            else{
              res.send({query: 'failed'});
            }
          });
        }
        else{
          res.send({query: 'failed'});
        }
      });
    })
    .put(function(req, res){

      //TODO update specific user with user_id
    })
    .delete(function(req, res){

      //TODO delete specific user by user_id
    });
  //Tasks
  router.route('/api/v2/tasks/user_id')
    .post(function(req, res){

      //TODO insert a new task for user
    })
    .get(function(req, res){

      //TODO get list of all tasks for a user
    });
  router.route('/api/v2/tasks/:task_id')
    .get(function(req, res){

      //TODO get specific task
    })
    .put(function(req, res){

      //TODO update a specific taks
    })
    .delete(function(req, res){

      //TODO delete a specific task
    });
  //Orders
  router.route('/api/v2/orders')
    .post(function(req, res){

      //TODO insert a new order
    })
    .get(function(req, res){

      //TODO get list of all orders
    });
  router.route('/api/v2/orders/:order_id')
    .get(function(req, res){

      //TODO get specific information for an order
    })
    .put(function(req, res){

      //TODO update a specific order
    })
    .delete(function(req, res){

      //TODO delete a specific order
    });
  //Customers
  router.route('/api/v2/customers')
    .post(function(req, res){

      //TODO insert a new customer
    })
    .get(function(req, res){

      //TODO get list of all customers
    });
  router.route('/api/v2/customers/:customer_id')
    .get(function(req, res){

      //TODO get specific information for a customer
    })
    .put(function(req, res){

      //TODO update a specific customer
    })
    .delete(function(req, res){

      //TODO delete a specific customer
    });
  //Properties
  router.route('/api/v2/properties')
    .post(function(req, res){

      //TODO insert a new property
    })
    .get(function(req, res){

      //TODO get list of all properties
    });
  router.route('/api/v2/properties/:property_id')
    .get(function(req, res){

      //TODO get specific property
    })
    .put(function(req, res){

      //TODO update a specific property
    })
    .delete(function(req, res){

      //TODO delete a specific property
    });
  //Clients
  router.route('/api/v2/clients')
    .post(function(req, res){

      //TODO insert a new client
    })
    .get(function(req, res){

      //TODO get list of all clients
    });
  router.route('/api/v2/clients/:client_id')
    .get(function(req, res){

      //TODO get specific client
    })
    .put(function(req, res){

      //TODO update a specific client
    })
    .delete(function(req, res){

      //TODO delete a specific client
    });
  //Addresses
  router.route('/api/v2/addresses')
    .post(function(req, res){

      mongoInterface.updateKey({api_key: req.param('api_key')}, function(result){

        if(result){
          console.log('key updated');
          mongoInterface.createAddress(
            {
              address_line_1: req.param('address_line_1'),
              address_line_2: req.param('address_line_2'),
              city: req.param('city'),
              state: req.param('state'),
              zip: req.param('zip'),
              county: req.param('county'),
              lat: req.param('lat'),
              long: req.param('long')
            }, function(result){

            if(result){
              res.send({query: result});
            }
            else{
              res.send({query: 'failed'});
            }
          });
        }
        else{
          res.send({query: 'failed'});
        }
      });
    })
    .get(function(req, res){

      mongoInterface.updateKey({api_key: req.param('api_key')}, function(result){

        if(result){
          console.log('key updated');
          mongoInterface.getAddresses({}, function(result){

            if(result){
              res.send({query: result});
            }
            else{
              res.send({query: 'failed'});
            }
          });
        }
        else{
          res.send({query: 'failed'});
        }
      });
    });
  router.route('/api/v2/addresses/:address_id')
    .get(function(req, res){

      //TODO get specific address
      mongoInterface.updateKey({api_key: req.param('api_key')}, function(result){

        if(result){
          console.log('key updated');
          mongoInterface.getAddress({address_id: req.params.address_id}, function(result){

            if(result){
              res.send({query: result});
            }
            else{
              res.send({query: 'failed'});
            }
          });
        }
        else{
          res.send({query: 'failed'});
        }
      });
    })
    .put(function(req, res){

      //TODO update a specific address
    })
    .delete(function(req, res){

      //TODO delete a specific address
    });
  
  return router;
}