(function(){
  "use strict";

  var methods = {
    initialRender: initialRender
  };


  function initialRender (req, res) {
    res.render('index');
  }

  module.exports = methods;
})();
