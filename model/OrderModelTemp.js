/*******************************************************************************************************/
/************************************Order.js is Order Model Class.*********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Somenath Ghosh       Date: Sep, 2014         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/


// load the things we need
var mongoose 		= require('mongoose');
var conn = require('../util/ConnectDBInstance').getInstance();




var OrderSchema = new mongoose.Schema({

		
		orderID	 							: {type: Number, require: true},
		order_received_date					: {type: String, require: true},
		order_due_date						: {type: String, require: true},
		order_addres						: {type: String, require: true},
		city								: {type: String, require: true},
		state								: {type: String, require: true},
		zip									: {type: Number, require: true},
		order_party_name					: {type: String, require: true},
		orderStatus 						: {type: Number, require: true}
        
	},
	{

		collection: 'OrderDetailTemp'
	}

);



module.exports = conn.model('Order', OrderSchema);

