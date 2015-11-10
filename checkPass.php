<?php // $Id: checkPass.php 23863 2015-09-14 00:27:14Z 1070356 $
  require_once 'functions.php';

  $obj = '';
  if (isset($_POST['nick'])) {
    $nick   = escapeString($_POST['nick']);
    $result = sql("SELECT id, pass, name, mail FROM users WHERE nick='$nick'");
    if ($result->num_rows) {
      $row = $result->fetch_row();
      $obj = '"id":'.$row[0];
      if (isset($_POST['pass']) && checkPass($_POST['pass'], $row[1])) {
        $obj .= ',"name":"'.$row[2].'","mail":"'.$row[3].'"';
      }
    }
    $result->close();
  }
  echo '{'.$obj.'}';
?>
