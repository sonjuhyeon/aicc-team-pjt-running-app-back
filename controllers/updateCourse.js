const database = require("../database/database");
const { v4: uuid4 } = require("uuid");

exports.updateCourse = async (req, res) => {
  // const course_id = req.params.courseId;
  const {
    course_id,
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
          UPDATE running_course_table 
          SET course_name = $1, content = $2, thumbnail_id = $3, updated_at = $4, distance = $5, waypoint = $6, city = $7, is_private = $8, center = $9, level = $10
          WHERE course_id = $13
          RETURNING course_id
      )
      UPDATE images_table 
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
