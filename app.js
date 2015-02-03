
var cluster     = require('cluster');
/*var numCPUs = require('os').cpus().length;*/
var log4js = require('log4js');
var log = log4js.getLogger("app");

var port= 3000;



if(cluster.isMaster){

   
    if (process.env.NODE_ENV === 'production') {
      /*log4js.configure('./config/log4jsConfigProduction.json');*/
      log4js.configure('./config/log4jsConfig.json');
    }
    else {
      log4js.configure('./config/log4jsConfig.json');
    }

    cluster.setupMaster({silent: false});

    //require('os').cpus().forEach(function () {
        cluster.fork();
    //});
    //cluster.fork();
    require('portscanner').checkPortStatus(process.env.PORT || port, '127.0.0.1', function (error, status) {
        if (status === 'open') {
          log.error('Master server failed to start on port %d due to port conflict', port);
          process.exit(1);
        }
    });

    cluster.on('exit', function (worker, code, signal) {
        log.error('Worker server died (ID: %d, PID: %d)', worker.id, worker.process.pid);
        //cluster.fork(); //switch on it in prod env
    });

    
}

else {

    var express = require('express');
    var path = require('path');
    var favicon = require('serve-favicon');
    var cors = require('cors');   
    var cookieParser = require('cookie-parser');
    var session = require('express-session');
    var redisStore = require('connect-redis')(session);
    var passport = require('passport');

    var bodyParser = require('body-parser');

    require('./util/passport')(passport);

    var users = require('./routes/users').list;
    var user = require('./routes/checkUser');
    var userCreate = require('./routes/CreateUser');
    var order = require('./routes/getOrderListTemp');
    var orderCom = require('./routes/GetOrderDetailCompletedTemp');
    //var uploadFile = require('./routes/UploadFile');
    var uploadFile = require('./routes/ImageUploader');
    var formData = require('./routes/FormDataRouter');

    var app = express();
    app.use(favicon(__dirname + '/public/img/favicon.ico'));
    
    var client = require('./util/RadisClient').getInstance();


    app.set('port', process.env.PORT || 3000);


    // view engine setup


    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    //app.engine('html', require('ejs').renderFile);

    // uncomment after placing your favicon in /public
    
    //app.use(logger('dev'));
    app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(cookieParser('yoursecretcode'));
    app.use(session(
        {
            secret: 'sjnvsdi-9npwjwe-0l3ne n;f0-20-2323 ,2 ,flwefn', 
            store: new redisStore({ host: 'tarpon.redistogo.com', port: 10646, client: client }),
            saveUninitialized: false, // don't create session until something stored,
            resave: false // don't save session if unmodified
        }
    ));
    //app.use(session({secret: 'yourothersecretcode', saveUninitialized: true, resave: true}));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(passport.initialize());
    app.use(passport.session());


    //routers
    var routes = require('./routes/index')(passport);
    app.use('/', routes);
    app.use('/users', users);
    app.get('/api/v1/checkUserCredential', user);
    app.get('/api/v1/getOrderDetail', order);
    app.get('/api/v1/getCompletedOrderDetail', orderCom);

    app.post('/createUser', userCreate);
    app.options('/api/v1/uploadFile', cors());
    //app.options('/api/v1/uploadedFile', cors());
    app.post('/api/v1/uploadFile', uploadFile);
    app.get('/api/v1/uploadedFile', uploadFile);
    app.get('/api/v1/uploadedFileList', uploadFile);
    app.options('/api/v1/formData', cors());
    app.post('/api/v1/formData', formData);
    app.get('/api/v1/formData', formData);

    /**/


    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });

   
    conn = require('./util/ConnectDBInstance').getInstance();

    /*process.on('uncaughtException', function (){

        
        conn.close(function(){

            log.info('Conncection Ended due to uncaughtException');

            process.exit(0);

        });

    });

    process.on('SIGINT', function sigintConnectionCloseCb(){

        log.info(' Server Termination');
         conn.close(function connectionCloseCb () {
            log.info('Disconnected through Server Termination');
            process.exit(0);
        });


    });

    process.on('SIGTERM', function (){


         conn.close(function(){

            log.info('Conncection Ended due to SIGTERM');

            process.exit(1);

        });

    });*/



    //require('./routes/index.js')(app, passport); 


    var server = app.listen(app.get('port'), function() {
      log.info('Worker server started on port %d (ID: %d, PID: %d)', app.get('port'), cluster.worker.id, cluster.worker.process.pid);
    });

}


