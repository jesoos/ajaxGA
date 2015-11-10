-- $Id: ajax.sql 23863 2015-09-14 00:27:14Z 1070356 $

CREATE DATABASE IF NOT EXISTS ajax;
use ajax;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id   INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nick VARCHAR(50)  NOT NULL UNIQUE,  -- 아이디
  pass BINARY(32)   NOT NULL,         -- 비밀번호 해시 값
  name VARCHAR(50)  NOT NULL,         -- 이름
  mail VARCHAR(100) NOT NULL          -- 이메일 주소
);
