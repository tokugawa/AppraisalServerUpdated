/*******************************************************************************************************/
/************************************Property.js is Order Model Class.*********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Somenath Ghosh       Date: Jan, 2015         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/


// load the things we need
var mongoose 		= require('mongoose');
var conn = require('../util/ConnectDBInstance').getInstance();


var PropertySchema = new mongoose.Schema({

		
		property_primary_holder							: [{ type: mongoose.Schema.Types.ObjectId , ref: 'CustomerCollection' }],
		property_secondary_holder	 					: [{ type: mongoose.Schema.Types.ObjectId , ref: 'CustomerCollection' }],
		property_address 								: { type: mongoose.Schema.Types.ObjectId , ref: 'AddressCollection' },
		

	},
	{

		collection: 'PropertyCollection'
	}

);




module.exports = conn.model('PropertyCollection', PropertySchema);
