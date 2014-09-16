
/*******************************************************************************************************/
/************************************PAException.js is Exception Class.*********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Somenath Ghosh  		Date: Sep, 2014  		Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/


var log4js = require('log4js');
var log = log4js.getLogger("PAException");
var util = require('util');


/****** Import Libs Ends*******/


log4js.configure('./config/log4jsConfig.json', {});
log.setLevel('ERROR');


var PAException = function  (moduleName, message ){

		Error.call(this);

		this.source = moduleName;
		this.message = message;

		log.error('Exception at :' + moduleName + ' ' + message)



}





util.inherits(PAException, Error);


module.exports = PAException;