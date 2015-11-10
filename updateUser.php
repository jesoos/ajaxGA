<?php // $Id: updateUser.php 23863 2015-09-14 00:27:14Z 1070356 $
  require_once 'functions.php';

  $set = setValue('nick', true,
         setValue('name', true,
         setValue('mail', true, "")));
  if (isset($_POST['pass1'])) {
    $pass = escapeString(getHash($_POST['pass1']));
    if ($set) $set .= ',';
    $set .= "pass='$pass'";
  }
  if ($set && isset($_POST['id'])) {
    sql('UPDATE users SET '. $set .' WHERE id='. $_POST['id']);
    echo affectedRows();  // 반환 값이 1이면 정상이다
  }
?>
