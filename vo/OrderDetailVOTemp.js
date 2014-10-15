/*******************************************************************************************************/
/************************************OrderDetailVOTemp.js is Resource Load Class.*********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Somenath Ghosh       Date: Sep, 2014         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/



var log4js = require('log4js');
var log = log4js.getLogger("OrderDetailVOTemp");
var paException = require('../util/PAException');


/*var conn = require('../util/ConnectDBInstance').getInstance();*/
var Order = require('../model/OrderModelTemp.js');


var OrderDetailVOTemp = (function(){

	var instance;
	function createInstance() {

		this.getOrderDetail = function(orderPartyID, orderStatus, cb){
			Order.find({orderStatus: orderStatus}, function returnCb(err, data){

				if(err) { 
					log.error('Mongoose Error Occured');
					log.error(err);
					cb(new Error('Mongoose Error'));
				}

				if(!data){
					console.log('No Data');

					cb(null, false);
				}

				if(data){

					//console.log(data);
					if(data.length === 0){

						cb(null, false);

					}
					else{
						cb(null, data);

					}
					
				}


			});



		}



	
	}

	return {
        getInstance: function () {

            if (!instance) {
                log.warn('Creating first instance of OrderDetailVOTemp');
                instance = new createInstance();
            }
           
            return instance;
        }
    };

	

})();

module.exports = OrderDetailVOTemp;
