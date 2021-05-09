<?php
/*************************************************************************
    Copyright 2020 Frost Candy
    Author: Frost Candy
    Description:

    Set or reset the authentication information. 
    Moderator/Watchers API Keys, and encryption settings.

    Secure Trustworthy Online Voting for All
*************************************************************************/
    $t = time(); $e = '';$n = '';$f = '';$o = '';

	require_once('../tools.php');
	$tool = new tools();

    // Authenticate Request
    $csrf          = $tool->checkCSRF( $tool->rclean($_POST['csrf']) );
	if( $tool->admin['allow_login'] !== 1 ||  $tool->admin['test_mode'] !== 1 || $tool->admin['vote_complete'] !==0 ){ $e = 'login_not_allowed'; }
	if( $tool->user[0] < 1000 ){ $e = 'invalid_permission_level'; }


    if( $csrf != '' && $e =='' && $f=='' ){
    	$n = 'success';
    	$config = array( "digest_alg" => "sha512", "private_key_bits" => 4096, "private_key_type" => OPENSSL_KEYTYPE_RSA );
        $res = openssl_pkey_new($config);
        $privKey = null; $pubKey = null;
        openssl_pkey_export($res, $privKey);

        // Note the openssl keys are not used for anything yet.
        $pubKey = openssl_pkey_get_details($res)["key"];
    	$rsakey = $tool->iEncrypt( $privKey );
        $seckey = bin2hex( random_bytes(16) ) . md5( mt_rand(1,1000) . mt_rand(1,1000000) . microtime(true) );
        $apikey = bin2hex( random_bytes(16) ) . md5( $tool->uid      . mt_rand(1,1000000) . microtime(true) );

        $rs = $tool->q('UPDATE `users` SET `l`=?, `rsakey`=?, `seckey`=?, `apikey`=? WHERE `ukey`=?;', [$t, $rsakey, $tool->iEncrypt($seckey), hash('sha256',$apikey,false), $tool->uid], 'isssi');
        if($rs === null){
            $e = 'failure';
        } else {
            // apikey = 64 bytes & seckey = 64 bytes
        	$o = $pubKey . "\n" . $seckey . "\n" . $apikey;
        }

    }
    echo '{"csrf":"'.$csrf.'","e":"'.$e.'","n":"'.$n.'","f":"'.$f.'","o":'.json_encode($o).'}';
?>