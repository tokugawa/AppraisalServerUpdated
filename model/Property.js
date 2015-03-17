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

		primary_holder_first_name						: { type: String  },
		primary_holder_last_name						: { type: String  },
		property_holders								: [{ type: mongoose.Schema.Types.ObjectId , ref: 'CustomerCollection' }],
		property_address 								: { type: mongoose.Schema.Types.ObjectId , ref: 'AddressCollection' },
	},
	{
		collection: 'PropertyCollection'
	}

);


module.exports = conn.model('PropertyCollection', PropertySchema);
