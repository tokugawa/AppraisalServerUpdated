/*******************************************************************************************************/
/************************************AddressVO.js is Resource Load Class.*********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Brandon Rodenmayer      Date: March, 2015         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/

var log4js = require('log4js');
var log = log4js.getLogger("AddressVO");
var paException = require('../util/PAException');


/*var conn = require('../util/ConnectDBInstance').getInstance();*/
var address = require('../model/Address.js');


var AddressVO = (function(){

	var instance;
	function createInstance() {

		this.createNewAddress = function (address_line_1, address_line_2, address_city, address_state, address_zip, address_county, address_lat, address_long, address_verified, address_verified_date, address_x_ref, cb){

			log.info(' Class:AddressVO Method:createNewAddress starts');
			var newAddress = new address();

			newAddress.address_line_1  			= address_line_1;
			newAddress.address_line_2  			= address_line_2;
			newAddress.address_city				= address_city;
			newAddress.address_state			= address_state;
			newAddress.address_zip				= address_zip;
			newAddress.address_county			= address_county;
			newAddress.address_lat				= address_lat;
			newAddress.address_long				= address_long;
			newAddress.address_verified 		= address_verified;
			newAddress.address_verified_date	= address_verified_date;
			//newAddress.address_x_ref			= address_x_ref;

			//TODO Check Address Insert
			address.findOne({
					address_line_1: address_line_1, 
					address_line_2: address_line_2, 
					address_city: address_city, 
					address_state: address_state, 
					address_zip: address_zip })
			.exec(function findOneCb(err, data){
				if(err){
					log.error(err);
					cb(null);
				}
				if(data){

					log.info('Class:UserVO - Error Message: Address already exists');
					console.log(data);
					cb(data);
				}

				if(!data){
					log.info(' Class:UserVO - Info:No duplicate record found');
					newAddress.save(function saveAddressCb(err, doc){
						if(err) {
							log.error(err);
							throw new paException('AddressVO', 'Save Address Exception');
							cb(null);

						}
						else {

							log.info('Class:AddressVO - Info: Successful');
							cb(doc._id);
						}
					});
				}
			});
		};

		this.getAllAddresses = function(cb){

			//console.log('\nStarting to get all users');
			var dataArray = [];

			address.find({})
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

		this.getAddress = function(addressId, cb){

			address.findOne({_id: addressId})
			.exec(function(err, item){

				if(item){
					cb(item);
				}
				else{
					cb(null);
				}
			});
		}
	}

	return {
        getInstance: function () {

            if (!instance) {
                log.warn('Creating first instance of AddressVO');
                instance = new createInstance();
            }
            //log.debug('sending object = ' + instance);
            return instance;
        },
        address: address
    };
})();

module.exports = AddressVO;