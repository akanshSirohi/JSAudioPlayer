<?php
$req=$_POST['data'];
if($req=='1') {
  $files=scandir('music/');
  $len=count($files);
  $music="";
  for($i=2; $i<$len; $i++) {
      if($i<$len-1) {
        $music=$music.'music/'.$files[$i].',';
      }else if($i==$len-1){
        $music=$music.'music/'.$files[$i];
      }
  }
  echo $music;
}