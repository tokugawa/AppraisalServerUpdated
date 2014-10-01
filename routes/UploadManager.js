
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

var UPLOAD_FILE = resourceLoader.getResourceById('API_KEY' , 'UPLOAD_FILE');


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




var uploader = require('blueimp-file-upload-expressjs')(options);


module.exports = function (router) {
    router.get('/api/v1/uploadFile', function(req, res) {
      uploader.get(req, res, function (obj) {
            res.send(JSON.stringify(obj)); 
      });
      
    });

    router.post('/api/v1/uploadFile', function(req, res) {

        var query = url.parse(req.url,true).query;
        var apiKey  = query.apiKey;
        log.info(apiKey);
        if(apiKey !== UPLOAD_FILE){
            log.error('apiKey wrong' , apiKey); 
            res.header('Access-Control-Allow-Origin', '*');
            res.status(403).send('forbidden');
        }
        else {
            uploader.post(req, res, function (obj) {
                console.log(obj);
                //res.send(JSON.stringify(obj)); 
                res.header('Access-Control-Allow-Origin', '*');
                res.send(); 
            });
           
        }

          
      
    });

    router.delete('/api/v1/uploadedFile/file/:name', function(req, res) {
      uploader.delete(req, res, function (obj) {
            res.send(JSON.stringify(obj)); 
      });
      
    });
    return router;
}