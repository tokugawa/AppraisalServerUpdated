/*******************************************************************************************************/
/************************************ImageUploaderManager.js is File Upload Class.**************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Somenath Ghosh       Date: Jan, 2015         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/

var log4js = require('log4js');
var log = log4js.getLogger("ImageUploaderManager");
var resourceLoader = require('../util/ResourceLoader').getInstance();
var url = require('url');

var ImageUrlVO = require('../vo/ImageUrlVO').getInstance(); 

var UPLOAD_FILE = resourceLoader.getResourceById('API_KEY' , 'UPLOAD_FILE');
var GET_IMAGE_LIST  = resourceLoader.getResourceById('API_KEY' , 'GET_IMAGE_LIST');
var GET_IMAGES = resourceLoader.getResourceById('API_KEY' , 'GET_IMAGES');

module.exports = function (router) {

    router.get('/api/v1/uploadedFileList', function(req, res) {
        var query = url.parse(req.url,true).query;
        var apiKey  = query.apiKey;
        var orderID = query.orderID;
        if(apiKey !== GET_IMAGE_LIST){
            log.error('apiKey wrong' , apiKey); 
            res.header('Access-Control-Allow-Origin', '*');
            res.status(403).send('forbidden');
        }
        else {
            ImageUrlVO.retrieveImage(orderID, function retrieveImageListCb(flag, list){
                if(flag === null){

                    log.error('error');
                    res.header('Access-Control-Allow-Origin', '*');
                    res.send({message:'ERR'});
                }

                if(flag === false){
                    res.header('Access-Control-Allow-Origin', '*');
                    res.send({message: 'NOIMG'});
                }

                if(flag === true){
                    res.header('Access-Control-Allow-Origin', '*');
                    res.send({message: 'IMGLST', list:list});

                }


            });

        }


    });


    


    router.post('/api/v1/uploadFile', function(req, res) {


        var query = url.parse(req.url,true).query;
        var apiKey  = query.apiKey;
        var orderID = query.orderID;
        


        if(apiKey !== UPLOAD_FILE){

            log.error('apiKey wrong' , apiKey); 
            res.header('Access-Control-Allow-Origin', '*');
            res.status(403).send('forbidden');
        }
        else {
            var returnedObj = req.body.files;
            console.log(returnedObj);
            var imageArray = [];

            returnedObj.forEach(function(element, index){
                imageArray.push(element);

            });


            res.header('Access-Control-Allow-Origin', '*');

            ImageUrlVO.addOrUpdate(orderID, imageArray , function cb(returnFlag, data){

                if(returnFlag === null){

                    res.Status(500).end();
                }
                if(returnFlag === false){

                    res.send({message: 'NOIMG'});


                }

                if(returnFlag === true){
                    res.send({message: 'IMGLST', list:data});
                }



            });
                


           
        }

          
      
    });

    
    return router;
}




