<?php
/*************************************************************************
    Copyright 2020 Frost Candy
    Author: Frost Candy
    Description:

    This is the main vote area where people place their ballot vote


    Secure Trustworthy Online Voting for All
*************************************************************************/
    $t = time(); $e = '';$n = '';$f = '';$o = '';$p=0;$chk='';

	require_once('../tools.php');
	$tool = new tools();

    $csrf          = $tool->checkCSRF( $tool->rclean($_POST['csrf']) );
    // You can only add votes if login is disabled. 
    if( $tool->admin['allow_login'] !==0  || $tool->admin['vote_complete'] !==0 ){ $e = 'login_not_allowed'; }


    // Verify IP is ok (Allow more than 1 person from same IP unless we blacklist an IP)
    $a   = (int)$_POST['a'];
    $ip  = $tool->getIP();
    if( $ip == '' ){ $e = 'invalid_ip'; }

    $rq = $tool->q('SELECT * FROM `voter_ip_list` WHERE `ip_id`= ?;', [$ip], 's');
    if($rq !== null && $rq->num_rows > 0){
        $r  = $rq->fetch_object();
        if($r->ip_valid==0 || ( $r->ip_used > $tool->config['ip_max_usage'] && !in_array($ip, $tool->config["unlimited_ip_array"]) ) ){
            $e = 'invalid_ip';
        }else{
            $tool->q('UPDATE `voter_ip_list` SET `ip_used` = `ip_used` + 1 WHERE `ip_id` = ?', [$ip], 's');
        }
    } else {
        $tool->q('INSERT INTO `voter_ip_list` (`ip_id`,`ip_used`,`ip_valid`) VALUES (?,1,1);', [$ip], 's');
    }

    // Handle the incomeing voter data
    $ub            = json_decode($tool->rclean($_POST['s']));
    $ubd           = json_decode($tool->rclean($_POST['sb']));
    $photo         = isset($ub->user_img)?$tool->okchars($ub->user_img):'';
    $secret        = $tool->rclean( $_POST['sec'] );
    if( strlen($secret) < 8 ){ $e = 'ballot_invalid_secret'; $f=''; $p = 3; }


    $r=''; $b='';
    $rq = $tool->db->query('SELECT * FROM `vote_meta` WHERE `v_key` = 1');
    if($rq !== null && $rq->num_rows > 0){
        $r = $rq->fetch_object();
        $b = json_decode($r->v_ballot);
    }else{ $e ='ballot_meta_invalid'; }
    $b_count = 0;
    if($r==''||$b==''){ $e ='ballot_meta_invalid'; }else{ $b_count = count( $b->o ); }

    if( $csrf != '' && $e =='' && $f=='' && $a == 2 ){

        $uballot       = new stdClass();

        if( $r->v_ck_photo == 1 && ($photo == '' || strlen($photo) > ($tool->config["image_max_size"] + 1000))            ){ $e = 'ballot_invalid_photo'; $f='vote_img_display_box'; $p = 1; }


        $uballot->fn     = strtolower($tool->okchars($ub->fn, 30));        // First Name
            if( $uballot->fn == ''      ){ $e = 'ballot_invalid_firstname'; $f='ballot_firstname'; $p = 2; }
        $uballot->ln     = strtolower($tool->okchars($ub->ln, 30));        // Last Name
            if( $uballot->ln == ''      ){ $e = 'ballot_invalid_lastname'; $f='ballot_lastname'; $p = 2; }
        $uballot->mn     = strtolower($tool->okchars($ub->mn, 30));        // Middle Name
        $uballot->co     = strtolower($tool->okchars($ub->co, 30));        // Country
            if( $uballot->co == '' || ($r->v_ck_country != '' && $uballot->co != strtolower($r->v_ck_country))    ){ $e = 'ballot_invalid_country'; $f='ballot_country'; $p = 2; }
        $uballot->st     = strtolower($tool->okchars($ub->st, 30));        // State
            if( $uballot->st == '' || ($r->v_ck_state   != '' && $uballot->st != strtolower($r->v_ck_state))      ){ $e = 'ballot_invalid_state'; $f='ballot_state'; $p = 2; }
        $uballot->ci     = strtolower($tool->okchars($ub->ci, 30));        // City
            if( $uballot->ci == ''      ){ $e = 'ballot_invalid_city'; $f='ballot_city'; $p = 2; }
        $uballot->zi     = strtolower($tool->okchars($ub->zi, 30));        // Postal Code
            if( $uballot->zi == '' || ($r->v_ck_zip     != '' && substr(preg_replace('/\s+/','',$uballot->zi) ,0,5) != substr(preg_replace('/\s+/','',strtolower($r->v_ck_zip)),0,5) )       ){ $e = 'ballot_invalid_zip'; $f='ballot_zip'; $p = 2; }
        $uballot->str    = strtolower($tool->okchars($ub->str, 30));       // Street
            if( $uballot->str == ''     ){ $e = 'ballot_invalid_street'; $f='ballot_street'; $p = 2; }
        $uballot->str2   = strtolower($tool->okchars($ub->str2, 30));      // Street 2
        $uballot->bm     = strtolower($tool->okchars($ub->bm, 3));        // Birth Month
            if( $uballot->bm == ''      ){ $e = 'ballot_invalid_bm'; $f='ballot_bmonth'; $p = 2; }
        $uballot->bd     = strtolower($tool->okchars($ub->bd, 3));        // Birth Day
            if( $uballot->bd == ''      ){ $e = 'ballot_invalid_bd'; $f='ballot_bday'; $p = 2; }
        $uballot->by     = strtolower($tool->okchars($ub->by, 5));        // Birth Year
            if( $uballot->by == ''      ){ $e = 'ballot_invalid_by'; $f='ballot_byear'; $p = 2; }
            if( $r->v_ck_age !='' && $r->v_ck_age > $tool->getage($uballot->bm, $uballot->bd, $uballot->by)      ){ $e = 'ballot_invalid_dob'; $f='ballot_byear'; $p = 2; }
        $uballot->p      = strtolower($tool->okchars($ub->p, 30));         // Phone
            if( $uballot->p == ''       ){ $e = 'ballot_invalid_phone'; $f='ballot_phone'; $p = 2; }
        $uballot->e      = strtolower($tool->okchars($ub->e, 30));         // Email
            if( $uballot->e == ''       ){ $e = 'ballot_invalid_email'; $f='ballot_email'; $p = 2; }

        $uballot->t      = $tool->okchars($ub->t, 100);         // Vote Tag (If you gave them one for this vote)
            if( $uballot->t == '' && $r->v_rq_tag == 1          ){ $e = 'ballot_invalid_voter_tag'; $f='ballot_tag'; $p = 2; }
        $uballot->v      = $tool->okchars($ub->v, 100);         // Voter ID - Needed to match a user with their ID.
            if( $uballot->v == '' && $r->v_rq_voter_id == 1     ){ $e = 'ballot_invalid_voter_id'; $f='ballot_vid'; $p = 2; }
        $uballot->ex     = $tool->okchars($ub->ex, 100);        // Voter Extra, like Social Security if needed
            if( $uballot->ex == '' && $r->v_rq_extra != ''      ){ $e = 'ballot_invalid_extra'; $f='ballot_extra'; $p = 2; }

        if( $b_count < count($ubd->op) ){ $e = 'ballot_invalid_options'; $f=''; $p = 3; }

        // Check Voter ID was not already useed
        $rq = $tool->q('SELECT * FROM `vote_user_approve` WHERE `vua_vid` = ?', [ $uballot->v ], 's' );
        if($rq !== null && $rq->num_rows > 0){
            // Someone already voted with this Voter ID $r = $rq->fetch_object();
            $e = 'ballot_used_voter_id'; $f='ballot_vid'; $p = 2;
        }


        // Build the options and Secret Verification code 
        $uballot_data      = new stdClass();
        $uballot_data->op  = $ubd->op; // Ballot Options

        // Non secret parts of the value to check against
        $uballot_data->pub = microtime() . '-' . bin2hex(random_bytes(20));
        $uballot_data->rnd = mt_rand(1000000000,9999999999);                

        // The database ballot key should be a unique field forcing the end result to be unique. Used if voter wants to verify vote 
        $uballot_data->chk = rtrim( chunk_split( strtoupper( md5( $secret . $uballot_data->pub ) ) . $uballot_data->rnd , 6, '-') , '-'); // Small chance not unique. 
        $chk = $uballot_data->chk;

    	// Allow User Functions
        if( $csrf != '' && $e =='' && $f=='' ){
            // Insert into new ballot waiting
            $uballot->v = $r->v_rq_voter_id == 0 ? NULL : $uballot->v;
            $tool->q('INSERT INTO `vote_user_approve` (`c`,`l`,`vua_ip`,`vua_approve`,`vua_approved`,`vua_vid`,`vua_user`,`vua_ballot`,`vua_photo`) VALUES (?,?,?,?,?,?,?,?,?);',[$t, $t, $ip, '[]', 0, $uballot->v, $tool->iEncrypt(json_encode($uballot)),  $tool->iEncrypt(json_encode($uballot_data)), $tool->iEncrypt($photo) ],'iississss');

  	    	$n = 'vote_success';
            // End users sesssion
            $csrf = 'x';
        }
    }
    echo '{"csrf":"'.$csrf.'","e":"'.$e.'","n":"'.$n.'","f":"'.$f.'","p":"'.$p.'","c":"'.$chk.'"}';
?>