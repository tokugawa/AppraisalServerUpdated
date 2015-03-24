/*******************************************************************************************************/
/************************************Customer.js is Order Model Class.*********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Somenath Ghosh       Date: Jan, 2015         Desc: Initial Built
/* Contributer: Brandon Rodenmayer    Date: March, 2015    Desc: Removed Unecessary Fields
/*******************************************************************************************************/


/****** Import Libs *******/


// load the things we need
var mongoose 		= require('mongoose');
var conn = require('../util/ConnectDBInstance').getInstance();


var CustomerSchema = new mongoose.Schema({

		customer_first_name						: { type: String , required: true },
		customer_last_name 						: { type: String , required: true  },
		customer_address						: {	type: mongoose.Schema.Types.ObjectId, ref: 'AddressCollection' },
		customer_primary_phone					: {	type: Number , required: true },
		customer_cell_phone						: { type: Number }, 
		customer_work_phone	 					: { type: Number }, 
		customer_email		 					: { type: String }, 
		//customer_preferred_contact_number		: {	type: Number , required: true },
		//customer_preferred_contact_time			: [{ type: String, required: true }],
		//customer_last_contacted	     			: { type: Date }

	},
	{
		collection: 'CustomerCollection'
	}

);




module.exports = conn.model('CustomerCollection', CustomerSchema);
