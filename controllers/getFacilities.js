const database = require("../database/database"); // database.js import

exports.getFacilities = async (req, res) => {
  const fac_type = req.query.fac_type; // 시설 타입
  const values = [];
  // 기본 SQL 쿼리
  let query = `
    SELECT * FROM facilities_table
  `;

  // fac_type 존재하는 경우 query 추가
  if (fac_type) {
    query += ` WHERE fac_type = $${values.length + 1}`;
    values.push(fac_type);
  }

  try {
    const result = await database.query(query, values);
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
