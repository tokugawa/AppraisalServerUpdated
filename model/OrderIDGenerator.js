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


var OrderIDSchema = new mongoose.Schema({

		orderID : { type: Number, required: true, unique: true,  min: 999999 , max: 99999999}
	},
	{
		collection: 'OrderIDCollection'
	}

);

module.exports = conn.model('OrderID', OrderIDSchema);


