<?php
/*************************************************************************
    Copyright 2020 Frost Candy
    Author: Frost Candy
    Description:

    Vote Meta Data Setup
    T1: A Descriptive field everyone can read about the Ballot so people
    the correct people vote in the correct voter precinct.
    --- Example: This vote is for members of precinct 12 in Jonestown, AL 30303

    T2: This is a second description field that only shows up on the voting ballot 
    where you can provide extra information to your voter. 

    This file saves and updates ballot options and settings. 



    Secure Trustworthy Online Voting for All
*************************************************************************/
    $t = time(); $e = '';$n = '';$f = '';$a = 1;$o=[];

	require_once('../tools.php');
	$tool = new tools();

    $csrf          = $tool->checkCSRF( $tool->rclean($_POST['csrf']) );
	if( $tool->admin['allow_login'] !== 1 ||  $tool->admin['test_mode'] !== 1 || $tool->admin['vote_complete'] !==0  ){ $e = 'login_not_allowed'; }
	if( $tool->user[0] < 1111 ){ $e = 'invalid_permission_level'; }

    $a = (int) $_POST['a'];

    $ballot_template = json_decode( '{"t1":"","t2":"","o":[]}' );


	// Allow User Functions
    if( $csrf != '' && $e =='' && $f=='' ){
    	$n = 'success';

        $v_ck_country       = isset($_POST['v_ck_country'])    ? $tool->rclean($_POST['v_ck_country'])          : '';
        $v_ck_city          = isset($_POST['v_ck_city'])       ? $tool->rclean($_POST['v_ck_city'])             : '';
        $v_ck_state         = isset($_POST['v_ck_state'])      ? $tool->rclean($_POST['v_ck_state'])            : '';
        $v_ck_zip           = isset($_POST['v_ck_zip'])        ? $tool->rclean($_POST['v_ck_zip'])              : '';
        $v_ck_age           = isset($_POST['v_ck_age'])        ? $tool->rclean($_POST['v_ck_age'])              : '';
        $v_ck_photo         = isset($_POST['v_ck_photo'])      ? 1                                              : 0;
        $v_rq_tag           = isset($_POST['v_rq_tag'])        ? $tool->rclean($_POST['v_rq_tag'])              : '';
        $v_rq_voter_id      = isset($_POST['v_rq_voter_id'])   ? 1                                              : 0;
        $v_rq_extra         = isset($_POST['v_rq_extra'])      ? $tool->rclean($_POST['v_rq_extra'])            : '';
        $v_show_fname       = isset($_POST['v_show_fname'])    ? 1                                              : 0;
        $v_show_lname       = isset($_POST['v_show_lname'])    ? 1                                              : 0;
        $v_show_mname       = isset($_POST['v_show_mname'])    ? 1                                              : 0;
        $v_show_bdate       = isset($_POST['v_show_bdate'])    ? 1                                              : 0;
        $v_show_street      = isset($_POST['v_show_street'])   ? 1                                              : 0;
        $v_show_street2     = isset($_POST['v_show_street2'])  ? 1                                              : 0;
        $v_show_city        = isset($_POST['v_show_city'])     ? 1                                              : 0;
        $v_show_state       = isset($_POST['v_show_state'])    ? 1                                              : 0;
        $v_show_zip         = isset($_POST['v_show_zip'])      ? 1                                              : 0;
        $v_show_country     = isset($_POST['v_show_country'])  ? 1                                              : 0;
        $v_show_email       = isset($_POST['v_show_email'])    ? 1                                              : 0;
        $v_show_phone       = isset($_POST['v_show_phone'])    ? 1                                              : 0;

        if($a==3){
            // Submit Settings
            $rs = $tool->q('UPDATE `vote_meta` SET 
               	`l`=?,              `v_uid`=?,          `v_ck_country`=?, `v_ck_city`=?,    `v_ck_state`=?,
            	`v_ck_zip`=?,       `v_ck_age`=?,       `v_ck_photo`=?,   `v_rq_tag`=?,     `v_rq_voter_id`=?,
            	`v_rq_extra`=?,     `v_show_fname`=?,   `v_show_lname`=?, `v_show_mname`=?, `v_show_bdate`=?,
            	`v_show_street`=?,  `v_show_street2`=?, `v_show_city`=?,  `v_show_state`=?, `v_show_zip`=?,
            	`v_show_country`=?, `v_show_email`=?,   `v_show_phone`=?
             ;', [$t,               $tool->uid,         $v_ck_country,    $v_ck_city,       $v_ck_state, 
             	  $v_ck_zip,        $v_ck_age,          $v_ck_photo,      $v_rq_tag,        $v_rq_voter_id,
             	  $v_rq_extra,      $v_show_fname,      $v_show_lname,    $v_show_mname,    $v_show_bdate,
             	  $v_show_street,   $v_show_street2,    $v_show_city,     $v_show_state,    $v_show_zip,
             	  $v_show_country,  $v_show_email,      $v_show_phone
             ], 'iissssiisisiiiiiiiiiiii',1);

            if($rs === null){
                $e = 'failure';
            } else {
            	$n = 'ballot_settings_upated';
            }
        }
        if($a==4){
            // Submit Ballot Titles
        	$n = 'ballot_options_upated';
	        $rs = $tool->q('SELECT * FROM `vote_meta` WHERE `v_key` = 1;', [], '');
	        if($rs === null){
	            $e = 'failure';
	        } else {
                $r = $rs->fetch_object();
                $o = (is_null($r->v_ballot)||$r->v_ballot=='') ? $ballot_template : json_decode( $r->v_ballot );
                $o->t1 = $tool->rclean($_POST['t1']);
                $o->t2 = $tool->rclean($_POST['t2']);
                $rs = $tool->q('UPDATE `vote_meta` SET `v_ballot` = ?', [json_encode($o)], 's');
	        }
        }
        if($a==5){
            // Submit Ballot Options
            $n = 'ballot_options_upated';
            $rs = $tool->q('SELECT * FROM `vote_meta` WHERE `v_key` = 1;', [], '');
            if($rs === null){
                $e = 'failure';
            } else {
                $r = $rs->fetch_object();
                $o = (is_null($r->v_ballot)||$r->v_ballot=='') ? $ballot_template : json_decode( $r->v_ballot );
                $op = json_decode( $tool->rclean($_POST['o']) );
                $o->o = ($op!='') ? $op : json_decode("[]");
                $rs = $tool->q('UPDATE `vote_meta` SET `v_ballot` = ?', [json_encode($o)], 's');
            }
        }

        // Pull the vote meta data
        $rs = $tool->q('SELECT * FROM `vote_meta` WHERE v_key = 1;', [], '');
        if($rs === null){
            $e = 'failure';
        } else {
            if( $rs->num_rows > 0 ){
                while ($r=$rs->fetch_object()){
                    $o = [
                        'v_key'                  =>$r->v_key                                   # Vote Meta KEY 
                        ,'l'                     =>$r->l                                       # Vote Meta Last Modified Date
                        ,'v_uid'                 =>$r->v_uid                                   # Admin ballot creator uid
                        ,'v_start_time_utc'      =>$r->v_start_time_utc                        # Vote start time
                        ,'v_stop_time_utc'       =>$r->v_stop_time_utc                         # Vote stop time
                        ,'v_ballot'              =>json_decode($r->v_ballot)                   # Ballot Title/Summary/Options
                        ,'v_vu_count'            =>$r->v_vu_count                              # Total number of vote participants
                        ,'v_vu_totals'           =>$r->v_vu_totals                             # Total of each voter option
                        ,'v_receipt_urls'        =>$r->v_receipt_urls                          # List of URLS to send receipts to (Poll Watchers)
                        ,'v_ck_country'          =>$r->v_ck_country                            # Check Country, empty wont check 2didget, default us for United States
                        ,'v_ck_city'             =>$r->v_ck_city                               # Check City, empty wont check
                        ,'v_ck_state'            =>$r->v_ck_state                              # Check State/Reagion, empty wont check
                        ,'v_ck_zip'              =>$r->v_ck_zip                                # Check Zipcode (Check matching start chars matches 11111 and 11111-1234), empty wont check
                        ,'v_ck_age'              =>$r->v_ck_age                                # Check Minimum Age (# of years minimum)
                        ,'v_ck_photo'            =>$r->v_ck_photo                              # Force voter to share a photo 
                        ,'v_rq_tag'              =>$tool->iDecrypt($r->v_rq_tag)               # Require voter to match this tag
                        ,'v_rq_voter_id'         =>$r->v_rq_voter_id                           # Require voter id card number or code 
                        ,'v_rq_extra'            =>$r->v_rq_extra                              # Require extra information (SS#)
                        ,'v_show_fname'          =>$r->v_show_fname                            # Send Voters First Name
                        ,'v_show_lname'          =>$r->v_show_lname                            # Send Voters Last Name
                        ,'v_show_mname'          =>$r->v_show_mname                            # Send Voters Middle Name
                        ,'v_show_bdate'          =>$r->v_show_bdate                            # Send Voters Birthdate
                        ,'v_show_street'         =>$r->v_show_street                           # Send Voters Street Address 
                        ,'v_show_street2'        =>$r->v_show_street2                          # Send Voters Street2 Address 
                        ,'v_show_city'           =>$r->v_show_city                             # Send voters City 
                        ,'v_show_state'          =>$r->v_show_state                            # Send voters State / Region 
                        ,'v_show_zip'            =>$r->v_show_zip                              # Send voters Postal Code
                        ,'v_show_country'        =>$r->v_show_country                          # Send voters Country 
                        ,'v_show_email'          =>$r->v_show_email                            # Send Voters Email
                        ,'v_show_phone'          =>$r->v_show_phone                            # Send Voters Phone 
                        ,'v_open_vote'           =>$r->v_open_vote                             # Anyone can vote - (vote creater will handle verification)
                        ,'v_running_total'       =>$r->v_running_total                         # 1 allow, 0 deny viewing running totals
                    ];
                    if(!$o['v_rq_tag']){ $o['v_rq_tag'] = ''; }
                    if( is_null($o['v_ballot']) || $o['v_ballot'] == '' ){ $o['v_ballot'] = $ballot_template; }
                }
            }
        }

    }
    echo '{"csrf":"'.$csrf.'","e":"'.$e.'","n":"'.$n.'","f":"'.$f.'","a":'.$a.',"o":'.json_encode($o).'}';

?>
