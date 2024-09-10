const database = require("../database/database");
const { v4: uuid4 } = require("uuid");

// 코스 생성 엔드포인트
exports.postCourse = async (req, res) => {
  const {
    course_name,
    user_id,
    content,
    distance,
    waypoint,
    city,
    is_private,
    url,
    center,
    level,
  } = req.body;

  // console.log(course_name, user_id, content, distance, JSON.stringify(waypoint), city, is_private, url, center, level);

  try {
    const currentTime = new Date(); // 현재 날짜와 시간을 가져옵니다.
    const thumbnail_id = uuid4();

    // 트랜잭션 시작
    await database.query("BEGIN");

    const result = await database.query(
      `WITH new_course AS (
        INSERT INTO running_course_table (course_name, user_id, content, thumbnail_id, created_at, updated_at, liked, distance, viewcount, waypoint, city, is_marathon, is_visible, is_private, center, level)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          RETURNING course_id
      )
      INSERT INTO images_table (course_id, url, is_primary, img_created_at)
      VALUES 
      ((SELECT course_id FROM new_course), $17, $18, $19)
      `,
      [
        course_name,
        user_id,
        content,
        thumbnail_id,
        currentTime,
        currentTime,
        0,
        distance,
        0,
        JSON.stringify(waypoint), // JSON.stringify를 통해 JSON 데이터 형식으로 변환
        city,
        false,
        true,
        is_private,
        JSON.stringify(center),
        level,
        url,
        true,
        currentTime,
      ]
    );

    // 트랜잭션 커밋
    await database.query("COMMIT");

    return res.status(201).json({ message: "Course Created Successfully" });
  } catch (error) {
    // 트랜잭션 롤백
    await database.query("ROLLBACK");
    return res.status(500).json({ error: error.message });
  }
};

