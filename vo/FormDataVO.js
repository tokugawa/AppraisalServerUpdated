/*******************************************************************************************************/
/************************************FormDataVO.js is  Load Class.*********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Somenath Ghosh       Date: Sep, 2014         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/
var log4js = require('log4js');
var log = log4js.getLogger("FormDataVO");
var paException = require('../util/PAException');

var FormData = require('../model/FormData.js');
var Order = require('../model/OrderModelTemp.js');

var FormDataVO = (function(){

	var instance;
	function createInstance() {

		this.createNewFormData = function(orderId, cb){

			//TODO 
		}

		this.addOrUpdate = function (orderID, orderStatus, formData, cb  ){

			log.info(' Class:FormData Method:addOrUpdate starts');

			FormData.findOne({order_id : orderID}, function findOneCb(err, data){

				if(err){
					log.error(' Error occured while findOneCb addOrUpdate');
					log.error(err);
					cb(null);
				}

				if(!data){

					var newFormData = new FormData();
					newFormData.order_id = orderID;
					newFormData.formData = formData;
					//console.log(formData);
					newFormData.save(function saveCb(err, data){

						if(err){
							log.error(' Error occured while Saving');
							log.error(err);
							cb(null);
						}

						if(data){
							//console.log(orderStatus);
							if(orderStatus){
								console.log(orderID);
								Order.update(
									{orderID: orderID},
									{$set : {orderStatus : orderStatus}},
									function updateOrderCb(err, result){
										if(err){
											console.log(err);
											cb(null);
										}

										if(result){
											cb(true, data.formData);

										}
										if(!result){
											console.log('update failed', result);
											cb(false);
										}
									}
								);
							}
							else{
								cb(true, data.formData);

							}
							//cb(true, data.formData);
						}
					});
				}


				if(data){
					FormData.update(

						{order_id: orderID},
						{$set : {formData : formData}},
						function updateCb(err, result ){

							if(err){
								log.error(' Error occured while Saving updateCb');
								log.error(err);
								cb(null);
							}

							if(result){
								FormData.findOne({order_id: orderID}, function(err, data) {
									if(err){
										log.error(err.message);
										cb(null);
									}

									if(!data){

										cb(false);
									}

									if(data){
										//console.log(orderStatus);
										if(orderStatus){
											//console.log(orderID);
											Order.update(
												{orderID: orderID},
												{$set : {orderStatus : orderStatus}},
												function updateOrderCb(err, result){
													if(err){
														console.log(err);
														cb(null);
													}

													if(result){
														cb(true, data.formData);

													}
													if(!result){
														console.log('update failed', result);
														cb(false);
													}
												}
											);

										}
										else{
											cb(true, data.formData);

										}
									}
								});
							}
					});
				}
			});
		};

		this.retrieveFormData = function(orderID , cb){

			FormData.findOne({order_id: orderID}, function findOneCb(err, data){

				if(err){
					log.error(' Error occured while findOneCb retrieveFormData');
					log.error(err);
					cb(null);
				}

				if(data){

					cb(true, data.formData);
				}

				if(!data){

					cb(false);
				}
			});
		};
	}

	return {
        getInstance: function () {

            if (!instance) {
                log.warn('Creating first instance of FormDataVO');
                instance = new createInstance();
            }
            //log.debug('sending object = ' + instance);
            return instance;
        }
    };
})();

module.exports = FormDataVO;

