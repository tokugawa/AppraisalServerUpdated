/*******************************************************************************************************/
/************************************FormDataManager.js is File Upload Class.**************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Somenath Ghosh       Date: Sep, 2014         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/

var log4js = require('log4js');
var log = log4js.getLogger("FormDataManager");
var resourceLoader = require('../util/ResourceLoader').getInstance();
var url = require('url');

var FormDataVO = require('../vo/FormDataVO').getInstance(); 

var POST_FORM_DATA = resourceLoader.getResourceById('API_KEY' , 'POST_FORM_DATA');
var GET_FORM_DATA  = resourceLoader.getResourceById('API_KEY' , 'GET_FORM_DATA');

module.exports = function (router) {
    router.get('/api/v1/formData', function(req, res) {
        var query = url.parse(req.url,true).query;
        var apiKey  = query.apiKey;
        var orderID = query.orderID;
        
        if(apiKey !== GET_FORM_DATA){
            log.error('apiKey wrong' , apiKey); 
            res.header('Access-Control-Allow-Origin', '*');
            res.status(403).send('forbidden');
        }
        else {

            FormDataVO.retrieveFormData(orderID, function retrieveCb(flag, data){
                if(flag === null){

                    log.error('error');
                    res.header('Access-Control-Allow-Origin', '*');
                    res.send({message:'ERR'});
                }

                if(flag === false){
                    res.header('Access-Control-Allow-Origin', '*');
                    res.send({message: 'NOFORM'});
                }

                if(flag === true){
                    res.header('Access-Control-Allow-Origin', '*');
                    res.send({message: 'FORM', form:data});
                    
                }


            });
          

        }

       
      
    });


    


    router.post('/api/v1/formData', function(req, res) {

        var query = url.parse(req.url,true).query;
        var apiKey  = query.apiKey;
        var orderID = query.orderID;
        console.log('POST FormData', orderID);
        var formData = req.body.formData;

        console.log(req.body.formData);


        if(apiKey !== POST_FORM_DATA){
            log.error('apiKey wrong' , apiKey); 
            res.header('Access-Control-Allow-Origin', '*');
            res.status(403).send('forbidden');
        }
        else {
            
                res.header('Access-Control-Allow-Origin', '*');
                FormDataVO.addOrUpdate(orderID, formData , function cb(returnFlag, data){
                    if(returnFlag === null){

                        res.status(500).send({message: 'ERR'});
                    }
                    if(returnFlag === false){

                        res.send({message: 'NOFORM'});


                    }

                    if(returnFlag === true){
                        console.log(data);
                        res.send({message: 'FORM', data:data});
                    }



                });
              
                 
            }
             
      
    });

    
    return router;
}




