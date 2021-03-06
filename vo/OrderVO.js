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
var order = require('../model/Order.js');

var OrderVO = (function(){

	var instance;
	function createInstance() {

		//TODO CREATE ORDER
		this.createNewOrder = function(propertyPrimaryHolder, propertyId, client, dueDate, priorityIndex, cb){

			var newOrder = new order();

		 	newOrder.generateOrderNumber(function(id){

				console.log('New Order ID: '+id);

				if(id > 0){
					newOrder.order_id = id;

					newOrder.order_property_primary_holder 	= propertyPrimaryHolder;
					newOrder.order_property_id 				= propertyId;
					//newOrder.order_address_id 				= addressId;
					newOrder.order_client 					= client;
					newOrder.order_received_date 			= (new Date());
					newOrder.order_completed_date 			= '';
					newOrder.order_due_date 				= dueDate;
					newOrder.order_priority_index 			= priorityIndex;
					newOrder.order_image					= null;
					newOrder.order_evaluation_detail 		= null;
					newOrder.order_progress_status 				= 'submitted';
					newOrder.order_assigned_to 				= {
																order_current_appraiser: null,
																order_previous_appraiser: []
															};
					newOrder.order_status_current			= 'created';
					newOrder.order_status_past 				= [];
					newOrder.order_status_next 				= 'assigned';

					log.info('order_id ' , newOrder.order_id);
					order.findOne({ order_id: newOrder.order_id }, function findOneCb(err, data){
						if(err){
							log.error(err);
							cb(null);
						}
						if(data){

							log.error('Class:OrderVO - Error Message: OrderId already taken');
							cb(false);
						}

						if(!data){
							log.info(' Class:OrderVO - Info: No duplicate record found');
							newOrder.save(function saveOrderCb(err, doc){
								if(err) {
									log.error(err);
									throw new paException('OrderVO', 'Save Order Exception');
									cb(null);
								}
								else {

									log.info('Class:OrderVO - Info: Successful');
									cb(doc);
								}
							});
						}
					});
				}
				else{
					cb(null)
				}
			});
		}

		this.updateOrder = function(orderId, propertyId, clientId, receivedDate, completedDate, dueDate, priorityIndex, imageId, evaluationId, progressStatus, orderAssignedTo, statusCurrent, statusPast, statusNext, cb){

			//TODO take in parameters and update an order based on the parameters
			var updateJson = {};

			if(propertyId == null){

				updateJson.order_property_id = propertyId;
			}
			if(clientId == null){

				updateJson.order_client = clientId;
			}
			if(receivedDate == null){

				updateJson.order_received_date = receivedDate;
			}
			if(completedDate == null){

				updateJson.order_completed_date = completedDate;
			}
			if(dueDate == null){

				updateJson.order_due_date = dueDate;
			}
			if(priorityIndex == null){

				updateJson.order_priority_index = priorityIndex;
			}
			if(imageId == null){

				updateJson.order_image = imageId;
			}
			if(evaluationId == null){

				updateJson.order_evaluation_detail = evaluationId;
			}
			if(progressStatus == null){

				updateJson.order_progress_status = progressStatus;
			}
			if(orderAssignedTo == null){

				updateJson.order_assigned_to = orderAssignedTo;
			}
			if(statusCurrent == null){

				updateJson.order_status_current = statusCurrent;
			}
			if(statusPast == null){

				updateJson.order_status_past = statusPast;
			}
			if(statusNext == null){

				updateJson.order_status_next = statusNext;
			}

			order.update(
				{order_id: orderId},
				updateJson
			)
			.exec(function(err, item){
				if(err) {
					log.error(err);
					throw new paException('OrderVO', 'Update Order Exception');
					cb(null);
				}
				else {

					log.info('Class:OrderVO - Info: Successful');
					cb(item);
				}
			});
		}

		this.getOrderDetail = function(orderPartyID, orderStatus, cb){
			order.find({orderStatus: orderStatus}, function returnCb(err, data){

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

			order.find({}, function(err, cursor){

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

			order.find({}, function(err, cursor){

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

			order.find({"appraiser_id" : userId }, function(err, cursor){

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

			//console.log(orderId);
			order.findOne({'order_id': orderId})
			//.populate('address_id')
			.exec(function(err, item){

				if(item){
					//console.log(item);
					cb(item);
				}
				else{
					//console.log('Not Found');
					cb(null);
				}
			});
		}

		this.deleteOrder = function(orderId, cb){

			order.remove({order_id: orderId})
			.exec(function(err, item){

				if(item){
					//console.log(item);
					cb(item);
				}
				else{
					//console.log('Not Found');
					cb(null);
				}
			});
		}
	}

	return {
        getInstance: function () {

            if (!instance) {
                log.warn('Creating first instance of OrderVO');
                instance = new createInstance();
            }
           
            return instance;
        }
    };
})();

module.exports = OrderVO;
