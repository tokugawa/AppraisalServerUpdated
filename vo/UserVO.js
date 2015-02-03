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


/*var conn = require('../util/ConnectDBInstance').getInstance();*/
var user = require('../model/User.js');



var UserVO = (function(){

	var instance;
	function createInstance() {

		this.createNewUser = function (userName, password, firstName, lastName, user_address, isUserActive, cb  ){

			log.info(' Class:UserVO Method:createNewUser starts');
			var newUser = new user();
			var passwordHashed = newUser.generateHash(password);

		
			newUser.user_id		  		= userName;
			//newUser.user_id_id		= newUser.generateID();
			newUser.password 		= passwordHashed ;
			newUser.firstName		= firstName;
			newUser.lastName 		= lastName;
			newUser.user_address 	= user_address;
			newUser.isUserActive	= isUserActive;
			newUser.order_list 		= new Array();

			log.info('user_id ' , userName);
			log.info(' user user_address' , user_address);
			user.findOne({user_id: userName }, function findOneCb(err, data){
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

		this.getAllUsers = function(cb){

			//console.log('\nStarting to get all users');
			var dataArray = [];

			user.find({}, function(err, cursor){

				if(cursor){
					cursor.forEach(function(item){
						//console.log(item);
						if(item){
							item.populate('active_order_list');
							dataArray.push(item);
						}
						else{
							//console.log('No Data');
						}
					});
					cb(dataArray);
				}
				else{
					//console.log(err);
					cb(null)
				}
			});
		}

		this.validateUser = function(userName , password, cb){
			
			var validationResult = false;
			//log.info(conn);

			log.info(' UseVO: validateUser Starts')

			user.findOne({user_id: userName }, function findOneCb(err, data){
				//log.info('in Call back');
				if (err){
					log.error(err);
					throw new paException('UserVO', 'Get User Exception for id = ' + userName);
					cb(null, null);

				}

				if(data){
					//var userObj = new user();
					log.info(data._id);
					if(data.validatePassword(password)){
						//log.info('validated');
						cb(true, {id:data._id, firstName: data.firstName, lastName:data.lastName} );
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

		this.validateUserWithRole = function(username, role, password, cb){

			var validationResult = false;
			//log.info(conn);

			log.info(' UseVO: validateUserAndRole Starts')

			user.findOne({user_id: username, role: role }, function findOneCb(err, data){
				//log.info('in Call back');
				if (err){
					log.error(err);
					throw new paException('UserVO', 'Get User Exception for id = ' + username);
					cb(null);

				}

				if(data){
					console.log(data);
					//var userObj = new user();
					log.info(data._id);
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
                log.warn('Creating first instance of UserVO');
                instance = new createInstance();
            }
            //log.debug('sending object = ' + instance);
            return instance;
        },
        user: user
    };

	

})();

module.exports = UserVO;



