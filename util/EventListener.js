/*******************************************************************************************************/
/************************************EventListener.js is Resource Load Class.*********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Somenath Ghosh       Date: Sep, 2014         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/

var events = require("events");
var EventEmitter = require("events").EventEmitter;
var resourceLoader = require('./ResourceLoader').getInstance();

var log4js = require('log4js');
var log = log4js.getLogger("EventListener");


//



var SolitrayListener = (function (){
	var ee = new EventEmitter();
	var instance ;

	try {
		ee.setMaxListeners(resourceLoader.getResourceById('ENV_VAR' , 'MAX_LISTENERS'));

	}
	catch(error){
		log.error(' EventListener: Resource Loader exception', error );
		
	}



	var createInstance = function(){

		
		ee.on('ConnectionError', function eventListenerCb(){

			log.debug('Caught ', 'ConnectionError');


		});

		ee.on('Connected', function eventListenerCb(){

			log.debug('Caught ', 'Connected');


		});
		

		this.emitter = function(event){

			ee.emit(event);

		};


	}



	return {
        getInstance: function () {
            if (!instance ) {
                instance = new createInstance();
            }
            //log.info('Connection Class Ends');
            return instance;
        }

       
    };


})();

module.exports = SolitrayListener;



