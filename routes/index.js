var express = require('express');
var router = express.Router();

var sql = require('../database/sql')

// 섹션 아이콘 목록
const sectionIcons = ['🍚', '🌭', '🍜', '🍣', '🥩', '☕', '🍰']

// 식당 상태 맵
const statusKorMap = {
  OPN: '영업중', 
  CLS: '폐업',
  VCT: '휴가중',
  RMD: '리모델링'
}

// 섹션 목록 요청(GET)
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

// 섹션별 식당 목록(단순 화면) 요청(GET)
router.get('/biz-simple', async function(req, res, next) {
  const businesses = await sql.getBusinessesJoined(req.query)
  businesses.map((item) => {
    item.status_kor = statusKorMap[item.status]
    return item
  })

  res.render('biz-simple', { 
    title: '식당 목록(단순 화면)',
    businesses
  });
});

// 섹션별 식당 목록(고급 화면) 요청(GET)
router.get('/biz-adv', async function(req, res, next) {
  const businesses = await sql.getBusinessesJoined(req.query)
  businesses.map((item) => {
    item.status_kor = statusKorMap[item.status]
    return item
  })

  res.render('biz-adv', { 
    title: '식당 목록(고급 화면)',
    q: req.query,
    businesses
  });
});

// 식당 정보 상세페이지 요청(GET)
router.get('/business/:id', async function(req, res, next) {
  const biz = await sql.getSingleBusinessJoined(req.params.id)
  biz.status_kor = statusKorMap[biz.status]
  biz.icon = sectionIcons[biz.section_id - 1]

  const menus = await sql.getMenusOfBusiness(req.params.id)
  const ratings = await sql.getRatingsOfBusiness(req.params.id)

  res.render('detail', { 
    biz,
    menus,
    ratings
  });
});

// 메뉴별 좋아요 값 변경(PUT)
router.put('/menus/:id', async function(req, res, next) {
  const result = await sql.updateMenuLikes(req.params.id, req.body.like)
  res.send(result)
});

module.exports = router;
