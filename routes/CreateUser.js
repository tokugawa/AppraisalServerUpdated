/*******************************************************************************************************/
/************************************CreateUser.js is Resource Load Class.*********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Somenath Ghosh       Date: Sep, 2014         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/


var log4js = require('log4js');
var log = log4js.getLogger("CreateUser");

var userVO = require('../vo/UserVO').getInstance();
var user = require('../model/User.js');


/*******************************************************************************************************/



var CreateUser = function (req, res) {

		
		try {
			var userName 					= req.body.userName;
			var password 					= req.body.password;
			var firstName 					= req.body.firstName;
			var lastName 					= req.body.lastName;
			var user_address 				= {};
			user_address.addressLine1 		= req.body.addressLine1;
			user_address.addressLine2		= req.body.addressLine2;
			user_address.city				= req.body.city;
			user_address.state				= req.body.state;
			user_address.zip				= req.body.zip;


		}
		catch( error) {
			log.error(' Class:CreateUser Method:CreateUser - body parsing error ', error);
			res.status(400).end();
		}
		

		
		try{

			userVO.createNewUser(userName,password, firstName, lastName, user_address, true, function returnCb (returnParam){

				log.info(' Class:CreateUser Method:createNewUser.returnCb() starts');
				

				


				if(returnParam === true){
					
					
					res.status(200).send({message:'successful'});
					
				}

				if(returnParam === false){
					
					res.status(200).send({message: 'ERR-403'});
					
				}


				if(returnParam === null){
					
					res.status(500).send({message:'Internal Server Error'});
					
				}

				log.info(' Class:CreateUser Method:createNewUser.returnCb() ends');
				

			});

		}
		catch( error) {

			log.error(' Class:CreateUser Error Message: Error Occured', error);
		}

	}




module.exports = CreateUser;



