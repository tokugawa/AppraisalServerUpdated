var LocalStrategy = require('passport-local').Strategy;

var User = require('../vo/UserVO').user;

module.exports = function(passport) {

	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        
        //usernameField : 'username',
        //passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, username, password, done) {
		console.log(username+' '+password);
        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'user_id' : username, 'role' : req.param('role').toLowerCase() }, function(err, user) {
                
                console.log(user.generateHash(password));
                console.log(user.password);

                if (err) { 
                    return done(err); 
                }
                else if (!user) { 
                    return done(null, false); 
                }
                else if (!user.validatePassword(password)) { 
                    return done(null, false); 
                }
                else{
                    return done(null, user);
                }
                    
            });
        });
    }));
}