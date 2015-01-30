/*******************************************************************************************************/
/************************************Client.js is Order Model Class.*********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Somenath Ghosh       Date: Jan, 2015         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/


// load the things we need
var mongoose 		= require('mongoose');
var conn = require('../util/ConnectDBInstance').getInstance();


var ClientSchema = new mongoose.Schema({

		
		client_since		     				: { type: Date, default: Date.now },
		client_name								: { type: String , required: true },
		client_supply_address					: {	type: Schema.Types.ObjectId, ref: 'AddressCollection'},
		client_primary_contact					: {	type: Number , required: true },
		client_support_email		 			: { type: String,  required: true}
		

		

	},
	{

		collection: 'ClientCollection'
	}

);




module.exports = conn.model('Client', ClientSchema);
