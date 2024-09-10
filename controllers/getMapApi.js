require("dotenv").config(); // .env 파일 사용 설정

exports.getMapApi = async (req, res) => {
  const KAKAO_API_KEY = process.env.KAKAO_API_KEY;
  console.log(KAKAO_API_KEY);
  try {
    res.json({ key: KAKAO_API_KEY });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
