/*******************************************************************************************************/
/************************************PropertyVO.js is Resource Load Class.*********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Brandon Rodenmayer            Date: March, 2014         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/



var log4js = require('log4js');
var log = log4js.getLogger("PropertyVO");
var paException = require('../util/PAException');


/*var conn = require('../util/ConnectDBInstance').getInstance();*/
var property = require('../model/Property.js');


var PropertyVO = (function(){

	var instance;
	function createInstance() {

		this.createNewProperty = function (primaryHolderFirstName, primaryHolderLastName, propertyHolders, addressId, cb  ){

			log.info(' Class:PropertyVO Method:createNewProperty starts');
			var newProperty = new property();
		
			newProperty.primary_holder_first_name 	= primaryHolderFirstName;
			newProperty.primary_holder_last_name 	= primaryHolderLastName;
			newProperty.property_holders 			= propertyHolders;
			newProperty.address 					= addressId;

			log.info('property_primary_holder ' , primaryHolderFirstName+' '+primaryHolderLastName);
			property.findOne(
				{ 
					primary_holder_first_name: 	primaryHolderFirstName,
					primary_holder_last_name: 	primaryHolderLastName,
					property_holders: 			propertyHolders,
					address: 					addressId
				}, 
				function findOneCb(err, data){
					if(err){
						log.error(err);
						cb(null);
					}
					if(data){

						log.error('Class:PropertyVO - Error Message: Property already exists');
						cb(false);
					}

					if(!data){
						log.info(' Class:CustomerVO - Info:No duplicate record found');
						newProperty.save(function savePropertyCb(err, doc){
							if(err) {
								log.error(err);
								throw new paException('PropertyVO', 'Save Property Exception');
								cb(null);
							}
							else {

								log.info('Class:PropertyVO - Info: Successful');
								cb(doc);
							}
						});
					}
				}
			);
		};

		this.getAllProperties = function(cb){

			//console.log('\nStarting to get all users');
			var dataArray = [];

			property.find({})
			//.populate('client_address')
			.exec(function(err, cursor){

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

		this.getProperty = function(propertyId, cb){

			property.findOne({_id: propertyId})
			.exec(function(err, item){

				if(item){
					cb(item);
				}
				else{
					cb(null);
				}
			});
		}

		this.deleteProperty = function(propertyId, cb){

			property.remove({_id: propertyId})
			.exec(function(err, item){

				if(item){
					cb(item);
				}
				else{
					cb(null);
				}
			});
		}
	};

	return {
        getInstance: function () {

            if (!instance) {
                log.warn('Creating first instance of CustomerVO');
                instance = new createInstance();
            }
            //log.debug('sending object = ' + instance);
            return instance;
        },
        property: property
    };

})();

module.exports = PropertyVO;