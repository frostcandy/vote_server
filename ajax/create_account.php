<?php
/*************************************************************************
    Copyright 2020 Frost Candy
    Author: Frost Candy
    Description:

    Create the temporary user account. Administrators must approve new system users.
    (Moderators / Watchers)


    Secure Trustworthy Online Voting for All
*************************************************************************/
    $t = time(); $e = '';$n = '';$f = '';

	require_once('../tools.php');
	$tool = new tools();

    $csrf          = $tool->checkCSRF( $tool->rclean($_POST['csrf']) );
	if( $tool->admin['allow_login'] !== 1  ||  $tool->admin['test_mode'] !== 1 || $tool->admin['vote_complete'] !==0 ){ $e = 'login_not_allowed'; }

    $email         = strtolower($tool->rclean($_POST['em']));
    $password      = $tool->rclean($_POST['pw']);
    $fname         = $tool->rclean($_POST['fn']);
    $lname         = $tool->rclean($_POST['ln']);

    $user_data   = $tool->iEncrypt( json_encode( [$email, $password, $fname, $lname]) );

    // Test the data
    if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {                                                     $e = 'err_email';        $f = 'create_login_email';     }
    if (!preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/", $password, $match)) {      $e = 'err_password';     $f = 'create_login_password';  }
    if (strlen($password)>16||strlen($password)<6) {                                                               $e = 'err_password_len'; $f = 'create_login_password';  }
    if (!ctype_alnum($fname) || strlen($fname)<2) {                                                                $e = 'err_fn_len';       $f = 'create_login_firstname'; }
    if (!ctype_alnum($lname) || strlen($lname)<2) {                                                                $e = 'err_ln_len';       $f = 'create_login_lastname';  }

    $password      = password_hash( $password, PASSWORD_BCRYPT, ['cost'=>12]); 
    $email         = $tool->iEncrypt($email);
    $fname         = $tool->iEncrypt($fname);
    $lname         = $tool->iEncrypt($lname);

    // Create the new user
    if( $csrf != '' && $e =='' && $f=='' ){
    	$rq = $tool->db->query('SELECT * FROM `users` LIMIT 1;');
    	if( $rq->num_rows < 1 ){
    		// This is the first user, make them the administrator.
            $rs = $tool->q('INSERT INTO `users` (`c`,`l`,`status`,`password`,`fname`,`lname`,`email`,`parent`,`user_last_ip`) VALUES (?,?,1111,?,?,?,?,0,?);', [$t,$t,$password,$fname,$lname,$email,$_SERVER['REMOTE_ADDR']], 'iisssss');
            if($rs === null){
                $e = 'create_user_fail';
            } else { 
                $n = 'admin_created'; 
                $tool->user = [1111, $tool->iDecrypt($fname), $tool->iDecrypt($lname), $tool->iDecrypt($email)];
                $csrf=$tool->updateCSRF($csrf, 1); 

                // Pre-set empty ballot.
                $tool->db->query('DELETE FROM `vote_meta`;');
                $tool->q('INSERT IGNORE INTO `vote_meta` SET
                    `v_key`              = 1,                 # Vote Meta KEY 
                    `l`                  = ?,                 # Vote Meta Last Modified Date 
                    `v_uid`              = 0,                 # Admin ballot creator uid
                    `v_start_time_utc`   = 0,                 # Vote start time
                    `v_stop_time_utc`    = 0,                 # Vote stop time
                    `v_ballot`           = "{}",              # Ballot Title/Summary/Options 
                    `v_vu_count`         = 0,                 # Total number of vote participants
                    `v_vu_totals`        = 0,                 # Total of each voter option
                    `v_receipt_urls`     = "",                # List of URLS to send receipts to (Poll Watchers)
                    `v_ck_country`       = "US",              # Check Country, empty wont check 2didget, default us for United States
                    `v_ck_city`          = "",                # Check City, empty wont check
                    `v_ck_state`         = "",                # Check State/Reagion, empty wont check
                    `v_ck_zip`           = "",                # Check Zipcode (Check matching start chars matches 11111 and 11111-1234), empty wont check
                    `v_ck_age`           = 18,                # Check Minimum Age (# of years minimum)
                    `v_ck_photo`         = 1,                 # Force voter to give photo 
                    `v_rq_tag`           = NULL,              # Require voter to match this tag
                    `v_rq_voter_id`      = 1,                 # Require voter id card number or code 
                    `v_rq_extra`         = "",                # Require extra information (SS#)
                    `v_show_fname`       = 1,                 # Send Voters First Name
                    `v_show_lname`       = 1,                 # Send Voters Last Name
                    `v_show_mname`       = 1,                 # Send Voters Middle Name
                    `v_show_bdate`       = 1,                 # Send Voters Birthdate 
                    `v_show_street`      = 1,                 # Send Voters Street Address 
                    `v_show_street2`     = 1,                 # Send Voters Street2 Address 
                    `v_show_city`        = 1,                 # Send voters City 
                    `v_show_state`       = 1,                 # Send voters State / Region 
                    `v_show_zip`         = 1,                 # Send voters Postal Code
                    `v_show_country`     = 1,                 # Send voters Country 
                    `v_show_email`       = 1,                 # Send Voters Email
                    `v_show_phone`       = 1,                 # Send Voters Phone 
                    `v_open_vote`        = 1,                 # Anyone can vote - (vote creater will handle verification)
                    `v_running_total`    = 0                  # 1 allow, 0 deny viewing running totals
                ',[$t],'i',1);
            }
    	} else {
    		// Someone else wants to join the server, put them in storage until an administrator allowes them access.
            $rs = $tool->q('INSERT INTO `users_create_hold` (`c`,`h_user_data`) VALUES (?,?);', [$t,$user_data], 'is');
            if($rs === null){ $e = 'create_user_fail'; } else { $n = 'user_waiting_create'; }
    	}
    }
    echo '{"csrf":"'.$csrf.'","e":"'.$e.'","n":"'.$n.'","f":"'.$f.'","u":'.json_encode($tool->user).'}';
?>