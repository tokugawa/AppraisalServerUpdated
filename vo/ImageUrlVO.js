/*******************************************************************************************************/
/************************************ImageUrlVO.js is  Load Class.*********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Somenath Ghosh       Date: Sep, 2014         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/



var log4js = require('log4js');
var log = log4js.getLogger("ImageUrlVO");
var paException = require('../util/PAException');


/*var conn = require('../util/ConnectDBInstance').getInstance();*/
var ImageUrl = require('../model/ImageURL.js');
var order = require('../model/Order.js');


var ImageUrlVO = (function(){

	var instance;
	function createInstance() {

		this.createNewImageUrl = function(orderId, cb){

			var newImageUrl = new ImageUrl();

			newImageUrl.order_id 		= orderId;
			newImageUrl.imageUrlList 	= [];

			log.info('order_id ', orderId);
			ImageUrl.findOne({order_id: orderId}, function findOneCb(err, data){
				if(err){
					log.error(err);
					cb(null);
				}
				if(data){

					log.error('Class:ImageURLVO - Error Message: OrderId already taken');
					cb(data._id);
				}

				if(!data){
					log.info('Class:ImageURLVO - Info: No duplicate record found');
					newImageUrl.save(function saveOrderCb(err, doc){
						if(err) {
							log.error(err);
							throw new paException('ImageURLVO', 'Save Order Exception');
							cb(null);
						}
						else {

							log.info('Class:ImageURLVO - Info: Successful');
							cb(doc._id);
						}
					});
				}
			});
		}

		this.addOrUpdate = function (orderID, imageUrlList, cb ){

			log.info('Class:ImageUrlVO Method:addOrUpdate starts');

			ImageURL.findOne({order_id : orderID}, function findOneCb(err, data){

				if(err){
					log.error(err);
					cb(null);
				}

				if(!data){

					var newImageUrl = new ImageURL();
					newImageUrl.order_id = orderID;
					newImageUrl.imageUrlList = imageUrlList;

					newImageUrl.save(function saveCb(err, data){

						if(err){

							log.error(err);
							cb(null);
						}

						if(data){

							cb(true, imageUrlList);
						}
					});
				}

				if(data){
					ImageURL.update(

						{order_id: orderID},
						{$push : {imageUrlList : {$each: imageUrlList}}},
						function updateCb(err, result ){

							if(err){
								log.error(err);
								cb(null);
							}

							if(result){
								ImageURL.findOne({order_id: orderID}, function(err, data) {
									if(err){
										log.error(err.message);
										cb(null);
									}

									if(!data){

										cb(false);
									}

									if(data){

										cb(true, data.imageUrlList);
									}
								})
							}
						}
					);
				}
			});
		};

		this.retrieveImage = function(orderID , cb){

			ImageURL.findOne({order_id: orderID}, function findOneCb(err, data){

				if(err){
					log.error(err);
					cb(null);
				}

				if(data){

					cb(true, data.imageUrlList);
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
                log.warn('Creating first instance of ImageUrlVO');
                instance = new createInstance();
            }
            //log.debug('sending object = ' + instance);
            return instance;
        }
    };
})();

module.exports = ImageUrlVO;