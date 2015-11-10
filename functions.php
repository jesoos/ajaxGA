<?php // $Id: functions.php 23863 2015-09-14 00:27:14Z 1070356 $

  $dbhost  = 'localhost';
  $dbuser  = 'scott';
  $dbpass  = 'tiger';
  $dbname  = 'ajax';

  $connection = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
  $connection->connect_error and die($connection->connect_error);

  // Sql을 실행한다
  function sql($query) {
    global $connection;
    $result = $connection->query($query) or die($connection->error);
    return $result;
  }

  // 직전에 추가한 autoincrement primary key 값 
  function insertId() {
    global $connection;
    return $connection->insert_id;
  }

  // 직전에 실행한 sql이 처리한 행 수
  function affectedRows() {
    global $connection;
    return $connection->affected_rows;
  }

  // 특수 글자 등을 escape 처리하여 ASCII 글자열로 변환한다
  function escapeString($string) {
    global $connection;
    return $connection->escape_string($string);
  }

  // UPDATE 문에서 사용할 글자열을 만든다 (컬럼 이름, 글자열인가?, 전 글자열)
  function setValue($col, $isString, $s) {
    $t = isset($_POST[$col])? $_POST[$col]: '';
    if ($t) {
      $t = $isString? "'".escapeString($t)."'": $t;
      $t = "$col=$t";
    }
    return $s && $t? $s.','.$t: $s.$t;
  }

  // 비밀번호의 해시 값을 구한다 (비밀번호)
  function getHash($password) {
    $salt = mcrypt_create_iv(16, MCRYPT_DEV_URANDOM);
    return hash_pbkdf2("sha256", $password, $salt, 1000, 16, true).$salt;
  }

  // 비밀번호의 해시 값을 검사한다 (비밀번호, 해시 값)
  function checkPass($password, $hash) {
    return hash_pbkdf2("sha256", $password, substr($hash, 16), 1000, 16, true)
           === substr($hash, 0, 16);
  }

  // 임시 비밀번호를 만든다 (길이)
  function makePass($n) {
    $s = mcrypt_create_iv($n, MCRYPT_DEV_URANDOM);
    for ($i = 0; $i < $n; $i++) {
      $o = ord($s[$i]) & 0x7f;             // ASCII 아닌 글자 제거
      if ( $o < 0x32)         $o += 0x32;  // 0 1 부호 기능문자 제거
      if (($o & 0x1f) > 0x19) $o -= 7;     // Z z 부호 제거
      if (($o & 0x1f) == 0)   $o += 3;     // @ ` 제거
      if ($o == 0x49 || $o == 0x4f || $o == 0x6c || $o == 0x6f) $o--; 
      $s[$i] = chr($o);                    // I O l o 제거
    }
    return $s;
  }

  // 임시 비밀번호를 메일로 전송한다 (메일 주소, 받을 사람 이름)
  function sendPass($mail, $name) {
    $fp = fopen($mail, 'w');
    if ($fp) {
      $pass = makePass(6);
      fwrite($fp, "${name}님, 임시 비밀번호는 ${pass}입니다.");
      fclose($fp);
      return $pass;
    }
    return '';
  }
?>
