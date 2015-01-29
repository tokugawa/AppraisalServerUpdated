/*******************************************************************************************************/
/************************************RadisClient.js *********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Somenath Ghosh       Date: Sep, 2014         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/
var resourceLoader = require('./ResourceLoader').getInstance();
var redis = require('redis');
var log4js = require('log4js');
var log = log4js.getLogger("RadisClient");


//



var user = resourceLoader.getResourceById('RADIS' , 'USER_NAME');
var password = resourceLoader.getResourceById('RADIS' , 'PASSWORD');
var host = resourceLoader.getResourceById('RADIS' , 'HOST');
var port = resourceLoader.getResourceById('RADIS' , 'PORT');


var conn = (function (){

	var instance;
	
	function createInstance(){
		
		log.info('RadisClient: Connection Starts');
		try{

			
			

			var client = redis.createClient(port,host);

			client.auth(password, function() {
			    console.log('Redis client connected');
			});


			

			return client;

		}
		catch(err){

			throw new Error('RadisClient' , 'Unable to Connect');

		}
		

	}

	 return {
        getInstance: function () {
            if (!instance) {
            	log.warn(' Creating new instance');
                instance = createInstance();
            }
            
            return instance;
        }

       
    };
	

	




})();


module.exports = conn;