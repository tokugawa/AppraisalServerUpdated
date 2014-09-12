/*******************************************************************************************************/
/************************************CheckUser.js is Resource Load Class.*********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Somenath Ghosh       Date: Sep, 2014         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/




var url = require('url');

var log4js = require('log4js');
var log = log4js.getLogger("UserRoute");
var resourceLoader = require('../util/ResourceLoader').getInstance();
var userVO = require('../vo/UserVO').getInstance();
//

var GET_USER_DETAIL_KEY = resourceLoader.getResourceById('API_KEY' , 'VALIDATE_USER');



var setHeaderForCORS = function(req, res, next) {
		log.debug('Setting up CORS for services');
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		return next();
	  

	}

var authenticateAPIKey = function(req, res, next){
	
	log.debug('apiKey check');
	var query = url.parse(req.url,true).query;
	var apiKey 	= query.apiKey;


	if(apiKey !== GET_USER_DETAIL_KEY){
		log.error('apiKey wrong' , apiKey);	
		res.status(403).end('forbidden');
	}
	else {
		log.debug('apiKey validated correct');	
		req.userName = query.userName;
		req.password = query.password;
		return next();	
	}
}

var validateUserCredential = function (req, res) {

		
		var userName = req.userName;
		var password = req.password;
		log.info('passeds value=' + userName , password);

		

		userVO.validateUser(userName,password, function returnCb (returnParam){

			if(returnParam === null){
				
				res.status(500).end('Internal Server Error');
				//cb(returnParam);
			}

			if(returnParam == false){
				
				res.status(401).end('unauthorized');
				//cb(returnParam);
			}


			if(returnParam === true){
				
				res.header('Access-Control-Allow-Origin', '*');
				res.status(200).end('successful');
				//cb(returnParam);
			}

			

		});

	}


/* Validate users listing. */

module.exports = [setHeaderForCORS,authenticateAPIKey,validateUserCredential];



