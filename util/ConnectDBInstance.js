/*******************************************************************************************************/
/************************************Place Holder*********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Somenath Ghosh       Date: Sep, 2014         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/
var resourceLoader = require('./ResourceLoader').getInstance();
var mongoose = require('mongoose');
var log4js = require('log4js');
var log = log4js.getLogger("ConnectDBInstance");
var PAExpection = require('./PAException');
//


//log.debug(resourceLoader);

var user = resourceLoader.getResourceById('DB' , 'DB_USER_NAME');
var password = resourceLoader.getResourceById('DB' , 'DB_PASSWORD');
var url = resourceLoader.getResourceById('DB' , 'DB_CONNECTION_URL');
var port = resourceLoader.getResourceById('DB' , 'DB_CONNECTION_PORT');
var ts = resourceLoader.getResourceById('DB' , 'DB_DATABASE_SCHEMA');


var prepareConnectionString = 'mongodb://' + user +':'+password+'@'+url+':'+port+'/'+ts;



var conn = (function (){

	var instance = undefined;
	function createInstance(){
		
		log.info('Connection Starts');
		try{

			return mongoose.connect(prepareConnectionString); 
		}
		catch(err){

			throw new PAExpection('ConncetionDBInstance' , 'Exception in Connceting MongoDB');

		}
		finally{


		}

	}

	 return {
        getInstance: function () {
            if (instance === undefined) {
                instance = createInstance();
            }
            log.info('Connection Class Ends');
            return instance;
        }

       
    };
	

	




})();


module.exports = conn;



