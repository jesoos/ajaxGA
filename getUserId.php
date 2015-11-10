<?php // $Id: getUserId.php 23863 2015-09-14 00:27:14Z 1070356 $
  require_once 'functions.php';
  
  if (isset($_POST['nick'])) {
    $id1    = 0;
    $nick   = escapeString($_POST['nick']);
    $result = sql("SELECT id FROM users WHERE nick='$nick'");
    if ($result->num_rows === 1) {
      $row = $result->fetch_row();
      $id1 = $row[0];
    }
    $result->close();
    echo $id1;
  }
?>
