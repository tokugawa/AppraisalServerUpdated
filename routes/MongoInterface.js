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

		this.authenticateUser = function(options, cb){

			console.log('About to validateUser in mongoInterface');
			//if(options.password && options.user_id){
			if(true){

				User.validateUser(options.user_id, options.password, function(result){

					console.log('mongoInterface validateUser');
					if(result){
						APIKeys.addKey(options.user_id, function(keyResult){

							if(keyResult){
								console.log(keyResult);
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
			else if(options.api_key && options.user_id){

				APIKeys.updateKey(options.user_id, options.api_key, function(result){

					console.log('mongoInterface updateKey with validation');
					if(result){
						console.log(result);
						cb(result);
					}
					else{
						cb(null);
					}
				});
			}
			else{
				cb(null);
			}
		}

		this.getUsers = function(options, cb){

			//TODO return a list of users
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
