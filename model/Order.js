/*******************************************************************************************************/
/************************************Order.js is Order Model Class.*********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Somenath Ghosh       Date: Sep, 2014         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/


// load the things we need
var mongoose = require('mongoose');
var conn = require('../util/ConnectDBInstance').getInstance();
var orderID = require('../vo/OrderIDVO');



var OrderSchema = new mongoose.Schema({

		
		order_id	 							: { type: Number , required: true, unique: true },
        order_property_primary_holder	     	: { 
        	customer_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'CustomerCollection' }
        },
		order_property_detail    				: { 

			property_id : { type: mongoose.Schema.Types.ObjectId, required: true, ref:'PropertyCollection' },
			address_id	: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'AddressCollection' }

		},
		order_client							: {	type: mongoose.Schema.Types.ObjectId, ref: 'ClientCollection'},
		order_received_date     				: { type: Date, default: Date.now },
		order_completed_date					: { type: Date },
		order_due_date							: { type: Date },
		order_priority_ind 						: { type: Number },
		order_image								: {	type: mongoose.Schema.Types.ObjectId, ref: 'ImageURLCollection'},
		order_evaluation_detail					: {	type: mongoose.Schema.Types.ObjectId, ref: 'FormDataCollection'},
		order_progress_status					: { type: Number, required: true }, 
		order_assigned_to						: { 

			order_current_appraiser	  	: {  type: mongoose.Schema.Types.ObjectId, ref: 'UserCollection' },
			order_previous_appraisers 	: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserCollection'}]

		},
		order_status_current 					: { type: String , required: true },
		order_status_past						: [{ type: String }],
		order_status_next						: { type: String }


	},
	{

		collection: 'OrderCollection'
	}

);

OrderSchema.methods.generateOrderNumber = function(cb){

	return orderID.getNextOrderID(cb);

}


module.exports = conn.model('OrderCollection', OrderSchema);

