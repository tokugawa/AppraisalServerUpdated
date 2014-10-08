/*******************************************************************************************************/
/************************************ImageURL.js is ImageURL Model Class.*********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Somenath Ghosh       Date: Sep, 2014         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/


// load the things we need
var mongoose = require('mongoose');
var conn = require('../util/ConnectDBInstance').getInstance();

var ImageUrlSchema = new mongoose.Schema({

		order_id: { type: Number, required: true, unique: true},
		imageUrlList : [{type: String}]

	},

	{

		collection: 'ImageURLCollection'
	}




);



// create the model and expose it to our app
module.exports = conn.model('ImageURL', ImageUrlSchema);
