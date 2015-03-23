/*******************************************************************************************************/
/************************************ClientVO.js is Resource Load Class.*********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Brandon Rodenmayer            Date: March, 2014         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/



var log4js = require('log4js');
var log = log4js.getLogger("ClientVO");
var paException = require('../util/PAException');


/*var conn = require('../util/ConnectDBInstance').getInstance();*/
var client = require('../model/Client.js');


var ClientVO = (function(){

	var instance;
	function createInstance() {

		this.createNewClient = function (name, address, phone, email, cb  ){

			log.info(' Class:ClientVO Method:createNewClient starts');
			var newClient = new client();
		
			newClient.client_name = name;
			newClient.client_address = address;
			newClient.client_phone = phone;
			newClient.client_email = email;

			log.info('client_name ' , name);
			client.findOne({client_name: name, client_address: address, client_phone: phone, client_email: email }, function findOneCb(err, data){
				if(err){
					log.error(err);
					cb(null);
				}
				if(data){

					log.error('Class:ClientVO - Error Message: Client already exists');
					cb(false);
				}

				if(!data){
					log.info(' Class:ClientVO - Info:No duplicate record found');
					newClient.save(function saveUserCb(err, doc){
						if(err) {
							log.error(err);
							throw new paException('ClientVO', 'Save Client Exception');
							cb(null);
						}
						else {

							log.info('Class:ClientVO - Info: Successful');
							cb(doc);
						}
					});
				}
			});
		};

		this.getAllClients = function(cb){

			//console.log('\nStarting to get all users');
			var dataArray = [];

			client.find({})
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

		this.getClient = function(clientId, cb){

			client.findOne({_id: clientId})
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
                log.warn('Creating first instance of ClientVO');
                instance = new createInstance();
            }
            //log.debug('sending object = ' + instance);
            return instance;
        },
        client: client
    };

})();

module.exports = ClientVO;