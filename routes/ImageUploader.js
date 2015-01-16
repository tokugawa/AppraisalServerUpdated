var express = require('express');
var router = express.Router();
var formDataManager = require('./ImageUploaderManager')(router);



router.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	
	next();
  

});



module.exports = router;