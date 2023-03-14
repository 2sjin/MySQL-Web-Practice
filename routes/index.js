var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('sections', { 
    title: '섹션 목록' 
  });
});
module.exports = router;
