/*******************************************************************************************************/
/************************************OrderIDVO.js is Resource Load Class.*********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Somenath Ghosh       Date: Sep, 2014         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/



var log4js = require('log4js');
var log = log4js.getLogger("OrderIDVO");
var paException = require('../util/PAException');


/*var conn = require('../util/ConnectDBInstance').getInstance();*/
var orderIDGenerator = require('../model/OrderIDGenerator.js');


var OrderIDVO = (function(){

	var instance;
	function createInstance() {
		this.getNextOrderID = function(cb){
			orderIDGenerator.find({}, function foundOrderIDCb(err, data){

				if(err){

					log.error('Class:OrderIDVO method:getNextOrderID message: System Error in getting document');
					cb(null,null);
				}
				if(!data){
					log.error('Class:OrderIDVO method:getNextOrderID message: No Documentment Found Error in getting document');
					cb(false, null);
				}
				if(data){

					cb(true, data.orderID);
				}

			});

		}

	};



	return {
        getInstance: function () {

            if (!instance) {
                log.info('Creating first instance of OrderIDVO');
                instance = new createInstance();
            }
            //log.debug('sending object = ' + instance);
            return instance;
        }
    };



})();