var express = require('express');
var router = express.Router();
///////////////////////////////////////////////////////////////////////////

module.exports = function(passport){

  //Generate temporary API Key
  router.route('/authenticate')
    .post(function(req, res){

      //TODO validate username and password and generate a temporary API Key
      //res.send({api_key: api_key});
    });

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
  
  return router;
}