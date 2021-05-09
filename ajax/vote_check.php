<?php
/*************************************************************************
    Copyright 2020 Frost Candy
    Author: Frost Candy
    Description:

    After you place your vote on the VOTE SERVER you are given a 7 segment code.
    This file will take your secret password and re-create that 7 segment code. 
    If they match, then there is a high likelyhood the person providing the 
    match is the person who placed that vote. 

    You could use this if you wanted to change or delete a vote if the voter wants
    to change or delete his/her vote. 

    Obvoiusly you would apply any scruitany you see fit to assure that person is
    who they say they are. 

    It is worth noteing that if I use a simple password (12345678), it's possible for
    anyone to type 12345678 into each of the thousands of ballot verifications until they 
    find the ones that match. So you might ignore requests to change ballot information 
    for people who did not provide a strong password. Remember, this is just an extra
    way of providing some verification, it does not mean you should just trust someone
    who got lucky enough to brute-force or guess a voters password.
    

    Secure Trustworthy Online Voting for All
*************************************************************************/
    $t = time(); $e = ''; $o=[];

	require_once('../tools.php');
	$tool = new tools();

    $csrf          = $tool->checkCSRF( $tool->rclean($_POST['csrf']) );

	$a  = isset( $_POST['a'] ) ? (int) $_POST['a'] : 0;

	// Allow User Functions
    if( $csrf != '' && $e =='' ){
    	if( $a == 1 ){
    		// Check the users secret to match their unique key
			$secret   = isset($_POST['s']) ? $tool->rclean($_POST['s'])  : '';
			$pub      = isset($_POST['p']) ? $tool->rclean($_POST['p'])  : '';
			$rnd      = isset($_POST['r']) ? $tool->rclean($_POST['r'])  : '';

			$o["k"]   = isset($_POST['k']) ? (int) $_POST['k'] : 0;
			$o["chk"] = rtrim( chunk_split( strtoupper( md5( $secret . $pub ) ) . $rnd , 6, '-') , '-');
    	}
    }
    echo '{"csrf":"'.$csrf.'","e":"'.$e.'","o":'.json_encode($o).'}';
?>