const mysql = require('mysql2');

const pool = mysql.createPool(
  process.env.JAWSDB_URL ?? {
    host: 'localhost',      // DB 호스트의 주소(IP or Domain)
    user: 'root',           // 접속자 이름
    database: 'yalco',      // DB 이름
    password: '1111',       // DB 패스워드
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  }
);
const promisePool = pool.promise();

const sql = {

    // SQL: 섹션 테이블 전체 조회
    getSections : async () => {
        const [rows] = await promisePool.query(`SELECT * FROM sections`)
    return rows
    },

    // SQL: 섹션(sections) 테이블과 식당(businesses) 테이블 join 결과 조회
    getBusinessesJoined : async (query) => {
        const sqlQuery = `
        SELECT * FROM sections S
        LEFT JOIN businesses B
            ON S.section_id = B.fk_section_id
        WHERE TRUE
            ${query.section
            ? ('AND section_id = ' + query.section) : ''}
            ${query.floor
            ? ('AND floor = ' + query.floor) : ''}
            ${query.status
            ? ("AND status = '" + query.status + "'") : ''}
        ORDER BY
            ${query.order 
            ? query.order : 'business_id'}
        `
        console.log(sqlQuery)   // SQL 구문이 콘솔(터미널)에 출력됨

        const [rows] = await promisePool.query(sqlQuery)
        return rows
    },

    // 하나의 식당(businesses)에 대한 상세 정보 조회
    getSingleBusinessJoined : async (business_id) => {
        const [rows] = await promisePool.query(`
          SELECT * FROM sections S
          LEFT JOIN businesses B
            ON S.section_id = B.fk_section_id
          WHERE business_id = ${business_id}
        `)
        return rows[0]
      },
    
      getMenusOfBusiness : async (business_id) => {
        const [rows] = await promisePool.query(`
          SELECT * FROM menus
          WHERE fk_business_id = ${business_id}
        `)
        return rows
      },
    
      getRatingsOfBusiness : async (business_id) => {
        const [rows] = await promisePool.query(`
          SELECT rating_id, stars, comment,
          DATE_FORMAT(
            created, '%y년 %m월 %d일 %p %h시 %i분 %s초'
          ) AS created_fmt
          FROM ratings
          WHERE fk_business_id = ${business_id}
        `)
        return rows
      },

}

module.exports = sql