const database = require("../database/database");

exports.updateViewCount = async (req, res) => {
  const { user_id, course_id } = req.body;
  const client = await database.connect(); // 데이터베이스 클라이언트 연결

  try {
    await client.query("BEGIN"); // 트랜잭션 시작

    // 첫 번째 쿼리: view_table에 데이터 삽입
    await client.query(
      "INSERT INTO view_table (user_id, course_id) VALUES ($1, $2)",
      [user_id, course_id]
    );

    // 두 번째 쿼리: running_course_table의 viewcount 업데이트
    await client.query(
      "UPDATE running_course_table SET viewcount = (SELECT COUNT(*) FROM view_table WHERE course_id = $1) WHERE course_id = $1",
      [course_id]
    );

    await client.query("COMMIT"); // 트랜잭션 커밋
    return res.status(200).json({ message: "View count updated successfully" });
  } catch (error) {
    await client.query("ROLLBACK"); // 에러 발생 시 롤백
    console.error("Database error:", error); // 서버 로그에 에러 메시지 출력
    return res.status(500).json({ error: error.message });
  } finally {
    client.release(); // 데이터베이스 클라이언트 반환
  }
};
