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
var orderID = require('../vo/orderIDVO');



var OrderSchema = new mongoose.Schema({

		
		order_id	 							: { type: Number , required: true, unique: true } ,
        order_property_primary_holder	     	: { 
        	customer_id: {type:Schema.Types.ObjectId, required: true, ref: 'Customer'}
        },
		order_property_detail    				: { 

			property_id : { type: Schema.Types.ObjectId, required: true, ref:'Property' },
			address_id	: { type: Schema.Types.ObjectId, required: true, ref: 'Address' }

		},
		order_received_date     				: { type: Date, default: Date.now },
		order_due_date							: { type: Date },
		order_priority_ind 						: { type: String, lowercase: false, trim: true},
		order_image								: {	type: Schema.Types.ObjectId, ref: 'Image'},
		order_evaluation_detail					: {	type: Schema.Types.ObjectId, ref: 'Evaluation'},
		order_progress_status					: { type: String, lowercase: false, trim: true}, 
		order_assigned_to						: { 

			order_current_appraiser		: {type: Schema.Types.ObjectId, ref: 'User' },
			order_previous_appraiser 	: [{ type: Schema.Types.ObjectId, ref: 'User'}]

		}

	},
	{

		collection: 'OrderDetailCollection'
	}

);

OrderSchema.methods.generateOrderNumber = function(){

	return orderID.getNextOrderID();

}


module.exports = conn.model('Order', OrderSchema);

