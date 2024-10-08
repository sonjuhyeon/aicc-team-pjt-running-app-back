const express = require("express"); // express 모듈 불러오기
const http = require("http");
const { spawn } = require("child_process");
const path = require("path");
const cors = require("cors"); // cors 모듈 불러오기
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config();

const PORT = 8080;
const app = express(); // express 모듈을 사용하기 위해 app 변수에 할당
app.use(bodyParser.json());

// // Express 앱을 HTTP 서버로 감싸기
// const server = http.createServer(app);

// // 타임아웃 설정 (예: 5분)
// server.timeout = 300000; // 300,000ms = 300초 = 5분

app.use(express.json());
app.use(cookieParser());

// app.use(cors());
app.use(
  cors({
    origin: `${process.env.REACT_APP_MY_DOMAIN}`,
    credentials: true,
  })
);

app.get("/", (request, response) => {
  try {
    response.send(
      "Running Hi Backend Api Server. test python deploy with node"
    );
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

app.post("/chat", (req, res) => {
  try {
    const sendQuestion = req.body.question;
    const execPython = path.join(__dirname, "bizchat.py");
    const pythonPath = path.join(__dirname, "venv", "bin", "python3");
    // console.log(sendQuestion, execPython, pythonPath);

    //spawn으로 파이썬 스크립트 실행
    //실행할 파일(bizchat.py) 전달
    const net = spawn(pythonPath, [execPython, sendQuestion]);
    let output = "";

    //파이썬 파일 수행 결과를 받아온다
    net.stdout.on("data", function (data) {
      output += data.toString();
    });

    net.on("close", (code) => {
      if (code === 0) {
        res.status(200).json({ answer: output });
      } else {
        res.status(500).send("Something went wrong");
      }
    });

    net.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });
  } catch (error) {
    // 에러 발생 시 500 상태 코드와 에러 메시지를 반환
    console.error("Error occurred:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
    res.send(error);
  }
});

// app.post("/chat", (req, res) => {
//   try {
//     const sendedQuestion = req.body.question;

//     // EC2 서버에서 현재 실행 중인 Node.js 파일의 절대 경로를 기준으로 설정.
//     const scriptPath = path.join(__dirname, "bizchat.py");

//     // ec2 서버에서 실행하는 절대 경로: 개발 테스트 시 사용 불가
//     const pythonPath = path.join(__dirname, "venv", "bin", "python3");

//     // 윈도우 개발 테스트 시 사용하는 절대 경로
//     // const pythonPath = path.join(__dirname, 'venv', 'Scripts', 'python.exe');

//     // Spawn the Python process with the correct argument
//     const result = spawn(pythonPath, [scriptPath, sendedQuestion]);
//     let responseData = "";

//     // Listen for data from the Python script
//     result.stdout.on("data", (data) => {
//       responseData += data.toString();
//     });

//     // Listen for errors from the Python script
//     result.stderr.on("data", (data) => {
//       console.error(`stderr: ${data}`);
//       res.status(500).json({ error: data.toString() });
//     });

//     // Handle the close event of the child process
//     result.on("close", (code) => {
//       if (code === 0) {
//         res.status(200).json({ answer: responseData });
//       } else {
//         res
//           .status(500)
//           .json({ error: `Child process exited with code ${code}` });
//       }
//     });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// });

app.use(require("./routes/getRoutes"));
app.use(require("./routes/postRoutes"));
app.use(require("./routes/putRoutes"));
app.use(require("./routes/deleteRoutes"));
app.use(require("./routes/updateRoutes"));

// 서버 경로 설정 (이미지 업로드 파일 접근)
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => console.log(`server is running on ${PORT}`)); // 서버실행 메세지
