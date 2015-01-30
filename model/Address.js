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
		address_city 							: { type: String , required: true  },
		address_state							: { type: String , required: true  },
		address_zip								: { type: Number , required: true, min: 10000, max: 99999  },
		address_country							: { type: String , required: true  },
		address_lat								: { type: Number  },
		address_long							: { type: Number  },
		address_verified						: { type: Boolean , default:false},
		address_verified_date					: { type: Date },
		address_x_ref							: { type: Schema.Types.ObjectId}

		

	},
	{

		collection: 'AddressCollection'
	}

);




module.exports = conn.model('Address', AddressSchema);
