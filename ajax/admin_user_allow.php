<?php
/*************************************************************************
    Copyright 2020 Frost Candy
    Author: Frost Candy
    Description:

    Administrator allows new users and sets privileges


    Secure Trustworthy Online Voting for All
*************************************************************************/
    $t = time(); $e = '';$n = '';$f = '';$nusers=[];$ousers=[];$party=[];

	require_once('../tools.php');
	$tool = new tools();

    $csrf          = $tool->checkCSRF( $tool->rclean($_POST['csrf']) );
	if( $tool->admin['allow_login'] !== 1  ||  $tool->admin['test_mode'] !== 1 || $tool->admin['vote_complete'] !==0 ){ $e = 'login_not_allowed'; }
	if( $tool->user[0] < 1110 ){ $e = 'invalid_permission_level'; }

	$x  = (int) $_POST['a'];                                   // Action Number
	$k  = isset($_POST['k'])?(int) $_POST['k']:0;              // User Key
	$st = isset($_POST['st'])?(int) $_POST['st']:0;            // User Status 1000 - watcher 1100 moderator - 1110 moderator with add user abilty - 1111 full administrator
	$pa = isset($_POST['pa'])?$tool->rclean($_POST['pa']):'0'; // User Part

	if($x==2 && $st!=1000 && $st!=1100 && $st!=1110 && $st!=1111 ){ $e = 'invalid_permission_set'; }
	if($x==2 && $st > 1110 && $tool->user[0]<1111 ){ $e = 'invalid_permission_set'; }
	if($x==2 && $pa == '0' || $pa == ''){ $e = 'invalid_party'; }

	// Allow User Functions
    if( $csrf != '' && $e =='' && $f=='' ){
    	if($x>0 || $x<5){
	    	$n = 'success';
	    	$rq = false;
	    	if($x==2||$x==3){
	    		// Pull User Data
	    		$rq = $tool->q('SELECT * FROM `users_create_hold` WHERE `h_key` = ?;', [$k], 'i');
	    		// Delete user from holding table
	    		$tool->q('DELETE FROM `users_create_hold` WHERE `h_key` = ?;', [$k], 'i');
		    	$n = 'user_removed';

	    	}
	    	if($x==2&&$rq){
	    		// Create the new administrator 
				$r = $rq->fetch_object();
            	$mu = json_decode( $tool->iDecrypt($r->h_user_data) );

			    $mu[1]         = password_hash( $mu[1], PASSWORD_BCRYPT, ['cost'=>12]); 
			    $mu[0]         = $tool->iEncrypt($mu[0]);
			    $mu[2]         = $tool->iEncrypt($mu[2]);
			    $mu[3]         = $tool->iEncrypt($mu[3]);

	            $rs = $tool->q('INSERT INTO `users` (`c`,`l`,`status`,`password`,`fname`,`lname`,`email`,`parent`,`user_last_ip`,`party`) VALUES (?,?,?,?,?,?,?,?,?,?);', [$t,$t,$st,$mu[1],$mu[2],$mu[3],$mu[0],$tool->uid,$_SERVER['REMOTE_ADDR'],$tool->iEncrypt($pa)], 'iiissssiss');
	            if($rs === null){
	                $e = 'create_user_fail';
	            } else { 
	                $n = 'user_added'; 
	            }
	    	}
	    	if($x==4){
	    		// Delete a user
		    	if( $tool->user[0]>=1111 ){

					$admin_count = 0;
	     			$ra = $tool->db->query('SELECT COUNT(ukey) AS C FROM `users` WHERE `status` >= 1111;');
		    		if( $ra->num_rows > 0 ){
						$r = $ra->fetch_object();
						$admin_count = $r->C;
					}
					$is_administrator = 0;
		    		$ra = $tool->q('SELECT `status` FROM `users` WHERE `ukey`=?', [$k], 'i');
		    		if( $ra->num_rows > 0 ){
						$r = $ra->fetch_object();
						$is_administrator = $r->status;
					}

					if( $is_administrator < 1111 || $admin_count > 2 ){
				    	$rq = $tool->q('DELETE FROM `users` WHERE `ukey`=?', [$k], 'i');
			    		$n = 'user_removed';
					}

		    		if($n !== 'user_removed'){$e='cant_remove_last_admin';}
			    } else { $e = 'failure'; }
	    	}

    		// Select new user requests
	    	$tool->dbclean();
	    	// Pull list of users waiting to be added
	    	$rq = $tool->db->query('SELECT * FROM `users_create_hold`;');
	    	if( $rq->num_rows > 0 ){
	            while ($r=$rq->fetch_object()){
	            	$muser = json_decode( $tool->iDecrypt($r->h_user_data) );
	            	$nusers[] = [$r->h_key, $muser[0], $muser[2], $muser[3] ];
	            }
	    	}
	    	// Pull list of optional party affiliations
	    	$rq = $tool->db->query('SELECT * FROM `vote_party`;');
	    	if( $rq->num_rows > 0 ){
	            while ($r=$rq->fetch_object()){
	            	$party[] = $r->party_key;
	            }
	    	}
	    	if( $tool->user[0]>=1111 ){
		    	// Get list of current users we can remove if needed
		    	$rq = $tool->q('SELECT * FROM `users`', [], '');
		    	if( $rq->num_rows > 0 ){
		            while ($r=$rq->fetch_object()){
		            	$ousers[] = [$r->ukey, $tool->iDecrypt($r->email), $tool->iDecrypt($r->fname), $tool->iDecrypt($r->lname), $tool->iDecrypt($r->party) ];
		            }
		    	}
	    	}

    	}else{
    		$e = 'failure';
    	}
    }
    echo '{"csrf":"'.$csrf.'","e":"'.$e.'","n":"'.$n.'","f":"'.$f.'","nu":'.json_encode($nusers).',"ou":'.json_encode($ousers).',"pa":'.json_encode($party).'}';
?>