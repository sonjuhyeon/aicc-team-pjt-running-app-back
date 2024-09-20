## aicc project team2
> 프로젝트 소개
> - team1로부터 의뢰받은 runnging app을 개발
> - 회원가입 후 러닝코스를 등록하고 다른사람과 공유할 수 있는 웹
> - 2030세대에서 러닝에 대한 관심도가 꾸준히 증가하고 있으며 온라인 커뮤니티도 자주 방문하는 세대이므로 2030을 타겟으로 개발한 프로젝트
> - 프로젝트 개발 기간: 2주

---

### 1. 팀소개
- 김민식(팀장)
  - kakao map api를 이용하여 맵과 관련된 핵심 기능들을 구현
  - 의뢰받은 팀과의 커뮤니케이션, 조율 등 프로젝트 전반을 관리
  - [민식님의 깃헙](https://github.com/Noveled)
  - [민식님의 블로그](https://siina.tistory.com)
- 손주현(팀원, 본인)
  - 로그인, 로그아웃 기능 구현
  - 추천코스, 보관함 기능 및 UI 구현
  - [나의 블로그](https://velog.io/@homeless_snail/posts)
- 강민주(팀원)
  - 마이페이지 구현
  - 프로젝트의 전반적인 디자인 구성
  - [민주님의 깃헙](https://github.com/mjk2024-dementia)

---

### 2. 프로젝트에 사용한 기술
- FrontEnd: JavaScript, React
- BackEnd: Node.js
- DB: postgreSql

---

### 3. endpoint 설명
- /delete_course/:courseId -> 코스 삭제
- /delete_user/:userId -> 유저 삭제
- /get_user/:userId -> 로그인한 유저정보
- /get_users -> 전체 유저 정보
- /get_users_join_course -> 전체코스를 유저정보와 함께 가져오기
- /get_user_join_course/:userId -> 한명의 유저가 작성한 코스들을 가져오기
- /get_facilities -> 편의시설 정보
- /upload_image -> 코스 이미지 업로드
- /make_course -> 코스 생성
- /update_course -> 코스 업데이트
- /update_viewcount -> 조회수 업데이트

---

### 4. 추후 업데이트 기능
- 좋아요 기능 추가: 다른사람 코스에 좋아요 버튼을 클릭하면 보관함(즐겨찾기)에서 확인가능
- 검색기능 추가: 제목, 위치, 코스 설명 내용을 바탕으로 검색 기능 구현

---

### 5. 프로젝트 배포
- [프로젝트 배포 사이트(Running Hi)](https://aiccrunningapp.microdeveloper.co.kr)
- [배포과정 정리](https://velog.io/@homeless_snail/deploy-process1)

---

### 6. 시작 가이드
- 요구사항
  - node 20.15.1
  - npm 10.7.0
- 설치
```shell
git clone https://github.com/sonjuhyeon/aicc-team-pjt-running-app-back.git
```
- back-end 설정
  - 루트 디렉토리에 .env 파일을 생성
  - 아래 환경변수 내용을 입력
```
# DB 정보 입력
DB_HOST=<>
DB_USER=<>
DB_PASS=<>
DB_PORT=<>
DB_NAME=<>

SECRET_KEY=<긴 문자열 아무거나 사용>
REACT_APP_MY_DOMAIN = "http://localhost:3000"
KAKAO_API_KEY=<카카오 맵 api key>
```
- DB에 아래 테이블 생성
```sql
-- 유저 테이블 생성
CREATE TABLE users_table (
    user_table_idx SERIAL PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    user_password_hash TEXT NOT NULL,
    user_name TEXT UNIQUE NOT NULL,
    user_email TEXT UNIQUE NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    url TEXT DEFAULT 'https://i.namu.wiki/i/M0j6sykCciGaZJ8yW0CMumUigNAFS8Z-dJA9h_GKYSmqqYSQyqJq8D8xSg3qAz2htlsPQfyHZZMmAbPV-Ml9UA.webp'
);

-- 코스 테이블 생성
CREATE TABLE running_course_table (
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR(40) NOT NULL,
    user_id INT NOT NULL,
    content VARCHAR(500) NOT NULL,
    thumbnail_id TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    liked INT NOT NULL DEFAULT 0,
    distance FLOAT NOT NULL,
    viewcount INT NOT NULL DEFAULT 0,
    waypoint JSON NOT NULL,
    city VARCHAR(20) NOT NULL,
    is_marathon BOOLEAN NOT NULL DEFAULT false,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    is_private BOOLEAN NOT NULL DEFAULT false,
    center JSON NOT NULL,
    level INT NOT NULL
);

CREATE TABLE images_table (
    img_id SERIAL PRIMARY KEY,
    course_id INT,
    url TEXT,
    is_primary BOOLEAN DEFAULT true,
    img_created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- 좋아요 / 즐겨찾기 테이블 생성
CREATE TABLE like (
    id SERIAL PRIMARY KEY,
    course TEXT NOT NULL,
    user_id TEXT NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_and_course UNIQUE(user_id, course_id)
);


-- 편의 시설 테이블 생성
CREATE TABLE facilities_table (
    fac_id SERIAL PRIMARY KEY,
    fac_name VARCHAR(255) NOT NULL,
    location_detail VARCHAR(500),
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    fac_type VARCHAR(100) NOT NULL
);

CREATE TABLE view_table (
    view_id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    course_id INT NOT NULL,
    CONSTRAINT user_and_course UNIQUE(user_id, course_id)
)
```
- 실행
```shell
npm install
npm run dev
```
- front-end
  [front-end github으로 이동 후 시작 가이드 참고](https://github.com/sonjuhyeon/aicc-team-pjt-running-app-front)
  
---

### 7. 아키텍쳐
- backend flow chart
<img width="1161" alt="back flow chart" src="https://github.com/user-attachments/assets/0fa273f2-e6b1-427f-b1b8-2734c702d2c7">

---

### 8. 수정사항
- 한 사람이 같은 코스를 의도적으로 반복클릭하여 조회수를 올리는 경우
  - 해결방법: view_table에서 유저아이디와 코스아이디를 조합하여 유니크로 설정 -> 같은 사람이 같은 코스를 여러번 클릭하더라도 조회수는 한번만 적용
