<?php
#This work is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License.
#More info at http://creativecommons.org/licenses/by-sa/4.0/
#Copyright Owner: Kristoffer Bernssen 2016.. Email: symgi.com@gmail.com Domain: symgi.com
require('config.inc.php');

#phpinfo();

echo'<!DOCTYPE html><html lang="en">';
echo'<head>
  <meta charset="UTF-8">
  <title>NOTE</title>
  <style>fl,.fl{float:left;}
    fr,.fr{float:right;}
    body{
		margin-left:auto;
		margin-right:auto;
		position:relative;background-color:#EBE1E1;
	}
    bu2,.bu2{
        background-color:black;color:#EBE1E1 !important;
    }
    ib,.ib{
        display:inline;
    }
	.bu,bu {
		background-color: #ff6600;
		border: none;
		color: white;
		padding: 2px 2px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
	}
	rb,.rb{
        background-color:#ff3100 !important;
    }
	gb,.gb{
        background-color:#6dff02 !important;
    }
	ggb,.ggb{
        background-color:#9ea78f !important;
    }
	
	.zbg{
		background-color:#35702E !important;
	}
	.zbr{
		background-color:#C42727 !important;
	}
	.zbb{
		background-color:#385EC7 !important;
	}
	.zby{
		background-color:#D6C800 !important;
	}
	.zbgo{
		background-color:#FFD700 !important;
	}
	.zbp{
		background-color:#E38DB5 !important;
	}
	.zbl{
		background-color:#7AC74E !important;
	}
	.zbw{
		background-color:#FFFFFF !important;
	}
	.zbbr{
		background-color:#A0522D !important;
	}
	
	.nicEdit-panel {
        background-color: #EBE1E1 !important;
	}
 
	.bt {
		display: inline-block;
		-webkit-box-shadow: 0px 1px 0px #61b5ff inset, 0px 1px 1px 0px #bdbdbd;
		-moz-box-shadow: 0px 1px 0px #61b5ff inset, 0px 1px 1px 0px #bdbdbd;
		box-shadow: 0px 1px 0px #61b5ff inset, 0px 1px 1px 0px #bdbdbd;
		-webkit-border-radius: 15px;
		-moz-border-radius: 15px;
		border-radius: 15px;
		text-shadow: 0px -1px 0px #004d80;
		padding: 2px 8px;
		border-color: #4081AF;
		border-width: 1px;
		border-style: solid;
		font-size: 15x;
		font-weight: bold;
	}
	.bt:hover {
		border-color: #ffffff;
	}
	.bt:active {
		-webkit-box-shadow: 0px 0px 15px #001a47 inset;
		-moz-box-shadow: 0px 0px 15px #001a47 inset;
		box-shadow: 0px 0px 15px #001a47 inset;
	}
	.sb:hover {
		border-color: #ffffff;
	}
  </style>';
if(isset($_POST['pd'])){
	$passwd=$_POST['pd'];
	$par=str_split($passwd,(strlen($passwd)/2)+1);
	$thpwd= hash('sha512', $par[0].$pwdbread.$par[1]);
	$stmtlo = $db->prepare('SELECT * FROM users where email=:email and password=:password limit 0,1');
	$stmtlo->bindParam(':email', $_POST['ud'], PDO::PARAM_STR);
	$stmtlo->bindParam(':password', $thpwd, PDO::PARAM_STR);
	try {$stmtlo ->execute();} catch(PDOException $ex) {echo $ex->getMessage();}
	$thelo = $stmtlo->fetchAll(PDO::FETCH_ASSOC);
	$uid=$thelo[0]['uid'];
	if(!empty($uid)){
		
		$stmtlos = $db->prepare('INSERT INTO sessions (uid,sid,hostname) VALUES (:uid,:sid,:hostname) ON DUPLICATE KEY UPDATE hostname=:hostname2,sid=:sid2');
		$stmtlos->bindParam(':uid', $uid, PDO::PARAM_INT);
		$stmtlos->bindParam(':sid', $a, PDO::PARAM_STR);
		$stmtlos->bindParam(':sid2', $a, PDO::PARAM_STR);
		$stmtlos->bindParam(':hostname', $remoteaddr, PDO::PARAM_STR);
		$stmtlos->bindParam(':hostname2', $remoteaddr, PDO::PARAM_STR);
		try {$stmtlos ->execute();} catch(PDOException $ex) {echo $ex->getMessage();}
		$readytologin=1;
	}else{$wrong=1;}
	
}else{$readytologin=1;}

