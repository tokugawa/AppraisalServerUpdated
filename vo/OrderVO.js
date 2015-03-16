/*******************************************************************************************************/
/************************************OrderDetailVOTemp.js is Resource Load Class.*********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Somenath Ghosh       Date: Sep, 2014         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/
var log4js = require('log4js');
var log = log4js.getLogger("OrderVO");
var paException = require('../util/PAException');


/*var conn = require('../util/ConnectDBInstance').getInstance();*/
var Order = require('../model/Order.js');


var OrderVO = (function(){

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

		this.getAllOrders = function(cb){

			//console.log('\nStarting to get all users');
			var dataArray = [];

			Order.find({}, function(err, cursor){

				if(cursor){
					cursor.forEach(function(item){
						//console.log(item);
						if(item){
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

		this.getCompletedPendingActiveOrderCount = function(cb){

			var dataArray = [
				{'label':'Active Orders', 'value': 0},
				{'label':'Pending Orders', 'value': 0},
				{'label':'Completed Orders', 'value': 0},
			];

			Order.find({}, function(err, cursor){

				if(cursor){
					cursor.forEach(function(item){
						//console.log(item);
						if(item){
							if(item.order_status_current.toLowerCase() == 'active'){
								dataArray[0].value++;
							}
							if(item.order_status_current.toLowerCase() == 'pending'){
								dataArray[1].value++;
							}
							if(item.order_status_current.toLowerCase() == 'completed'){
								dataArray[2].value++;
							}
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
		
		this.getOrdersForUser = function(userId, cb){

			var dataArray = [];
			//TODO send three arrays: All Orders, Completed Orders, Open Orders
			//var completedOrders = [];
			//var openOrders = [];

			Order.find({"appraiser_id" : userId }, function(err, cursor){

				if(cursor){
					cursor.forEach(function(item){
						//console.log(item);
						if(item){
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

		this.getOrderById = function(orderId, cb){

			console.log(orderId);
			Order.findOne({ "order_id" : orderId })
			//.populate('address_id')
			.exec(function(err, item){

				if(item){
					//console.log(item);
					cb(item);
				}
				else{
					//console.log(err);
					cb(null);
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

module.exports = OrderVO;
