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
		
		client_name								: { type: String , required: true },
		client_address							: {	type: mongoose.Schema.Types.ObjectId, ref: 'AddressCollection' },
		client_phone							: {	type: Number , required: true },
		client_email		 					: { type: String,  required: true }
	},
	{
		collection: 'ClientCollection'
	}

);




module.exports = conn.model('ClientCollection', ClientSchema);
