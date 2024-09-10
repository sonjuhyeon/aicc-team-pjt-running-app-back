const database = require("../database/database");

exports.deleteUser = async (req, res) => {
  const user_id = req.params.userId; // URL 로 부터 courseId 를 받음
  // 요청 URL : http://localhost:8080/delete_user/:userId

  try {
    const result = await database.query(
      `
      DELETE FROM users_table WHERE user_id = $1`,
      [user_id]
    );
    return res.status(200).json({ message: "User Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Delete User Fail" + error });
  }
};
