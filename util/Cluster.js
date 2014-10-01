/*jslint indent: 2, node: true, nomen: true, vars: true */

'use strict';

module.exports = function Cluster(options, resources, logger) {
  var start = function () {
    var cluster = require('cluster');

    if (cluster.isMaster) {
      require('portscanner').checkPortStatus(options.express.port, '127.0.0.1', function (error, status) {
        if (status === 'open') {
          logger.log.error('Master server failed to start on port %d due to port conflict', options.express.port);
          process.exit(1);
        }
      });

      // Each core to run a single process.
      // Running more than one process in a core does not add to the performance.
      require('os').cpus().forEach(function () {
        cluster.fork();
      });

      cluster.on('exit', function (worker, code, signal) {
        logger.log.warn('Worker server died (ID: %d, PID: %d)', worker.id, worker.process.pid);
        cluster.fork();
      });
    } else if (cluster.isWorker) {
      var _ = require('underscore');
      var express = require('express');
      var resource = require('express-resource');

      // Init App

      var app = express();

      // App Property

      app.set('port', process.env.PORT || options.express.port);
      app.set('views', options.viewPath);
      app.set('view engine', 'jade');
      app.set('case sensitive routing', true);
      app.set('strict routing', false);

      // App Middleware

      app.use(express.favicon(options.faviconPath));
      app.use(express.logger({ stream: logger.stream() }));
      app.use(express.bodyParser());
      app.use(express.methodOverride());
      app.use(express.responseTime());
      app.use(app.router);
      app.use(require('stylus').middleware(options.publicPath));
      app.use(express['static'](options.publicPath));

      if (options.express.displayError) {
        app.use(express.errorHandler());
      }

      // App Format

      app.locals.pretty = options.express.prettyHTML;

      // App Route Handler

      if (!_.isUndefined(resources) && _.isArray(resources)) {
        _.each(resources, function (item) {
          if (!_.isUndefined(item.name) && !_.isUndefined(item.path)) {
            app.resource(item.name, require(item.path));
          }
        });
      }

      // Start Server

      var domain = require('domain').create();

      domain.run(function () {
        require('http').createServer(app).listen(app.get('port'), function () {
          logger.log.info('Worker server started on port %d (ID: %d, PID: %d)', app.get('port'), cluster.worker.id, cluster.worker.process.pid);
        });
      });

      domain.on('error', function (error) {
        logger.log.error(error.stack);
      });
    }
  };

  return {
    start: start
  };
};