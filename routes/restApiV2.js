/*******************************************************************************************************/
/*********************************restApiV2.js is the REST server routes.*******************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Brandon Rodenmayer       Date: March, 2015         Desc: Initial Built
/*******************************************************************************************************/

var express = require('express');
var router = express.Router();
var mongoInterface = require('./MongoInterface.js').getInstance();
var ucdpValidator = require('../util/UCDPValidator.js').getInstance();
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
  router.route('/api/v2/tasks/:user_id')
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

      //TODO
      mongoInterface.updateKey({api_key: req.param('api_key')}, function(result){

        if(result){
          console.log('key updated');
          mongoInterface.createOrder(
            {
              property_primary_holder: req.param('property_primary_holder'),
              property_id: req.param('property_id'),
              //address_id: req.param('address_id'),
              client: req.param('client'),
              due_date: req.param('due_date'),
              priority_index: req.param('priority_index')
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
          mongoInterface.getOrders({}, function(result){

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
  router.route('/api/v2/orders/:order_id')
    .get(function(req, res){

      mongoInterface.updateKey({api_key: req.param('api_key')}, function(result){

        if(result){
          console.log('key updated');
          mongoInterface.getOrder({order_id: req.params.order_id}, function(result){

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

      //TODO update a specific order
      mongoInterface.updateKey({api_key: req.param('api_key')}, function(result){

        if(result){
          console.log('key updated');
          mongoInterface.updateOrder(
            {
              order_id: req.params.order_id, 
              property_id: req.param('property_id'),
              //address_id: req.param('address_id'),
              client: req.param('client'),
              received_date: req.param('received_date'),
              completed_date:req.param('completed_date'),
              due_date: req.param('due_date'),
              priority_index: req.param('priority_index'),
              image_id: req.param('image_id'),
              evaluation_id: req.param('evaliation_id'),
              progress_status: req.param('progress_status'),
              order_assigned_to: req.param('order_assigned_to'),
              status_current: req.param('status_current'),
              status_past: req.param('status_past'),
              status_next: req.param('status_next')
            }, 
            function(result){

              if(result){
                res.send({query: result});
              }
              else{
                res.send({query: 'failed'});
              }
            }
          );
        }
        else{
          res.send({query: 'failed'});
        }
      });
    })
    .delete(function(req, res){

      //TODO delete a specific order
    });
  //Customers
  router.route('/api/v2/customers')
    .post(function(req, res){

      mongoInterface.updateKey({api_key: req.param('api_key')}, function(result){

        if(result){
          console.log('key updated');
          mongoInterface.createCustomer(
            {
              first_name: req.param('first_name'),
              last_name: req.param('last_name'),
              address_id: req.param('address_id'),
              primary_phone: req.param('primary_phone'),
              work_phone: req.param('work_phone'),
              cell_phone: req.param('cell_phone'),
              email: req.param('email')

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
          mongoInterface.getCustomers({}, function(result){

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
  router.route('/api/v2/customers/:customer_id')
    .get(function(req, res){

      mongoInterface.updateKey({api_key: req.param('api_key')}, function(result){

        if(result){
          console.log('key updated');
          mongoInterface.getCustomer({customer_id: req.params.customer_id}, function(result){

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

      //TODO update a specific customer
    })
    .delete(function(req, res){

      //TODO delete a specific customer
    });
  //Properties
  router.route('/api/v2/properties')
    .post(function(req, res){

      //console.log(req.body);
      mongoInterface.updateKey({api_key: req.param('api_key')}, function(result){

        if(result){
          console.log('key updated');
          mongoInterface.createProperty(
            {
              primary_holder_first_name: req.param('primary_holder_first_name'),
              primary_holder_last_name: req.param('primary_holder_last_name'),
              property_holders: req.param('property_holders[]'),
              address_id: req.param('address_id')

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
          mongoInterface.getProperties({}, function(result){

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
  router.route('/api/v2/properties/:property_id')
    .get(function(req, res){

      mongoInterface.updateKey({api_key: req.param('api_key')}, function(result){

        if(result){
          console.log('key updated');
          mongoInterface.getProperty({property_id: req.params.property_id}, function(result){

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

      //TODO update a specific property
    })
    .delete(function(req, res){

      //TODO delete a specific property
    });
  //Clients
  router.route('/api/v2/clients')
    .post(function(req, res){

      mongoInterface.updateKey({api_key: req.param('api_key')}, function(result){

        if(result){
          console.log('key updated');
          mongoInterface.createClient(
            {
              name: req.param('name'),
              address_id: req.param('address_id'),
              phone: req.param('phone'),
              email: req.param('email')

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
          mongoInterface.getClients({}, function(result){

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
  router.route('/api/v2/clients/:client_id')
    .get(function(req, res){

      mongoInterface.updateKey({api_key: req.param('api_key')}, function(result){

        if(result){
          console.log('key updated');
          mongoInterface.getClient({client_id: req.params.client_id}, function(result){

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
  
  router.route('/api/v2/xml')
    .post(function(req, res){

      //TODO
      mongoInterface.updateKey({api_key: req.param('api_key')}, function(result){

        if(result){
          console.log('key updated');
          ucdpValidator.validateForm(req.param('formXML'), function(result){

            if(result){
              res.send({query: 'form valid'})
            }
            else{
              res.send({query: 'invalid form'})
            }
          });
        }
        else{
          res.send({query: 'failed'});
        }
      });
    });

  return router;
}