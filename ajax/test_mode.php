<?php
/*************************************************************************
    Copyright 2020 Frost Candy
    Author: Frost Candy
    Description:

    This handles the switch from test mode to live mode
    To return to default test you would have to set the database admin table to:
    allow_login    : 1 
    test_mode      : 1 
    vote_complete  : 0 
    vote_close_uid : NULL 

    Starting a vote will remove ALL data from the last vote. 

    Live mode is meant to be one run and done. You run a live vote and keep the results. 
    Another vote should be done with another installation of the software so you can 
    retain a copy of the live vote in tact. 


    Secure Trustworthy Online Voting for All
*************************************************************************/
    $t = time(); $e = '';$n = '';$f = '';

	require_once('../tools.php');
	$tool = new tools();

    $csrf          = $tool->checkCSRF( $tool->rclean($_POST['csrf']) );

    $a = (int) $_POST['a'];

    // Do not allow login while vote is active, unless test mode for starting a new vote
    if( ( $a < 1 || $a > 2  )                || $tool->admin['allow_login'] !== 1  ){ $e = 'login_not_allowed'; }
    if( $tool->admin['vote_complete'] !==0   && $tool->admin['test_mode']   !== 1  ){ $e = 'login_not_allowed'; }

    // Administrator can stop a test vote on the VOTE SERVER.
    if( $tool->user[0] < 1111 ){ $e = 'invalid_permission_level'; }

	// Enable Live Mode
    if( $csrf != '' && $e =='' && $f=='' ){
        $n = 'success';
        if($a == 1){
            // Start Test Vote Mode
            $tool->q('UPDATE `admin` SET `allow_login` = 0, `test_mode` = 1, vote_complete = 0, vote_close_uid = NULL;', [], '');
        }elseif($a == 2){
            // Start Live Vote Mode
            $tool->q('UPDATE `admin` SET `allow_login` = 0, `test_mode` = 2, vote_complete = 0, vote_close_uid = NULL;', [], '');
        }

        // Clean all vote data. 
        $tool->db->query('TRUNCATE TABLE `voter_ip_list`;');
        $tool->db->query('TRUNCATE TABLE `vote_choice`;');
        $tool->db->query('TRUNCATE TABLE `vote_choice_queue`;');
        $tool->db->query('TRUNCATE TABLE `vote_csrf_tokens`;');
        $tool->db->query('TRUNCATE TABLE `vote_user_approve`;');

        // Delete old ballot files
        if(file_exists('../ballots/ballots.blt')){ unlink('../ballots/ballots.blt'); }
        if(file_exists('../ballots/ballots.bld')){ unlink('../ballots/ballots.bld'); }


    }
    echo '{"csrf":"'.$csrf.'","e":"'.$e.'","n":"'.$n.'","f":"'.$f.'"}';
?>