const database = require("../database/database");
const bcrypt = require("bcrypt");
const salt = 10;
const jwt = require("jsonwebtoken");

exports.postUser = async (req, res) => {
  try {
    const password_hash = await bcrypt.hash(req.body.password, salt);
    const values = [
      req.body.user_id,
      req.body.user_name,
      password_hash,
      req.body.user_email,
    ];

    await database.query(
      "INSERT INTO users_table (user_id, user_name, user_password_hash, user_email) VALUES ($1, $2, $3, $4)",
      values
    );

    return res.status(201).json({ message: "Account created Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { rows } = await database.query(
      "SELECT * FROM users_table WHERE user_id = $1",
      [req.body.user_id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const compare = await bcrypt.compare(
      req.body.password,
      rows[0].user_password_hash
    );

    if (!compare) {
      return res.status(401).json({ message: "Password not matched" });
    }

    const name = rows[0].user_id;
    const email = rows[0].user_email;
    const token = jwt.sign({ name, email }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    }); // 암호화 될 데이터, 비밀키, 잔존기간
    console.log("token", token);
    res.cookie("token", token, {
      httpOnly: true, // 클라이언트에서 쿠키를 자바스크립트로 접근하지 못하게 함
      sameSite: "None", // CORS 상황에서 쿠키가 전달될 수 있도록 설정
    });

    return res.status(201).json({ token: token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
