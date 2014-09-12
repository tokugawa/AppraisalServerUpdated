/*******************************************************************************************************/
/************************************UserVO.js is Resource Load Class.*********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Somenath Ghosh       Date: Sep, 2014         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/



var log4js = require('log4js');
var log = log4js.getLogger("UserVO");
var paException = require('../util/PAException');

var conn = require('../util/ConnectDBInstance').getInstance();
var user = require('../model/User.js');



var UserVO = (function(){

	var instance;
	function createInstance() {

		this.createNewUser = function (user_id, password, firstName, lastName, user_address, isUserActive, cb  ){

			var newUser = new user();
			var passwordHashed = newUser.generateHash('ghosh');
		
			newUser._id		  		= user_id;
			newUser.password 		= passwordHashed ;
			newUser.firstName		= firstName;
			newUser.lastName 		= lastName;
			newUser.user_address 	= user_address;
			newUser.isUserActive	= isUserActive;
			newUser.order_list 		= new Array();


			newUser.save(function saveUserCb(err, doc){
				if(err) {
					log.error(err);
					throw new paException('UserVO', 'Save User Exception');
					cb(false);

				}
				else {

					log.info('successful');
					cb(true);
				}


			});

		};

		this.validateUser = function(userName , password, cb){
			
			var validationResult = false;

			user.findOne({_id: userName }, function findOneCb(err, data){
				
				if (err){
					log.error(err);
					throw new paException('UserVO', 'Get User Exception for id = ' + userName);
					cb(null);

				}

				if(data){
					var userObj = new user();
					//log.info(data);
					if(data.validatePassword(password)){
						//log.info('validated');
						cb(true);
					}
					else{
						cb(false);
									
					}
				}
				if(!data){

					cb(false);
				}
			});


			


		}
	};

	return {
        getInstance: function () {

            if (!instance) {
                log.info('Creating first instance of UserVO');
                instance = new createInstance();
            }
            log.debug('sending object = ' + instance);
            return instance;
        }
    };

	

})();

module.exports = UserVO;



