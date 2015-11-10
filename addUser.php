<?php // $Id: addUser.php 23863 2015-09-14 00:27:14Z 1070356 $
  require_once 'functions.php';

  if (isset($_POST['nick']) && isset($_POST['pass1']) &&
      isset($_POST['name']) && isset($_POST['mail'])) {
    $pass = escapeString(getHash($_POST['pass1']));
    $nick = escapeString($_POST['nick']);
    $name = escapeString($_POST['name']);
    $mail = escapeString($_POST['mail']);
    sql("INSERT INTO users VALUES(null, '$nick', '$pass', '$name', '$mail')");
    echo insertId();
  }
?>
