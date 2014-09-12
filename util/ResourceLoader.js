
/*******************************************************************************************************/
/************************************ResourceLoader.js is Resource Load Class.*********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Somenath Ghosh       Date: Sep, 2014         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/


var fs = require('fs');
var log4js = require('log4js');
var log = log4js.getLogger("ResourceLoader");
var PAException = require('./PAException');
var path = require('path');
var util = require('util');


/****** Import Libs Ends*******/


var ResourceLoader = (function(){

    var instance ;
	function createInstance() {
        /*var object = new ResouceLoader();
        return object;*/
        var file = path.join(__dirname , '../config/properties.json');
        log.info(file);
        try{
            
            var content=fs.readFileSync(file, "utf8");
            //log.info(content);
            this.data = JSON.parse(content);

            

        }
        catch(err){
            log.error('Error occured\n' + this.data);

            throw new PAException('ResouceLoader','JSON Parse Exception');
        }
        finally {


        }

        this.getResourceById = function(resourceType, resourceId){
            log.debug(resourceType , resourceId);

            return this.data[resourceType][resourceId];

        }

        

    }
 
    return {
        getInstance: function () {

            if (!instance) {
                log.info('Creating first instance of ResourceLoader');
                instance = new createInstance();
            }
            log.info('sending instanceOf ResourceLoader' + instance);
            return instance;
        }
    };

})();


module.exports = ResourceLoader;



