const database = require("../database/database");

exports.deleteCourse = async (req, res) => {
  const course_id = req.params.courseId; // URL 로 부터 courseId 를 받음
  // 요청 URL : http://localhost:8080/delete_course/:courseId

  // 코스 테이블로 부터 is_visible 값만 false 로 변경
  try {
    const result = await database.query(
      `
      UPDATE running_course_table SET is_visible = false WHERE course_id = $1
      `,
      [course_id]
    );
    return res.status(200).json({ message: "Course Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Delete Course Fail" + error });
  }
};
