/*******************************************************************************************************/
/********************UCDPValidator.js validates a generated XML as UCDP format.*************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Brandon Rodenmayer          Date: April, 2015              Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/
var log4js = require('log4js');
var log = log4js.getLogger("UCDPValidator");
var PAException = require('./PAException');
var validator = require('xsd-schema-validator');

/****** Import Libs Ends*******/

var UCDPValidator = (function(){

    var instance ;
	function createInstance() {

		var xsdValidator = '';

        this.validateForm = function(formXML, cb){
           
        	validator.validateXML(formXML, xsdValidator, function(err, result) {
        		
			  	if (err) {
			    	cb(false);
			  	}
			  	else if(result.valid){
			  		cb(true);
			  	}
			  	else{
			  		cb(false);
			  	}
			});
        }
    }
    return {
        getInstance: function () {

            if (!instance) {
                log.warn('Creating first instance of UCDPValidator');
                instance = new createInstance();
            }
            //log.info('sending instanceOf ResourceLoader' + instance);
            return instance;
        }
    };

})();

module.exports = UCDPValidator;