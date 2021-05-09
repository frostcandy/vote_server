<?php
/*************************************************************************
  Copyright 2020 Frost Candy
  Author: Frost Candy
  Description:

  This is the main landing page for the project. 

  Secure Trustworthy Online Voting for All
*************************************************************************/

	// Start execution clock
	$exestart = microtime(true);

	// require dependancies
	require_once('tools.php');
	$tool = new tools();
  $csrf = $tool->setCSRF();

  // Pull the current ballot meta data
  $ballot       = '{}';
  $ballot_meta  = '{}';
  $rs           = $tool->q('SELECT * FROM `vote_meta` WHERE `v_key` = 1;', [], '');
  if($rs !== null){
      $r           = $rs->fetch_object();
      $ballot      = $r->v_ballot;
      $ballot_meta = '{"co":"' . $r->v_ck_country    . '",'
                     .'"ci":"' . $r->v_ck_city       . '",'
                     .'"st":"' . $r->v_ck_state      . '",'
                     .'"zi":"' . $r->v_ck_zip        . '",'
                     .'"ag":"' . $r->v_ck_age        . '",'
                     .'"ph":"' . $r->v_ck_photo      . '",'
                     .'"ta":"' . $r->v_rq_tag        . '",'
                     .'"vi":"' . $r->v_rq_voter_id   . '",'
                     .'"ve":"' . $r->v_rq_extra      . '"'
                     .'}';
  }

  // Show everyone the working directory
  try {
    $cwd = getcwd();
  }catch(Exception $e) {
    $cwd = 'Could not find the working directory.';
  }

  // Show everyone who is listening on https default port
  try {
    ob_start();
    passthru("netstat -tulpn | grep :443");
    $netstat = ob_get_clean();
    $netstat = str_replace("\n", "\\n", $netstat);
  }catch(Exception $e) {
    $netstat = 'Netstat failed, did you install net-tools?';
  }

  // Show location of the NGINX we are using
  try {
    ob_start();
    passthru("whereis nginx");
    $whereNGINX = ob_get_clean();
    $whereNGINX = str_replace("\n", "\\n", $whereNGINX);
  }catch(Exception $e) {
    $whereNGINX = 'Could not find location of NGINX';
  }


// Check if voter is over and if ballot file exists
if( $tool->admin["vote_complete"] == 1 && !file_exists( 'ballots/ballots.blt' ) ){
  // Create the ballot file 
  $bfile  = fopen("ballots/ballots.blt", "w") or die("Unable to open file!");
  $barray = [];
  $bq     = $tool->q('SELECT * FROM `vote_choice`', [], '');
  if($bq  !== null && $bq->num_rows > 0){
      while($brow   = $bq->fetch_object()){
          $ba        = new stdClass();
          $ba->k     = $brow->vc_vid;
          $ba->c     = $tool->iDecrypt($brow->vc_choice);
          $barray[]  = $ba;
      }
  }
  fwrite($bfile, json_encode($barray));
  fclose($bfile);
}
// Check if voter is over and if ballot meta data exists
if( $tool->admin["vote_complete"] == 1 && !file_exists( 'ballots/ballots.bld' ) ){
  // Create the ballot meta data file 
  $bfile  = fopen("ballots/ballots.bld", "w") or die("Unable to open file!");
  $bdata  = '';
  $bq     = $tool->q('SELECT * FROM `vote_meta` WHERE `v_key` = 1', [], '');
  if($bq  !== null && $bq->num_rows > 0){
      $brow   = $bq->fetch_object();
      $bdata  = $brow->v_ballot;
  }
  fwrite($bfile, $bdata);
  fclose($bfile);
}


//-------------------------------------------------------------------------
// The HTML page output
echo '<!doctype html>
<html lang="en" dir="ltr">
<head>
  <title>FrostCandy Votes</title>

  <link rel="icon"          href="favicon.ico" type="image/x-icon">
  <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">

  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="referrer" content="no-referrer">
  <meta name="robots" content="noindex,nofollow">
  <meta name="description" content="Trust your vote. We want to make voting more secure and available to everyone.">

  <script> 
       console.log("Secure Trustworthy Online Voting for All - by Frost Candy"); 
       var csrf           ="'.$csrf.'";
       var user           = [];
       var admin          = ['.implode(',',$tool->admin).'];
       var exestart       = '.$exestart.';
       var exestop        = '.microtime(true).';
       var image_max_size = '.$tool->config["image_max_size"].';
       var ballot         = '.$ballot.';
       var ballot_meta    = '.$ballot_meta.';
       console.log( "Execution Time: " + ((exestop-exestart)*1000).toPrecision(4) + "ms"); 

       console.log("");
       console.log(" ****** S E C U R I T Y ****** C H E C K S ******");
       console.log("");
       console.log("Working Directory:");
       console.log("'.strip_tags($cwd).'");

       console.log("");
       console.log("Netstat to show who is listening on port 443:");
       console.log("'.strip_tags($netstat).'");

       console.log("");
       console.log("NGINX Location:");
       console.log("'.strip_tags($whereNGINX).'");

       console.log("");
       console.log("Show me the code!");
       console.log("'.strip_tags( $tool->config["vote_view_url"] ).'");

       console.log("");
       console.log("Show me the NGINX setup!");
       console.log("'.strip_tags( $tool->config["nginx_view_url"] ).'");


  </script>
  <script src="vote.js"></script>
</head>
<body onload="init();">
	<div id="fc_header">
		<div class="fc_logo"><span>vote.</span><span>Frost</span><span>Candy</span><span>.com</span></div>
		<div id="top_menu">
    		<div id="end_test_vote" class="btnred noselect floatright">End Test</div>
			<div id="ilogin" class="btn noselect">Log In</div>
			<div id="ilogout" class="btn noselect">Log Out</div>
		    <div id="iHome" class="btn noselect">Home</div>
		</div>
	</div>
	<div id="content_box"></div>
    <div id="errnote"><div id="errtext"></div><div class="errclose"></div></div>
</body>
</html>';


?>