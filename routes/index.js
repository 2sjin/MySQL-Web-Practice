var express = require('express');
var router = express.Router();

var sql = require('../database/sql')

const sectionIcons = [
  '🍚', '🍿', '🍜', '🍣', '🥩', '☕', '🍰'
]

/* GET home page. */
router.get('/', async function(req, res, next) {
  const sections = await sql.getSections()
  sections.map((item) => {
    item.icon = sectionIcons[item.section_id - 1]
  })

  res.render('sections', { 
    title: '섹션 목록',
    sections
  });
});

module.exports = router;
