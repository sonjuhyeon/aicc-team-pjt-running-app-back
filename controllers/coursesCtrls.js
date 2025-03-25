const database = require("../database/database");
const { v4: uuid4 } = require("uuid");

// ----------------------------- GET courses -----------------------------

// 전체 or 특정 유저의 코스 조회
exports.getCourses = async (req, res) => {
  const userId = req.query.user_id;
  let query;
  let params = [];

  if (userId) { // 특정 유저가 생성한 코스 조회 -> /courses?user_id={id}
    query = `
      SELECT * FROM running_courses
      JOIN course_images ON running_courses.course_id = course_images.course_id
      JOIN users ON users.user_table_idx = running_courses.user_idx
      WHERE running_courses.user_idx = $1 AND is_visible = TRUE
      ORDER BY running_courses.created_at DESC
    `;
    params = [userId];
  } else { // 쿼리 파라미터가 없으면 모든 코스 조회 -> /courses
    query = `
      SELECT * FROM running_courses
      JOIN course_images ON running_courses.course_id = course_images.course_id
      JOIN users ON users.user_table_idx = running_courses.user_idx
      WHERE is_visible = TRUE AND is_private = FALSE
      ORDER BY running_courses.created_at DESC
    `;
  }

  try {
    const result = await database.query(query, params);
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// 특정 코스 정보 가져오기
exports.getCourse = async (req, res) => {
  const course_id = req.params.course_id;
  const query = `
    SELECT * FROM running_courses
    JOIN course_images ON running_courses.course_id = course_images.course_id
    JOIN users ON users.user_table_idx = running_courses.user_idx
    WHERE running_courses.course_id = $1 AND is_visible = TRUE
    ORDER BY running_courses.created_at DESC
  `;

  try {
    const result = await database.query(query, [course_id]);
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ----------------------------- POST courses -----------------------------

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

  try {
    const currentTime = new Date(); // 현재 날짜와 시간을 가져옵니다.
    const thumbnail_id = uuid4();

    // 트랜잭션 시작
    await database.query("BEGIN");

    const result = await database.query(
      `WITH new_course AS (
        INSERT INTO running_courses (course_name, user_id, content, thumbnail_id, created_at, updated_at, liked, distance, viewcount, waypoint, city, is_marathon, is_visible, is_private, center, level)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          RETURNING course_id
      )
      INSERT INTO course_images (course_id, url, is_primary, img_created_at)
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

// ----------------------------- PATCH courses -----------------------------

exports.updateCourse = async (req, res) => {
  const course_id = req.params.courseId;
  const {
    course_name,
    content,
    distance,
    waypoint,
    city,
    is_private,
    url,
    center,
    level,
  } = req.body;
  const thumbnail_id = uuid4();

  const currentTime = new Date(); // 현재 날짜와 시간을 가져옵니다.
  const img_created_at = currentTime;

  // console.log(course_id);
  try {
    const result = await database.query(
      `WITH updated_course AS (
          UPDATE running_courses 
          SET course_name = $1, content = $2, thumbnail_id = $3, updated_at = $4, distance = $5, waypoint = $6, city = $7, is_private = $8, center = $9, level = $10
          WHERE course_id = $13
          RETURNING course_id
      )
      UPDATE course_images 
      SET url = $11, img_created_at = $12
      WHERE course_id = (SELECT course_id FROM updated_course)`,
      [
        course_name,
        content,
        thumbnail_id,
        currentTime,
        distance,
        JSON.stringify(waypoint),
        city,
        is_private,
        JSON.stringify(center),
        level,
        url,
        img_created_at,
        course_id,
      ]
    );

    return res.status(200).json({ message: "Course Updated Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Updated Completed Fail" + error });
  }
};

// ----------------------------- DELETE courses -----------------------------
exports.deleteCourse = async (req, res) => {
  const course_id = req.params.courseId;
  const query = `UPDATE running_courses SET is_visible = FALSE WHERE course_id = $1`;

  try {
    await database.query(query, [course_id]);
    return res.status(200).json({ message: "Course Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Delete Course Failed: " + error });
  }
};
