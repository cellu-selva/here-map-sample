  "use strict";
  var express = require('express'),
  app = express(),
  consolidate = require('consolidate'),
  logger = require('morgan'),
  path = require('path'),
  rootPath = (__dirname + '/../'),
  router = express.Router(),
  route = require(__dirname + '/../src/server/route/index.js')(app, router);


  // require('./here-map.js');

  app.use(logger('dev'));
  app.set('showStackError', true);
  app.engine('html', consolidate['swig']);
  app.set('views', path.join(__dirname, '/../src/client/views/'));
  app.set('view engine', 'html');

  app.use(logger('dev'));
  app.use(express.static(rootPath));

  app.use('/', route);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
  });

  /**
   * [error handler]
   * @type {[type]}
   */

  app.use(function (err, req, res, next) {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      // render the error page
      res.status(err.status || 500);
      res.render('error');
  });

  module.exports = app;
