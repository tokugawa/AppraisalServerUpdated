/*******************************************************************************************************/
/************************************APIKeyVO.js is Resource Load Class.*********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Brandon Rodenmayer       Date: March, 2015         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/



var log4js = require('log4js');
var log = log4js.getLogger("APIKeyVO");
var paException = require('../util/PAException');


/*var conn = require('../util/ConnectDBInstance').getInstance();*/
var uuid = require('node-uuid');
var apiKeys = require('../model/ApiKeys.js');


var APIKeysVO = (function(){

	var instance;
	function createInstance() {

		this.addKey = function (userId, cb){

			log.info(' Class:APIKeysVO Method:addKey starts');
			var newApiKeys = new apiKeys();
		
			newApiKeys.user_id		  		= userId;
			newApiKeys.api_key				= generateApiKey();
			newApiKeys.expiration			= generateExpiration();

			log.info('user_id ' , userId);
			log.info('user api_key' , newApiKeys.api_key);
			log.info('user api_key expiration' , newApiKeys.expiration);
			console.log('addKey started');
			apiKeys.findOne({user_id: userId }, function findOneCb(err, data){
				if(err){
					log.error(err);
					cb(null);
				}
				if(data){

					log.error('Class:APIKeysVO - Error Message: API Key already exists for user');
					//console.log(data.expiration);
					if(data.expiration < (new Date())){

						apiKeys.update(
								{user_id: newApiKeys.user_id},
								{api_key: newApiKeys.api_key, expiration: newApiKeys.expiration}
						)
						.exec(function(err, item){
							if(err) {
								log.error(err);
								throw new paException('APIKeysVO', 'Save APIKeys Exception');
								cb(null);
							}
							else {

								log.info('Class:APIKeysVO - Info: Successful');
								cb(newApiKeys.api_key);
							}
						});
					}
					else{
						cb(false);
					}
				}

				if(!data){
					log.info(' Class:APIKeysVO - Info:No duplicate record found');
					newApiKeys.save(function saveAPIKeyCb(err, doc){
						if(err) {
							log.error(err);
							throw new paException('APIKeysVO', 'Save APIKeys Exception');
							cb(null);
						}
						else {

							log.info('Class:APIKeysVO - Info: Successful');
							cb(newApiKeys.api_key);
						}
					});
				}
			});
		};

		this.updateKey = function(apiKey, cb){

			console.log('APIKeysVO find and updateKey start');
			
			apiKeys.update(
				{api_key: apiKey},//query
				{$set:{expiration: generateExpiration()}}//update
			)
			.exec(function(err, item){

				if(item){
					//console.log(item);
					cb(item);
				}
				else{
					//console.log('findAndModify FAILED');
					cb(null);
				}
			});
		}

		this.destroyKey = function(userId, cb){

			apiKeys.remove({user_id: userId})
			.exec(function(err, item){
				if(item){
					console.log(item.api_key);
					cb(item);
				}
				else{
					cb(null);
				}
			});
		}
	};

	return {
        getInstance: function () {

            if (!instance) {
                log.warn('Creating first instance of APIKeysVO');
                instance = new createInstance();
            }
            //log.debug('sending object = ' + instance);
            return instance;
        },
        apiKeys: apiKeys
    };

})();

function generateApiKey(){
    
    return uuid.v4();
}
function generateExpiration(){

	var KEY_TIME_LIMIT = 1000*60*60; // In milliseconds
	var currentDate = new Date();
	//console.log(currentDate);
	var expirationDate = new Date(currentDate.getTime() + KEY_TIME_LIMIT);
	//console.log(expirationDate);


	return expirationDate;
}

module.exports = APIKeysVO;