/*******************************************************************************************************/
/************************************CustomerVO.js is Resource Load Class.*********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Brandon Rodenmayer            Date: March, 2014         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/



var log4js = require('log4js');
var log = log4js.getLogger("CustomerVO");
var paException = require('../util/PAException');


/*var conn = require('../util/ConnectDBInstance').getInstance();*/
var customer = require('../model/Customer.js');


var CustomerVO = (function(){

	var instance;
	function createInstance() {

		this.createNewCustomer = function (firstName, lastName, addressId, primaryPhone, cellPhone, workPhone, email, cb  ){

			log.info(' Class:CustomerVO Method:createNewCustomer starts');
			var newCustomer = new customer();
		
			newCustomer.customer_first_name 	= firstName;
			newCustomer.customer_last_name 		= lastName;
			newCustomer.customer_address 		= addressId;
			newCustomer.customer_primary_phone 	= primaryPhone;
			newCustomer.customer_cell_phone	 	= cellPhone;
			newCustomer.customer_work_phone 	= workPhone;
			newCustomer.customer_email 			= email;

			log.info('customer_name ' , firstName+' '+lastName);
			customer.findOne(
				{ 
					customer_first_name: 	firstName,
					customer_last_name: 	lastName,
					customer_address: 		addressId,
					customer_primary_phone: primaryPhone,
					customer_cell_phone: 	cellPhone,
					customer_work_phone: 	workPhone,
					customer_email: 		email 
				}, 
				function findOneCb(err, data){
					if(err){
						log.error(err);
						cb(null);
					}
					if(data){

						log.error('Class:CustomerVO - Error Message: Customer already exists');
						cb(false);
					}

					if(!data){
						log.info(' Class:CustomerVO - Info:No duplicate record found');
						newCustomer.save(function saveCustomerCb(err, doc){
							if(err) {
								log.error(err);
								throw new paException('CustomerVO', 'Save Customer Exception');
								cb(null);
							}
							else {

								log.info('Class:CustomerVO - Info: Successful');
								cb(doc);
							}
						});
					}
				}
			);
		};

		this.getAllCustomers = function(cb){

			//console.log('\nStarting to get all users');
			var dataArray = [];

			customer.find({})
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

		this.getCustomer = function(customerId, cb){

			customer.findOne({_id: customerId})
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
        customer: customer
    };

})();

module.exports = CustomerVO;