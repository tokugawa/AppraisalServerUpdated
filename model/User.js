
/*******************************************************************************************************/
/************************************User.js is User Model Class.*********************************/
/*
/*========================================== Change Log ===============================================*/
/* Author: Somenath Ghosh       Date: Sep, 2014         Desc: Initial Built
/*******************************************************************************************************/


/****** Import Libs *******/


// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var resourceLoader = require('../util/ResourceLoader').getInstance();
var conn = require('../util/ConnectDBInstance').getInstance();


var SALT_WORK_FACTOR = resourceLoader.getResourceById('Constant','SALT_WORK_FACTOR');

var UserSchema = new mongoose.Schema({

		
		user_id		 		: { type: String, required: true, unique: true },
        password     		: { type: String, required: true },
		firstName    		: { type: String, required: true },
		lastName     		: { type: String, required: true },
		user_created 		: { type: Date, default: Date.now },
		user_address 		: { type: mongoose.Schema.Types.ObjectId, ref: 'AddressCollection' },
		isUserActive 		: { type: Boolean, required: true } ,
		user_role	 		: { type: String, required: true },
		active_order_list   : [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderCollection' }],
		pending_order_list	: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderCollection' }],
		completed_order_list : [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderCollection' }],
		invitation_code		: { type: String, required: true }
	},
	{

		collection: 'UsersCollection'
	}

)

// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_WORK_FACTOR), null);
};

// checking if password is valid
UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.isValidPassword = function() {
    return (this.password);
};

UserSchema.methods.generateID = function(){

	return new mongoose.Types.ObjectId;

};


// create the model for users and expose it to our app
module.exports = conn.model('UsersCollection', UserSchema);
