/*******************************************************************************************************/
/************************************Address.js is Order Model Class.*********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Somenath Ghosh       Date: Jan, 2015         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/


// load the things we need
var mongoose 		= require('mongoose');
var conn = require('../util/ConnectDBInstance').getInstance();


var AddressSchema = new mongoose.Schema({

		
		address_line_1							: { type: String , required: true },
		address_line_2	 						: { type: String  },
		address_city 							: { type: String , required: true },
		address_state							: { type: String , required: true },
		address_zip								: { type: Number , required: true, min: 10000, max: 99999 },
		address_county							: { type: String },
		address_lat								: { type: Number },
		address_long							: { type: Number }

	},
	{

		collection: 'AddressCollection'
	}

);

module.exports = conn.model('AddressCollection', AddressSchema);
