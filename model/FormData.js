/*******************************************************************************************************/
/************************************FormData.js is FormData Model.*********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Somenath Ghosh       Date: Sep, 2014         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/


// load the things we need
var mongoose = require('mongoose');
var conn = require('../util/ConnectDBInstance').getInstance();

var FormDataSchema = new mongoose.Schema({

		order_id	: { type: Number, required: true, unique: true },
		formData 	: { type: String, required: true }
	},

	{
		collection: 'FormDataCollection'
	}
);

// create the model and expose it to our app
module.exports = conn.model('FormDataCollection', FormDataSchema);