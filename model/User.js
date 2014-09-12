
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


var SALT_WORK_FACTOR = resourceLoader.getResourceById('Constant','SALT_WORK_FACTOR');

// define the schema for our user model
var UserSchema = mongoose.Schema({

		
		_id      	 : { type: String, required: true, index:{unique:true}},
        password     : { type:String, required: true },
		firstName    : { type:String, required: true },
		lastName     : { type:String, required: true },
		user_created : { type: Date, default: Date.now },
		user_address : {
			addressLine1 : 	{type: String, lowercase: true, trim: true },
			addressLine2 : 	{type: String, lowercase: true, trim: true },
			City		 :	{type: String, lowercase: true, trim: true },
			State		 :	{type: String, lowercase: true, trim: true },
			Zip			 :	{type: Number, min: 10000, max: 99999 }
		},
		isUserActive : Boolean,
		
		order_list   : []

})

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


// create the model for users and expose it to our app
module.exports = mongoose.model('User', UserSchema);
