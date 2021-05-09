<?php
/*************************************************************************
    Copyright 2020 Frost Candy
    Author: Frost Candy
    Description:

    Reset URL for users connection device. PUSH notifications
    This may be a future feature, currently not used.


    Secure Trustworthy Online Voting for All
*************************************************************************/
    return false; // We don't use this for now. 


    $t = time(); $e = '';$n = '';$f = '';$o='';

	require_once('../tools.php');
	$tool = new tools();

    $csrf          = $tool->checkCSRF( $tool->rclean($_POST['csrf']) );

    if((int)$_POST['a']===-1){
        // Put the CSRF in javascripts memory - overkill, still vulnerable but harder.
        echo '{"csrf":"'.$csrf.'","e":"-1","n":"'.$n.'","f":"'.$f.'"}';
        return true;
    }


	if( $tool->admin['allow_login'] !== 1  ||  $tool->admin['test_mode'] !== 1 || $tool->admin['vote_complete'] !==0 ){ $e = 'login_not_allowed'; }
	if( $tool->user[0] < 1000 ){ $e = 'invalid_permission_level'; }

	$a = (int) $_POST['a'];
	$u = isset($_POST['u']) ? $tool->rclean( $_POST['u'] ) : '';


	// Allow User Functions
    if( $csrf != '' && $e =='' && $f=='' ){
    	if($a==1){
    		// Set the address

        	if($u==''){
        	    $e='empty_field'; $f='reset_url';
        	} else {
		    	$n = 'success';
	            $rs = $tool->q('UPDATE `users` SET `l`=?, `watchurl`=? WHERE `ukey`=?;', [$t,$tool->iEncrypt($u),$tool->uid], 'isi');
	            if($rs === null){
	                $e = 'set_url_fail'; $f='reset_url';
	            }
        	}

        }else if($a==2){
            // Test the connection

            $rq = $tool->q('SELECT * FROM `users` WHERE `ukey`= ?;', [$tool->uid], 'i');
            $r = $rq->fetch_object();

            // Do the connection test
            $n = $tool->iDecrypt($r->watchurl);

            $o = 'One two';
            $o .= 'Trhee four';

    	}else{
    		$e = 'failure';
    	}
    }
    echo '{"csrf":"'.$csrf.'","e":"'.$e.'","n":"'.$n.'","f":"'.$f.'","o":'.json_encode($o).'}';
?>