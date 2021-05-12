<?php
/*************************************************************************
    Copyright 2020 Frost Candy
    Author: Frost Candy
    Description:

    Login to the user account
    Once logged in administrators can administrate
    Moderators and Watchers can set up their API Key information
    that they will use on the Moderator server.


    Secure Trustworthy Online Voting for All
*************************************************************************/
    $t = time(); $e = '';$n = '';$f = '';

	require_once('../tools.php');
	$tool = new tools();

    $csrf          = $tool->checkCSRF( $tool->rclean($_POST['csrf']) );
    if( $tool->admin['allow_login'] !== 1 && $tool->admin['test_mode'] !== 1 && $tool->admin['vote_complete'] !==0 ){ $e = 'login_not_allowed'; }

    $email         = strtolower($tool->rclean($_POST['em']));
    $password      = $tool->rclean($_POST['pw']);
    $op            = (int) $_POST['op'];

    // Test the data
    if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {                                                $e = 'err_email';        $f = 'user_login_email';     }
    if (!preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/", $password, $match)) { $e = 'err_password';     $f = 'user_login_password';  }
    if (strlen($password)>16||strlen($password)<6) {                                                          $e = 'err_password_len'; $f = 'user_login_password';  }

    // Check login information
    if( $csrf != '' && $e =='' && $f=='' ){
        // Just do a little database clean up on login. 
        $tool->dbclean();

        // As some point this might be better as a username that is not encrypted for speed if we ever plan on more than say 100 users. 
        $e = 'login_not_found';
        $rq = $tool->q( 'SELECT * FROM `users`' );
        if( $rq->num_rows > 0 ){
            while ( $r = $rq->fetch_object() ) {
                if( $email == $tool->iDecrypt($r->email) && password_verify($password, $r->password) ){
                    $e = '';
                    $n = 'logged_in';
                    $csrf=$tool->updateCSRF($csrf, $r->ukey); 
                    $tool->user = [ $r->status, $tool->iDecrypt($r->fname), $tool->iDecrypt($r->lname), $tool->iDecrypt($r->email)];

                    if($op==2){
                        // End the test vote
                        if( $tool->admin['test_mode'] === 1 ){
                            $tool->q('UPDATE `admin` SET `allow_login` = 1, `vote_complete` = 0, `vote_close_uid` = null;', [], ''); 
                        } else { 
                            $csrf=''; $e = 'live_vote_cant_be_removed'; 
                        }
                    }
                    break;
                }
            } // End While
        } // End if 0 rows

    }
    echo '{"csrf":"'.$csrf.'","e":"'.$e.'","n":"'.$n.'","f":"'.$f.'","u":'.json_encode($tool->user).'}';
?>