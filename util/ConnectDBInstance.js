/*******************************************************************************************************/
/************************************ConnectDBInstance.js *********************************/
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


//var prepareConnectionString = 'mongodb://' + user +':'+password+'@'+url+':'+port+'/'+ts;
var prepareConnectionString = 'mongodb://'+url+':'+port+'/'+ts;



var conn = (function (){

	var instance;

	var options = {
		  db: { native_parser: true },
		  server: { poolSize: 5,
		  			socketOptions:  { keepAlive: 1 }
		  	 	},
		  user: user,
		  pass: password
		};
	
	function createInstance(){
		
		log.info('ConnectDBInstance: Connection Starts');
		try{

			//return mongoose.connect(prepareConnectionString);
			var connectionOfDB = mongoose.createConnection(prepareConnectionString, options);


			connectionOfDB.on('connected', function successfulConnectionCb(){

				log.info('Successful Connection');


			});


			connectionOfDB.on('error', function errorConnectionCb(){

				log.info('Error in Connection');


			});


			connectionOfDB.on('disconnected', function disconnectedConnectionCb(){

				log.info('Disconnected Connection');


			});

			process.on('SIGINT', function sigintConnectionCloseCb(){

				log.info(' Server Termination');
				mongoose.connection.close(function connectionCloseCb () {
					log.info('Disconnected through Server Termination');
					process.exit(0);
				});


			});




			return connectionOfDB;

		}
		catch(err){

			throw new PAExpection('ConncetionDBInstance' , 'Exception in Connceting MongoDB');

		}
		

	}

	 return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            //log.info('ConnectDBInstance: Connection Class Ends');
            return instance;
        }

       
    };
	

	




})();


module.exports = conn;


