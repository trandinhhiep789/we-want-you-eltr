
global.router = require('express').Router()
var router = global.router

var router = require('./user')
var router = require('./category')
var router = require('./post')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
