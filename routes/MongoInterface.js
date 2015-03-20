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
				});
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