if(isset($readytologin)){
	$stmtse = $db->prepare('SELECT * FROM sessions where sid=:sid');
	$stmtse->bindParam(':sid', $a, PDO::PARAM_STR);
	try {$stmtse ->execute();} catch(PDOException $ex) {echo $ex->getMessage();}
	$thelos = $stmtse->fetchAll(PDO::FETCH_ASSOC);
	$uidlos=$thelos[0]['uid'];
	
	$stmtlo = $db->prepare('SELECT * FROM users where uid=:uid limit 0,1');
	$stmtlo->bindParam(':uid', $uidlos, PDO::PARAM_INT);
	try {$stmtlo ->execute();} catch(PDOException $ex) {echo $ex->getMessage();}
	$thelo = $stmtlo->fetchAll(PDO::FETCH_ASSOC);
	$uid=$thelo[0]['uid'];
	$ud=$thelo[0]['uds'];
	$email=$thelo[0]['email'];
	$activated=$thelo[0]['active'];
	if($activated!=1){
		if(isset($_POST['ac'])){
		$activationcode=$thelo[0]['activationcode'];
		if(($_POST['ac']==$activationcode)&&($email==$_POST['em'])){
			$stmtloa = $db->prepare('update users set active=1 where uid=:uid');
			$stmtloa->bindParam(':uid', $uid, PDO::PARAM_INT);
			try {$stmtloa ->execute();} catch(PDOException $ex) {echo $ex->getMessage();}
			$activated=1;
			mkdir('uploads/'.$ud);
		}
	}}
}
if(empty($uid)){
	echo'</header>';
	if(isset($wrong)){'Access denied.<br>Wrong password?<br>';}
	if(!isset($_GET['register'])){
		echo '<form action="index.php" method="post" class="ib">
	<input type="text" name="ud" placeholder="eMail">
	<input type="password" name="pd" placeholder="Password">
	<input type="submit" value="Login" class="bt bu zbb">
	</form>
	<br><br>
	<a href="?register" class="bt bu">Or Go Here To Register</a>';
	}else{
		echo '<form action="index.php" method="post" class="ib">
	<input type="text" name="mailr" placeholder="eMail">
	<input type="password" name="passr" placeholder="Password">
	<input type="submit" value="Register"  class="bt bu"></form>';
	}
}elseif($activated!=1){
	echo '<form action="index.php" method="post" class="ib">
	<input type="text" name="ac" placeholder="Activation code">
	<input type="hidden" name="em" value="'.$email.'">
	<input type="submit" value="Activate"></form>';
}elseif(isset($_GET['logout'])){
	$stmtlos = $db->prepare('DELETE FROM sessions where uid=:uid and sid=:sid');
	$stmtlos->bindParam(':uid', $uid, PDO::PARAM_INT);
	$stmtlos->bindParam(':sid', $a, PDO::PARAM_STR);
	try {$stmtlos ->execute();} catch(PDOException $ex) {echo $ex->getMessage();}
	echo'<a href="">Your now logged out.<br>Click here to go back.</a>';
}else{
	$quota=$thelo[0]['quota'];
	$_SESSION['RF']['subfolder']=$ud;
/*
	$passwd=$_POST['newp'];
	$par=str_split($passwd,(strlen($passwd)/2)+1);
	$thpwd= hash('sha512', $par[0].$pwdbread.$par[1]);
	
	$oldpwd=$_POST['oldp'];
	$oldpwd2=str_split($oldpwd,(strlen($oldpwd)/2)+1);
	$oldpwd2=hash('sha512', $par[0].$pwdbread.$par[1]);
*/

$rand=rand(1000000, 9999999);
if(isset($_POST['title'])){
    
    $thenote=$_POST['editor'];
    $thetitle=$_POST['title'];
    $thenid=$_POST['nid'];
    $thenewcategory=$_POST['newcategory'];
    $theoldcategory=$_POST['category'];
    if(!empty($thenewcategory)){
        $stmt4 = $db->prepare("INSERT INTO categories (category) VALUES (:category);");
        $stmt4->bindParam(':category', $thenewcategory, PDO::PARAM_STR);
			try {$stmt4 ->execute();} catch(PDOException $ex) {echo $ex->getMessage();}
            $thecategory=$thenewcategory;
    }else{$thecategory=$theoldcategory;}
    $stmt5 = $db->prepare('SELECT cid FROM categories where category=:category limit 0,1');
    $stmt5->bindParam(':category', $thecategory, PDO::PARAM_STR);
    try {$stmt5 ->execute();} catch(PDOException $ex) {echo $ex->getMessage();}
    $thecat = $stmt5->fetchAll(PDO::FETCH_ASSOC);
    $gettingcid=$thecat[0]['cid'];
    $stmt = $db->prepare("INSERT INTO notes (nid,title,note,cid) VALUES (:nid,:title,:note,:cid) ON DUPLICATE KEY UPDATE title=:title2,note=:note2,cid=:cid2;");
    $stmt->bindParam(':nid', $thenid, PDO::PARAM_INT);
    $stmt->bindParam(':title', $thetitle, PDO::PARAM_STR);
    $stmt->bindParam(':note', $thenote, PDO::PARAM_STR);
    $stmt->bindParam(':title2', $thetitle, PDO::PARAM_STR);
    $stmt->bindParam(':note2', $thenote, PDO::PARAM_STR);
    $stmt->bindParam(':cid', $gettingcid, PDO::PARAM_STR);
    $stmt->bindParam(':cid2', $gettingcid, PDO::PARAM_STR);
    try {$stmt ->execute();} catch(PDOException $ex) {echo $ex->getMessage();}
}
preg_match('/^\/?([^\/]*).*/i',$_SERVER['SCRIPT_NAME'],$match);
$dir=$match[1];

  $back_colors=array("zbg","zbr","zbb","zby","zbgo","zbp","zbl","zbw","zbbr");
  if(isset($_GET['ck'])){
    $editor='&ck';$changeeditor='<a class="bt fr bu" href="?'.$rand.'">TinyMCE</a> <a class="bt fr bu rb" href="?'.$rand.'&ne">nicEdit</a> ';
    #	<script src="ckeditor/samples/js/sample.js"></script>
    #<link rel="stylesheet" href="ckeditor/samples/css/samples.css">
	#<link rel="stylesheet" href="ckeditor/samples/toolbarconfigurator/lib/codemirror/neo.css">
	
    # config.skin = 'v2';
    echo'	<script type="text/javascript" src="ckeditor/ckeditor.js"></script>
	<script type="text/javascript" src="ckeditor/samples/js/jquery-2.2.3.min.js"></script>
    
    <script type="text/javascript">$(document).ready(function () {
    var loc = window.location.pathname;
    var dir = loc.substring(0, loc.lastIndexOf("/"));
    var roxyFileman = dir + "/fileman/index.html";
    UPLOADCARE_PUBLIC_KEY = "tinynote";
    var editorElem = document.getElementById("thebody");
CKEDITOR.replace( "editor", {
    height: "100%",
    width: "100%",
	extraPlugins: \'autosave\',
    contentsCss : "body{background-color:#EBE1E1;}",
    filebrowserBrowseUrl : "/'.$dir.'/filemanager/dialog.php?type=2&editor=ckeditor&fldr=",


	removeDialogTabs: "link:upload;image:Upload",
    on :
   {
      // Maximize the editor on start-up.
      "instanceReady" : function( evt )
      {
        evt.editor.resize("100%", editorElem.clientHeight);
      }
   }
    });

});
    </script>';
  }elseif(isset($_GET['ne'])){
	$editor='&ne';$changeeditor='<a class="bt fr bu" href="?'.$rand.'">TinyMCE</a> <a class="bt fr bu rb" href="?'.$rand.'&ck">CKEditor</a> ';
	echo'
<script src="nicedit/nicEdit.js" type="text/javascript"></script>
<script>var area1, area2;

function toggleArea1() {
	if(!area1) {
		area1 = new nicEditor({fullPanel : true,iconsPath : "/nn/nicedit/nicEditorIcons.gif"}).panelInstance("editor",{hasPanel : true});
	} else {
		area1.removeInstance("editor");
		area1 = null;
	}
}

function addArea2() {
	area2 = new nicEditor({fullPanel : true,iconsPath : "/nn/nicedit/nicEditorIcons.gif"}).panelInstance("editor");
}
function removeArea2() {
	area2.removeInstance("editor");
}

bkLib.onDomLoaded(function() { toggleArea1(); });</script>';
  }else{
	
    $changeeditor='<a class="bt fr bu" href="?'.$rand.'&ck">CKEditor</a> <a class="bt fr bu rb" href="?'.$rand.'&ne">nicEdit</a> ';#jbimages
    echo'<script src="tinymce/tinymce.min.js"></script>
  <script type="text/javascript">
  
(function(dir) {
var loc = window.location.pathname;
    var dir = loc.substring(0, loc.lastIndexOf("/"));
  tinymce.init({
  height: 570,
  theme: "modern",
  plugins: [
    "advlist autolink lists link image charmap print preview hr anchor pagebreak",
    "searchreplace wordcount visualblocks visualchars code fullscreen",
    "insertdatetime media nonbreaking save table contextmenu directionality",
    "emoticons template paste textcolor colorpicker textpattern imagetools tinysymbols paste responsivefilemanager"
  ],
  toolbar1: "insertfile undo redo  paste| styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image responsivefilemanager media | forecolor backcolor emoticons | s1 s2 s3 s4 s5 s6 s7 s8 s9 | print preview",
  image_advtab: true,
  force_br_newlines : true,
  force_p_newlines : false,
  relative_urls : false,
  external_filemanager_path:"/'.$dir.'/filemanager/",
   filemanager_title:"Responsive Filemanager" ,
   external_plugins: { "filemanager" : "/'.$dir.'/filemanager/plugin.min.js"},
  selector: "textarea",
  templates: [
    { title: "Test template 1", content: "Test 1" },
    { title: "Test template 2", content: "Test 2" }
  ]
 });

 
 function ajaxfilemanager(field_name, url, type, win) {
			var ajaxfilemanagerurl = "fm/jscripts/tiny_mce/plugins/ajaxfilemanager/ajaxfilemanager.php";
			var view = "detail";
			switch (type) {
				case "image":
				view = "thumbnail";
					break;
				case "media":
					break;
				case "flash": 
					break;
				case "file":
					break;
				default:
					return false;
			}
            tinyMCE.activeEditor.windowManager.open({
                url: "fm/jscripts/tiny_mce/plugins/ajaxfilemanager/ajaxfilemanager.php?view=" + view,
                width: 782,
                height: 440,
                inline : "yes",
                close_previous : "no"
            },{
                window : win,
                input : field_name
            });
            
/*            return false;			
			var fileBrowserWindow = new Array();
			fileBrowserWindow["file"] = ajaxfilemanagerurl;
			fileBrowserWindow["title"] = "Ajax File Manager";
			fileBrowserWindow["width"] = "782";
			fileBrowserWindow["height"] = "440";
			fileBrowserWindow["close_previous"] = "no";
			tinyMCE.openWindow(fileBrowserWindow, {
			  window : win,
			  input : field_name,
			  resizable : "yes",
			  inline : "yes",
			  editor_id : tinyMCE.getWindowArg("editor_id")
			});
			
			return false;*/
		}
 
 
})();
</script>';
  }
  echo'
</head>
<body id="thebody" style="height:650px;">';

$bytestotal = 0;

$path = realpath($_SERVER['DOCUMENT_ROOT'].'/nn/uploads/'.$ud);
if($path!==false){
	foreach(new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS)) as $object){
		$bytestotal += $object->getSize();
	}
}

