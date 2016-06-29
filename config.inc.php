<?php
#Copyright (C) 2011 Kristoffer Bernssen
#This work is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License.
#More info at http://creativecommons.org/licenses/by-sa/4.0/
$username='tinynotebook';$password='demopassword1234';$database='tinynotebook';$database_host='127.0.0.1';$pwdbread='skDG@aADF@ls3l23krk@_2fk3fk3kf_2J323';
$db = new PDO('mysql:host='.$database_host.';dbname='.$database.';charset=utf8', ''.$username.'', ''.$password.'');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_ORACLE_NULLS, PDO::NULL_EMPTY_STRING);
$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, FALSE);
$password='fs3SadhGFar4gd21';$username='sql';
$a=session_id();if(empty($a)){ session_name('tinynote');session_start();$a=session_id();}
if(!empty($_SERVER['HTTP_X_REMOTE_ADDR'])){$remoteaddr=addslashes($_SERVER['HTTP_X_REMOTE_ADDR']);}
else{$remoteaddr=addslashes($_SERVER['REMOTE_ADDR']);}
?>
