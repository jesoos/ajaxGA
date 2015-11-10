<?php // $Id: sendPass.php 23863 2015-09-14 00:27:14Z 1070356 $
  require_once 'functions.php';

  if (isset($_POST['id'])) {
    $id = $_POST['id'];
    $result = sql("SELECT mail, name FROM users WHERE id=$id");
    if ($result->num_rows) {
      $row  = $result->fetch_row();
      $pass = sendPass($row[0], $row[1]);  // 비밀번호를 만들어 메일로 보낸다
      if ($pass) {
        $pass = escapeString(getHash($pass));
        sql("UPDATE users SET pass='$pass' WHERE id = $id");
        echo affectedRows();               // 반환 값이 1이면 정상이다
      }
    }
    $result->close();
  }
?>
