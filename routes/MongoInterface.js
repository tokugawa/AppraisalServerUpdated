/*******************************************************************************************************/
/************************************MongoInterface.js is Resource Load Class.*********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Brandon Rodenmayer       Date: March, 2015         Desc: Initial Built
/*******************************************************************************************************/

/****** Import Libs *******/
var log4js = require('log4js');
var log = log4js.getLogger("MongoInterface");
var paException = require('../util/PAException');

/*var conn = require('../util/ConnectDBInstance').getInstance();*/
var User = require('../vo/UserVO').getInstance();
var Order = require('../vo/OrderVO').getInstance();
var Address = require('../vo/AddressVO').getInstance();
var APIKeys = require('../vo/APIKeysVO').getInstance();
var Client = require('../vo/ClientVO').getInstance();
var Customer = require('../vo/CustomerVO').getInstance();
var Property = require('../vo/PropertyVO').getInstance();
var ImageUrl = require('../vo/ImageUrlVO').getInstance();
var FormData = require('../vo/FormDataVO').getInstance();

var mongoInterface = (function(){

	var instance;
	function createInstance() {

		//Generate an API Key for the user and password pair
		this.authenticateUser = function(options, cb){

			console.log('About to validateUser in mongoInterface');
			console.log(options.api_key);
			//if(options.password && options.user_id){
			User.validateUser(options.user_id, options.password, function(result){

				console.log('mongoInterface validateUser');
				if(result){
					APIKeys.addKey(options.user_id, function(keyResult){

						if(keyResult){
							//console.log(keyResult);
							cb(keyResult);
						}
						else{
							cb(null);
						}
					});
				}
				else{
					cb(null);
				}
			});
		}

		//Update the expiration date of the API Key in the database
		this.updateKey = function(options, cb){

			console.log('About to valiadate and updateKey in mongoInterface');
			
			APIKeys.updateKey(options.api_key, function(result){

				console.log('mongoInterface updateKey with validation');
				if(result){
					//console.log(result);
					cb(result);
				}
				else{
					cb(null);
				}
			});
		}

		//Remove the user with API key from the database
		this.destroyApiKey = function(options, cb){

			APIKeys.destroyKey(options.user_id, function(result){

				console.log('mongoInterface destroyApiKey');
					if(result){
						//console.log(result);
						cb(result);
					}
					else{
						cb(null);
					}
			});
		}

		//Get a list of all users
		this.getUsers = function(options, cb){

			User.getAllUsers(function(result){
		      if(result){
		        cb(result);
		      }
		      else{
		       	cb(null);
		      }
		    });
		}

		//Get a single user
		this.getUser = function(options, cb){

			User.getUserWithOrders(options.user_id, function(result){
				if(result){
					cb(result);
			    }
		      	else{
		       		cb(null);
		      	}
			});
		}

		//Create a new user
		this.createUser = function(options, cb){

			User.createNewUser(options.email, options.password, options.first_name, options.last_name, options.adress_id, options.user_active, options.role, function(result){
				if(result){
					cb(result);
			    }
		      	else{
		       		cb(null);
		      	}
			});
		}

		//Get all addresses
		this.getAddresses = function(options, cb){

			Address.getAllAddresses(function(result){

				if(result){
					cb(result);
			    }
		      	else{
		       		cb(null);
		      	}
			});
		}

		//Create a new address
		this.createAddress = function(options, cb){

			Address.createNewAddress(options.address_line_1, options.address_line_2, options.city, options.state, 
				options.zip, options.county, options.lat, options.long, '', '', '',
				function(result){

					if(result){
						cb(result);
				    }
			      	else{
			       		cb(null);
			      	}
				}
			);
		}

		//Get a single address
		this.getAddress = function(options, cb){

			Address.getAddress(options.address_id, function(result){

				if(result){
					cb(result);
			    }
		      	else{
		       		cb(null);
		      	}
			});
		}

		//Get all clients
		this.getClients = function(options, cb){

			Client.getAllClients(function(result){

				if(result){
					cb(result);
			    }
		      	else{
		       		cb(null);
		      	}
			});
		}

		//Create a client
		this.createClient = function(options, cb){

			console.log(options);
			Client.createNewClient(options.name, options.address_id, options.phone, options.email,
				function(result){

					if(result){
						cb(result);
				    }
			      	else{
			       		cb(null);
			      	}
				});
		}

		//Get a single client
		this.getClient = function(options, cb){

			Client.getClient(options.client_id, function(result){

				if(result){
					cb(result);
			    }
		      	else{
		       		cb(null);
		      	}
			});
		}

		//Get all customers
		this.getCustomers = function(options, cb){

			//TODO Test
			Customer.getAllCustomers(function(result){

				if(result){
					cb(result);
			    }
		      	else{
		       		cb(null);
		      	}
			});
		}

		//Create a customer
		this.createCustomer = function(options, cb){

			//TODO TEST
			console.log(options);
			Customer.createNewCustomer(options.first_name, options.last_name, options.address_id, options.primary_phone, options.cell_phone, options.work_phone, options.email,
				function(result){

					if(result){
						cb(result);
				    }
			      	else{
			       		cb(null);
			      	}
				}
			);
		}

		//Get a single customer
		this.getCustomer = function(options, cb){

			//TODO TEST
			Customer.getCustomer(options.customer_id, function(result){

				if(result){
					cb(result);
			    }
		      	else{
		       		cb(null);
		      	}
			});
		}

		//Get all properties
		this.getProperties = function(options, cb){

			Property.getAllProperties(function(result){

				if(result){
					cb(result);
			    }
		      	else{
		       		cb(null);
		      	}
			});
		}

		//Create a property
		this.createProperty = function(options, cb){

			console.log(options);
			Property.createNewProperty(options.primary_holder_first_name, options.primary_holder_last_name, options.property_holders, options.address_id,
				function(result){

					if(result){
						cb(result);
				    }
			      	else{
			       		cb(null);
			      	}
				});
		}

		//Get a single property
		this.getProperty = function(options, cb){

			Property.getProperty(options.property_id, function(result){

				if(result){
					cb(result);
			    }
		      	else{
		       		cb(null);
		      	}
			});
		}

		//Get all orders
		this.getOrders = function(options, cb){

			Order.getAllOrders(function(result){

				if(result){
					cb(result);
			    }
		      	else{
		       		cb(null);
		      	}
			});
		}

		//Create an order
		this.createOrder = function(options, cb){

			console.log(options); //TODO CREATE ORDER
			Order.createNewOrder(options.property_primary_holder, options.property_id, options.address_id, options.client, 
				options.due_date, options.priority_index,
				function(result){

					if(result){
						cb(result);
				    }
			      	else{
			       		cb(null);
			      	}
				}
			);
			//TODO Create Form Data
			//TODO Create Image URL
		}

		//Get a single order
		this.getOrder = function(options, cb){

			Order.getOrderById(options.order_id, function(result){

				if(result){
					cb(result);
			    }
		      	else{
		       		cb(null);
		      	}
			});
		}
	}

	return {
        getInstance: function () {

            if (!instance) {
                log.warn('Creating first instance of mongoInterface');
                instance = new createInstance();
            }
           
            return instance;
        }
    };
})();

module.exports = mongoInterface;
