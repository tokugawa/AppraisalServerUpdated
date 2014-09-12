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

		this.createNewUser = function (userName, password, firstName, lastName, user_address, isUserActive, cb  ){

			log.info(' Class:UserVO Method:createNewUser starts');
			var newUser = new user();
			var passwordHashed = newUser.generateHash(password);

		
			newUser._id		  		= userName;
			newUser.user_id_id		= newUser.generateID();
			newUser.password 		= passwordHashed ;
			newUser.firstName		= firstName;
			newUser.lastName 		= lastName;
			newUser.user_address 	= user_address;
			newUser.isUserActive	= isUserActive;
			newUser.order_list 		= new Array();

			log.info('user_id ' , userName);
			log.info(' user user_address' , user_address);
			user.findOne({_id: userName }, function findOneCb(err, data){
				if(err){
					log.error(err);
					cb(null);
				}
				if(data){

					log.error('Class:UserVO - Error Message: UserId already taken');
					cb(false);
				}

				if(!data){
					log.info(' Class:UserVO - Info:No duplicate record found');
					newUser.save(function saveUserCb(err, doc){
						if(err) {
							log.error(err);
							throw new paException('UserVO', 'Save User Exception');
							cb(null);

						}
						else {

							log.info('Class:UserVO - Info: Successful');
							cb(true);
						}


					});


				}


			});
			

		};




		this.validateUser = function(userName , password, cb){
			
			var validationResult = false;

			user.findOne({_id: userName }, function findOneCb(err, data){
				
				if (err){
					log.error(err);
					throw new paException('UserVO', 'Get User Exception for id = ' + userName);
					cb(null, null);

				}

				if(data){
					//var userObj = new user();
					log.info(data.user_id_id);
					if(data.validatePassword(password)){
						//log.info('validated');
						cb(true, data.user_id_id);
					}
					else{
						cb(false, null);
									
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



