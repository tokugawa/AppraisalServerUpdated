/*******************************************************************************************************/
/************************************ApiKeys.js is API Key Model Class.*********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Brandon Rodenmayer       Date: March, 2015         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/


// load the things we need
var mongoose 		= require('mongoose');
var conn = require('../util/ConnectDBInstance').getInstance();

var ApiKeysSchema = new mongoose.Schema({

		user_id									: { type: String, required: true, unique: true },
		api_key			 						: { type: String, required: true, unique: true },
		expiration								: { type: Date, required: true  }
	},
	{
		collection: 'ApiKeysCollection'
	}
);

module.exports = conn.model('ApiKeysCollection', ApiKeysSchema);
