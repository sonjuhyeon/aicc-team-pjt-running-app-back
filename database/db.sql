-- 유저 테이블
CREATE TABLE users (
    user_table_idx SERIAL PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    user_password_hash TEXT NOT NULL,
    user_name TEXT UNIQUE NOT NULL,
    user_email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_url TEXT DEFAULT 'https://i.namu.wiki/i/M0j6sykCciGaZJ8yW0CMumUigNAFS8Z-dJA9h_GKYSmqqYSQyqJq8D8xSg3qAz2htlsPQfyHZZMmAbPV-Ml9UA.webp',
    user_status BOOLEAN DEFAULT TRUE
);

-- 코스 테이블
CREATE TABLE running_courses (
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR(40) NOT NULL,
    user_idx INT NOT NULL, -- FOREIGN KEY
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
	level INT NOT NULL,
    FOREIGN KEY (user_idx) REFERENCES users (user_table_idx) -- 외래 키 설정
);

-- 코스 이미지 테이블
CREATE TABLE course_images (
    img_id SERIAL PRIMARY KEY,
    course_id INT NOT NULL, -- FOREIGN KEY
	img_url TEXT,
	is_primary BOOLEAN DEFAULT true,
	img_created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES running_courses (course_id) -- 외래 키 설정
);


-- 좋아요 / 즐겨찾기 테이블
CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    course_id INT NOT NULL, -- FOREIGN KEY
    user_idx INT NOT NULL, -- FOREIGN KEY
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES running_courses (course_id), -- 외래 키 설정
    FOREIGN KEY (user_idx) REFERENCES users (user_table_idx), -- 외래 키 설정
    CONSTRAINT likes_user_and_course UNIQUE(user_idx, course_id) -- 유저아이디와 코스아이디 조합으로 유니크 설정
);


-- 편의 시설 테이블
CREATE TABLE facilities (
	fac_id SERIAL PRIMARY KEY,
    fac_name VARCHAR(255) NOT NULL,
    location_detail VARCHAR(500),
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
	fac_type VARCHAR(100) NOT NULL
);


-- 코스 조회 수 테이블
CREATE TABLE course_views (
    view_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES running_courses (course_id), -- 외래 키 설정
    FOREIGN KEY (user_id) REFERENCES users (user_table_idx), -- 외래 키 설정
    CONSTRAINT views_user_and_course UNIQUE(user_id, course_id) -- 유저아이디와 코스아이디 조합으로 유니크 설정
)