if(!isset($_GET['s'])){
echo'<form action="index.php?'.$editor.'" method="post" class="ib">';
if(isset($_GET['n'])){
    $getnid=addslashes($_GET['n']);
    $stmt3 = $db->prepare('SELECT * FROM notes where nid=:nid limit 0,1');
    $stmt3->bindParam(':nid', $getnid, PDO::PARAM_INT);
	try {$stmt3 ->execute();} catch(PDOException $ex) {echo $ex->getMessage();}
    
    $thenote = $stmt3->fetchAll(PDO::FETCH_ASSOC);
    $gettingnote=$thenote[0]['note'];
    $gettingtitle=$thenote[0]['title'];
    $gettingcid=$thenote[0]['cid'];
}
echo'
<input type="hidden" name="nid" value="'.$getnid.'">
<input type="text" name="title" placeholder="Title" value="'.$gettingtitle.'">';

$stmt2 = $db->prepare('SELECT nid,title,category,categories.cid as cid FROM notes left join categories on categories.cid = notes.cid order by category,title');
try {$stmt2 ->execute();} catch(PDOException $ex) {echo $ex->getMessage();}
$listnotes = $stmt2->fetchAll(PDO::FETCH_ASSOC);

  $stmt6 = $db->prepare('SELECT * FROM categories order by category');
try {$stmt6 ->execute();} catch(PDOException $ex) {echo $ex->getMessage();}
$listnotes2 = $stmt6->fetchAll(PDO::FETCH_ASSOC);
$categories=array();
foreach($listnotes2 as $notetitle){
    $categories[$notetitle['cid']]=$notetitle['category'];
}

echo'<select name="n" onchange="javascript:location.href = \'?'.$editor.'&r='.$rand.'&n=\'+ this.value;" class="bu rb sb">';
#$back_colors[1]; 0-7
$coln=0;
foreach($listnotes as $notetitle){
    $selectboxcid=$notetitle['cid'];
    if(!isset($didemptyid)&&empty($selectboxcid)){$didemptyid=1;echo '<option>Uncategorized</option>';}
    elseif($tmpcid!=$selectboxcid){
		if($coln==8){$coln=0;}
		$tmpcid=$selectboxcid;
		echo '</select><select class="sb bu '.$back_colors[$coln].'" name="n" onchange="javascript:location.href = \'?'.$editor.'&r='.$rand.'&n=\' + this.value;"><option>'.$categories[$selectboxcid].'</option>';
		++$coln;
	}
    echo '<option value="'.$notetitle['nid'].'">'.$notetitle['title'].'</option>';
}
echo'</select>'.$changeeditor.'<br>
  <textarea name="editor" id="editor" style="height:100%;width:100%;">';
if(isset($gettingnote)){
    echo $gettingnote;
}
echo'</textarea><select name="category" class="sb"><option>Category</option>';

foreach($categories as $cid => $category){
    #print_r($notetitle);
    if($gettingcid==$cid){$cidmatch=' selected';}elseif(isset($cidmatch)){unset($cidmatch);}
    echo '<option value="'.$category.'"'.$cidmatch.'>'.$category.'</option> ';
}
$using=round($bytestotal /1000000);
$quotadiv=($quota);
  echo'</select><input type="text" name="newcategory" placeholder="Or: New Category"><input type="submit" value="Save Note" class="bt bu"><x class="fr"><a class="bt bu rb" href="?logout">Logout</a> '.round($quotadiv-$using,2).'/'.$quotadiv.'MB Free</x></form>
  ';
  
}else{$foundsearch=1;echo'<a class="bu gbb" href="?'.$rand.'">Home</a>';}
echo'
<form action="index.php" method="get" class="ib"><input type="text" name="s" placeholder="Search"><input class="bt bu zbb" type="submit" value="Search"></form>';
if(isset($foundsearch)){
    $searchterm=$_GET['s'];echo'<br>';
    $stmt7 = $db->prepare('SELECT * FROM notes left join categories on notes.cid=categories.cid  where note rlike :searchterm order by title');
    $se4=$searchterm;
	require('advancedsearch.php');
	$searchterm=$sr;
    $stmt7->bindParam(':searchterm', $searchterm, PDO::PARAM_STR);
    
    try {$stmt7 ->execute();} catch(PDOException $ex) {echo $ex->getMessage();}
    $rowcount=$stmt7->rowCount();
	echo'<div>';
    if($rowcount>0){echo'<u><b>Results</b></u><br>';
		$listnotes3=$stmt7->fetchAll(PDO::FETCH_ASSOC);
		
		foreach($listnotes3 as $notetitle){
			$category=$notetitle['category'];
			if(!empty($category)&&$category!=$category_t){
				if(isset($didfirstcat)){echo'<br>';}
				$didfirstcat=1;$category_t=$category;
				echo'<u>'.$category.'</u><br>';
			}#$notetitle['cid']
			elseif(!isset($didemptycat)&&empty($category)){
				if(isset($didfirstcat)){echo'<br>';}
				echo'<u class="ggb">Uncategorized</u><br>';$didemptycat=1;
				}
			echo '<a href="?r='.$rand.'&n='.$notetitle['nid'].'" class="bu">'.$notetitle['title'].'</a> ';
		}
	}else{echo'No results.';}
    echo'</div></center>';
}

}
echo'</body>
</html>';
unset($db);
?>