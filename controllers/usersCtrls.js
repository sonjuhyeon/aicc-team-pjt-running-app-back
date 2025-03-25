const database = require("../database/database");
const bcrypt = require("bcrypt");
const salt = 10;
const jwt = require("jsonwebtoken");

// ----------------------------- GET users -----------------------------
exports.getUser = async (req, res) => {
  const user_id = req.params.userId;
  const query = `SELECT * FROM users WHERE user_id = $1`;

  try {
    const result = await database.query(query, [user_id]);
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  const query = `SELECT * FROM users`;

  try {
    const result = await database.query(query);
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ----------------------------- POST users -----------------------------
exports.postUsers = async (req, res) => {
  try {
    const { user_id, user_name, user_email, password } = req.body;
    const password_hash = await bcrypt.hash(password, salt);

    const query = `
      INSERT INTO users (user_id, user_name, user_password_hash, user_email)
      VALUES ($1, $2, $3, $4)
    `;

    await database.query(query, [user_id, user_name, password_hash, user_email]);

    return res.status(201).json({ message: "Account created Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ----------------------------- LOGIN -----------------------------
exports.userLogin = async (req, res) => {
  const { user_id, password } = req.body;
  const query = `SELECT * FROM users WHERE user_id = $1`;

  try {
    const { rows } = await database.query(query, [user_id]);

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, rows[0].user_password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Password not matched" });
    }

    const name = rows[0].user_id;
    const email = rows[0].user_email;
    const token = jwt.sign({ name, email }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "None",
    });

    return res.status(201).json({ token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ----------------------------- PATCH users -----------------------------

// ----------------------------- DELETE users -----------------------------
exports.deleteUser = async (req, res) => {
  const user_id = req.params.userId;
  const query = `UPDATE users SET user_status = FALSE WHERE user_id = $1`;

  try {
    await database.query(query, [user_id]);
    return res.status(200).json({ message: "User Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Delete User Fail: " + error });
  }
};
