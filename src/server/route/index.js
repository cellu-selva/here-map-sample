"use strict";

module.exports = function(app, router) {
    var indexController = require(__dirname + '/../controller/index.js');

    router.get('/', indexController.initialRender);

  return router;
}
