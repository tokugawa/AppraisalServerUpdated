
/*******************************************************************************************************/
/************************************UploadImageFiles.js is File Upload Class.**************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Somenath Ghosh       Date: Sep, 2014         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/

var log4js = require('log4js');
var log = log4js.getLogger("UploadImageFiles");
var resourceLoader = require('../util/ResourceLoader').getInstance();
var url = require('url');
var path = require('path');

var ImageUrlVO = require('../vo/ImageUrlVO').getInstance(); 

var UPLOAD_FILE = resourceLoader.getResourceById('API_KEY' , 'UPLOAD_FILE');
var GET_IMAGE_LIST  = resourceLoader.getResourceById('API_KEY' , 'GET_IMAGE_LIST');
var GET_IMAGES = resourceLoader.getResourceById('API_KEY' , 'GET_IMAGES');


var options = {
    tmpDir:  __dirname + '/../public/uploaded/tmp',
    publicDir: __dirname + '/../public/uploaded',
    uploadDir: __dirname + '/../public/uploaded/files',
    uploadUrl:  '/api/v1/uploadedFile/file/',
    maxPostSize: 11000000000, // 11 GB
    minFileSize:  1,
    maxFileSize:  10000000000, // 10 GB
    acceptFileTypes:  /.+/i,
    // Files not matched by this regular expression force a download dialog,
    // to prevent executing any scripts in the context of the service domain:
    inlineFileTypes:  /\.(gif|jpe?g|png)$/i,
    imageTypes:  /\.(gif|jpe?g|png)$/i,
    imageVersions: {
        width:  80,
        height: 80
    },
    accessControl: {
        allowOrigin: '*',
        allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
        allowHeaders: 'Content-Type, Content-Range, Content-Disposition'
    },
    nodeStatic: {
        cache:  3600 // seconds to cache served files
    }
};

var fs = require("fs"),
    util = require("util");

var mime = require("mime");

/*var dataUri = base64Image("./icon4.png");
console.log(dataUri);*/

function base64Image(src) {
    var data = fs.readFileSync(src).toString("base64");
    return util.format("data:%s;base64,%s", mime.lookup(src), data);
}



var uploader = require('blueimp-file-upload-expressjs')(options);


module.exports = function (router) {
    router.get('/api/v1/uploadedFile', function(req, res) {
        var query = url.parse(req.url,true).query;
        var apiKey  = query.apiKey;
        var orderID = query.orderID;
        var fileName = query.name;
        var filePath = path.resolve(__dirname , '../public/uploaded/files');
        //console.log(filePath);
        var options = {
            root: filePath,
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
          };

        //console.log(fileName);
        if(apiKey !== GET_IMAGES){
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
                    //res.send({message: 'IMGLST', list:list});
                    if(list.indexOf(fileName) !== -1){
                        res.sendFile(fileName, options, function(err){

                            if(err){

                                console.log(err);
                                res.status(err.status).end();
                            }

                            else{
                                
                                console.log('sent:' , fileName);
                            }
                        });
                    }
                    else{
                        console.log(' No image found for orderID ' + orderID);
                        res.header('Access-Control-Allow-Origin', '*');
                        res.send({message: 'NOACSS'});
                    }

                }


            });
           /* res.header('Access-Control-Allow-Origin', '*');
            
            res.sendFile(fileName, options, function(err){

                if(err){

                    console.log(err);
                    res.status(err.status).end();
                }

                else{
                    
                    console.log('sent:' , fileName);
                }
            });*/
            

        }

       
      
    });


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

        //console.log('I am in upload File');


        var query = url.parse(req.url,true).query;
        var apiKey  = query.apiKey;
        var orderID = query.orderID;
        var filePath = path.resolve(__dirname , '../public/uploaded/files/');


        log.info(apiKey);
        if(apiKey !== UPLOAD_FILE){
            log.error('apiKey wrong' , apiKey); 
            res.header('Access-Control-Allow-Origin', '*');
            res.status(403).send('forbidden');
        }
        else {
            //console.log('I am in upload File -2 ');
            uploader.post(req, res, function (obj) {

                //console.log(req);
                var returnedObj = obj.files;
                var arrayLength = returnedObj.length;
                var imageArray = [];
                for ( var i=0 ; i< arrayLength ; i++){
                    //imageArray.push(returnedObj[i].name);
                    filePath = path.resolve(filePath , returnedObj[i].name);
                    //console.log(filePath);
                    //console.log(base64Image(filePath));

                    imageArray.push(base64Image(filePath));
                    fs.unlink(filePath, function (err) {
                      if (err) throw err;
                      console.log('successfully deleted ' + filePath);
                    });


                }
                //console.log(imageArray);
                res.header('Access-Control-Allow-Origin', '*');
                ImageUrlVO.addOrUpdate(orderID, imageArray , function cb(returnFlag, data){
                    if(returnFlag === null){

                        res.Status(500).end();
                    }
                    if(returnFlag === false){

                        res.send({message: 'NOIMG'});


                    }

                    if(returnFlag === true){
                        //console.log(data);
                        res.send({message: 'IMGLST', list:data});
                    }



                });
                


                
                //res.header('Access-Control-Allow-Origin', '*');
                 
            });
           
        }

          
      
    });

    /*router.delete('/api/v1/uploadedFile/file/:name', function(req, res) {
      uploader.delete(req, res, function (obj) {
            res.send(JSON.stringify(obj)); 
      });
      
    });*/
    return router;
}