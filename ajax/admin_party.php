<?php
/*************************************************************************
    Copyright 2020 Frost Candy
    Author: Frost Candy
    Description:

    Vote party setup, this is to set each participating side of the vote
    Example: Heads / Tails / Republican / Democrat / Green / Whatever


    Secure Trustworthy Online Voting for All
*************************************************************************/
    $t = time(); $e = '';$n = '';$f = '';$o = '';$nu=[];

	require_once('../tools.php');
	$tool = new tools();

    $csrf          = $tool->checkCSRF( $tool->rclean($_POST['csrf']) );
	if( $tool->admin['allow_login'] !== 1 ||  $tool->admin['test_mode'] !== 1 || $tool->admin['vote_complete'] !==0 ){ $e = 'login_not_allowed'; }
	if( $tool->user[0] < 1111 ){ $e = 'invalid_permission_level'; }

    $a = (int)$_POST['a'];
    $p = isset($_POST['p'])?$tool->rclean($_POST['p']):'';

    if($p == '' && $a>=2){
        $e = 'failure'; $f='create_party_item';
    }

	// Allow User Functions
    if( $csrf != '' && $e =='' && $f=='' ){
        if($a==2){
            // Insert new Party
            $tool->q('INSERT INTO `vote_party` (`party_key`) VALUES (?);',[$p],'s');
            // First user is automatically set with the first inserted party affiliation.
            $tool->q('UPDATE `users` SET `party` = ? WHERE `party` IS NULL;',[ $tool->iEncrypt($p) ],'s');
        }
        if($a==3){
            // Delete Party
            $tool->q('DELETE FROM `vote_party` WHERE `party_key` = ?;',[$p],'s');
        }

    	$n = 'success';
        $rs = $tool->q('SELECT `party_key` FROM `vote_party`;', [], '');
        if($rs === null){
            $e = 'failure';
        } else {
            if( $rs->num_rows > 0 ){
                while ($r=$rs->fetch_object()){
                    $nu[] = $r->party_key;
                }
            }
        }

    }
    echo '{"csrf":"'.$csrf.'","e":"'.$e.'","n":"'.$n.'","f":"'.$f.'","nu":'.json_encode($nu).'}';
?>