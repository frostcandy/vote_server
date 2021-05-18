<?php
/*************************************************************************
    Copyright 2020 Frost Candy
    Author: Frost Candy
    Description:

    This file handles requests from the moderator/watchers servers and
    returns vote information.


    Secure Trustworthy Online Voting for All
*************************************************************************/
    $t = time(); $o = ''; $e = ''; $ev = ''; 
    $oo = new stdClass();

	require_once('../tools.php');
	$tool = new tools();

    // Allow CORS
    $tool->cors();

    // You can only administrate if login is disabled (live vote)
    if( $tool->admin['allow_login'] !==0 ){ $e = 'login_not_allowed'; return; }


    // Check the post data is ok
    if( !isset($_POST['apikey']) || strlen($_POST['apikey']) < 20 || !isset($_POST['o']) ){ echo '{"e":"post_failure"}'; return; }
    $apikey = $tool->okchars( $_POST['apikey'] );
    $o      = $tool->okchars( $_POST['o'] );

    // Check the apikey matches
    $rq     = $tool->q('SELECT * FROM `users` WHERE `apikey`= ?;', [ hash('sha256',$apikey,false) ], 'i');
    if( $rq == null || $rq->num_rows < 1 ){ echo '{"e":"apikey_failure"}'; return; }

    $r          = $rq->fetch_object();
    $tool->uid  = $r->ukey;
    $tool->setUserArray();

    $seckey     = $tool->iDecrypt($r->seckey);
    $oo->apikey = $apikey;

    // Unencrypt the object data and create object array
    $o = json_decode($tool->iDecryptReceipt( $o, $seckey ));

    if( !isset($o->a) ){ echo '{"e":"post_failure"}'; return; }

    // Some actions can be administrated even after the vote is complete
    // 2      - Moderator server Web Client Read Voters
    // 5000   - Moderator server Backend Read Voters
    // 5010   - Moderator server Backend Read Ballots
    $allowed_actions_after_vote = [2, 5000, 5010];
    if( $tool->admin['vote_complete'] !==0 && !in_array($o->a, $allowed_actions_after_vote) ){ $e = 'login_not_allowed'; return; }

    // Handle object action
    if($o->a == "1"){
    	// Server Check
        $oo->d = 'vote_server_connected';

    }else if($o->a == "2"){
        // Pull a list of new voters. (Web Browser Client side / default once a minute)
        $od = new stdClass();
        $od->a = [];    // List of vote users you that you don't have.
        $od->c = 0;     // Total number of users who voted so far.

        $pulltype = 0;
        if( isset( $o->t ) && $o->t > 0 && $o->t < 100 ){ $pulltype = (int) $o->t; }

        $rq      = $tool->q('SELECT COUNT(*) FROM `vote_user_approve`;', [], '');
        if($rq !== null && $rq->num_rows > 0){
            $r = $rq->fetch_row();
            $od->c = $r[0];
        }

        // Denied pulltype also pulls reset voters since they must have been denied at one point, 11 or 13
        $rq = null;
        if($pulltype == 11){  
	        $rq      = $tool->q('SELECT `vua_key`, `c`, `vua_ip`, `vua_approve`, `vua_user` FROM `vote_user_approve` WHERE `vua_approved` = 11 OR `vua_approved` = 13;', [], '');
        } else {
	        $rq      = $tool->q('SELECT `vua_key`, `c`, `vua_ip`, `vua_approve`, `vua_user` FROM `vote_user_approve` WHERE `vua_approved` = ?;', [$pulltype], 'i');
        }
        if($rq !== null && $rq->num_rows > 0){
            while ($r = $rq->fetch_object()) {
                $a        = new stdClass();
                $a->k     = $r->vua_key;
                $a->c     = $r->c;
                $a->ip    = $r->vua_ip;
                $a->apl   = json_decode($r->vua_approve);
                $a->u     = json_decode($tool->iDecrypt($r->vua_user));
                $od->a[]  = $a;
            }
        }
        $oo->d = $od;


    }else if($o->a == "3"){
        // Pull individual voter for management
        $od = new stdClass();
        $od->a = [];    // List of vote users you that you don't have.

        $rq      = $tool->q('SELECT * FROM `vote_user_approve` WHERE `vua_key` = ?', [ $o->k ], 'i');
        if($rq !== null && $rq->num_rows > 0){
            while ($r = $rq->fetch_object()) {
                $a        = new stdClass();
                $a->k     = $r->vua_key;
                $a->c     = $r->c;
                $a->l     = $r->l;
                $a->ip    = $r->vua_ip;
                $a->apl   = json_decode($r->vua_approve);
                $a->ap    = $r->vua_approved;
                $a->u     = json_decode($tool->iDecrypt($r->vua_user));
                $a->b     = "";
                $a->p     = $tool->iDecrypt($r->vua_photo);
                $od->a[]  = $a;
            }
        }
        $oo->d = $od;


    }else if($o->a == "10"){
        // Block IP
        if( $tool->user[0] < 1100 ){ echo '{"e":"invalid_permission_level"}'; return; }
        $vua_a = [];
        if( !isset($o->k) || !isset($o->r) ){ echo '{"e":"post_failure"}'; return; }
        $k     = (int) $o->k;
        $reson = $tool->okchars( $o->r );
        // Pull the IP in question
        $rip = null;
        $rq  = $tool->q('SELECT * FROM `vote_user_approve` WHERE `vua_key` = ?', [ $k ], 'i' );
        if($rq !== null && $rq->num_rows > 0){ $rip  = $rq->fetch_object(); } else { echo '{"e":"post_failure"}'; return; }
        // Block the banned IP 
        $tool->q('UPDATE `voter_ip_list` SET `ip_valid` = 0 WHERE `ip_id` = ?', [ $rip->vua_ip ], 's');
        // Block anyone who used the banned IP that is waiting for approval.
        $vua_a[] = [strval($tool->uid), $tool->user[2] . ', ' . $tool->user[1], $tool->user[4], "ip blocked", $reson];
        $tool->q('UPDATE `vote_user_approve` SET `l` = ?, `vua_approve` = ?, `vua_approved` = 10, `vua_ballot` = NULL WHERE `vua_ip`=? AND `vua_approved` = 0', [ $t, json_encode($vua_a), $rip->vua_ip ], 'iss');
        $oo->d = 'User IP Blocked.';


    }else if($o->a == "11"){
        // Deny Vote
        if( $tool->user[0] < 1100 ){ echo '{"e":"invalid_permission_level"}'; return; }
        $vua_a = [];
        if( !isset($o->k) || !isset($o->r) ){ echo '{"e":"post_failure"}'; return; }
        $k     = (int) $o->k;
        $reson = $tool->okchars( $o->r );
        // Pull the voter in question
        $rip = null;
        $rq  = $tool->q('SELECT * FROM `vote_user_approve` WHERE `vua_key` = ?', [ $k ], 'i' );
        if($rq !== null && $rq->num_rows > 0){ $rip  = $rq->fetch_object(); } else { echo '{"e":"post_failure"}'; return; }
        // Deny this user
        $vua_a[] = [strval($tool->uid), $tool->user[2] . ', ' . $tool->user[1], $tool->user[4], "denied", $reson];
        $tool->q('UPDATE `vote_user_approve` SET `l` = ?, `vua_approve` = ?, `vua_approved` = 11, `vua_ballot` = NULL WHERE `vua_key`=? AND `vua_approved` = 0', [ $t, json_encode($vua_a), $k ], 'isi');
        $oo->d = 'User Vote Denied.';

    }else if($o->a == "12"){
        // Accept Vote
        if( $tool->user[0] < 1100 ){ echo '{"e":"invalid_permission_level"}'; return; }
        $vua_a = [];
        if( !isset($o->k) ){ echo '{"e":"post_failure"}'; return; }
        $k     = (int) $o->k;
        $rip = null;
        $rq  = $tool->q('SELECT * FROM `vote_user_approve` WHERE `vua_key` = ?', [ $k ], 'i' );
        if($rq !== null && $rq->num_rows > 0){ $rip  = $rq->fetch_object(); } else { echo '{"e":"post_failure"}'; return; }
        $vua_a = json_decode($rip->vua_approve);
        $vua_a[] = [strval($tool->uid), $tool->user[2] . ', ' . $tool->user[1], $tool->user[4], "approved", ""];
        // If my party already accepted we can ignore my request
        if (strpos($rip->vua_approve, $tool->user[4]) !== false) {
 	        $oo->d = 'Your party already approved this voter.';
            echo '{"e":"","ev":"","o":"'. $tool->iEncryptReceipt( json_encode($oo), $seckey) .'"}';
	        return; 
    	}
        // Approve the vote if all parties agree, or update the number of parties who have approved it.
        $rq2  = $tool->q('SELECT `party` FROM `users` WHERE `status` >= 1100 GROUP BY `party`', [ ], '' );
        $count_parties = $rq2->num_rows;
        if($rq2 !== null && $rq2->num_rows > 0){
            while ($r2 = $rq2->fetch_object()) {
                if (strpos($rip->vua_approve, $tool->iDecrypt($r2->party) ) !== false) { $count_parties--; }
            }
        } else { echo '{"e":"could_not_load_parties"}'; return; }

        if($count_parties == 1){
            // Only 1 party to go, and we are it, set it to approved, separate and put the ballot in the queue.
            $vub = json_decode( $tool->iDecrypt($rip->vua_ballot) );
            $tool->q('INSERT INTO `vote_choice_queue` (`vc_vid`, `vc_choice`) VALUES (?,?)',[$vub->chk, $rip->vua_ballot ],'ss');

            $tool->q('UPDATE `vote_user_approve` SET `l` = ?, `vua_approve` = ?, `vua_approved` = 12, `vua_ballot` = NULL WHERE  `vua_key` = ? AND `vua_approved` = 0', [ $t, json_encode($vua_a), $k ], 'isi');
        } else {
            // Still need other parties to apporve
            $tool->q('UPDATE `vote_user_approve` SET `l` = ?, `vua_approve` = ? WHERE `vua_key` = ? AND `vua_approved` = 0', [ $t, json_encode($vua_a), $k ], 'isi');
        }
        $oo->d = 'User Vote Approved';

    }else if($o->a == "13"){
        if( $tool->user[0] < 1100 ){ echo '{"e":"invalid_permission_level"}'; return; }
        // Reset ability to vote
        $vua_a = [];
        if( !isset($o->k) ){ echo '{"e":"post_failure"}'; return; }
        $k     = (int) $o->k;
        // Pull the voter in question
        $rip = null;
        $rq  = $tool->q('SELECT * FROM `vote_user_approve` WHERE `vua_key` = ?', [ $k ], 'i' );
        if($rq !== null && $rq->num_rows > 0){ $rip  = $rq->fetch_object(); } else { echo '{"e":"post_failure"}'; return; }
        // Reset this user
        $vua_a[] = [strval($tool->uid), '(Reset) ' . $tool->user[2] . ', ' . $tool->user[1], $tool->user[4], "reset", ''];
        $vua_vid  = 'Reset-' . $t . '-' . mt_rand(100000,999999) . '-' . $rip->vua_vid; 
        $tool->q('UPDATE `vote_user_approve` SET `l` = ?, `vua_approve` = ?, `vua_approved` = 13, `vua_vid` = ?, `vua_ballot` = NULL WHERE `vua_key`=? AND `vua_approved` = 11', [ $t, json_encode($vua_a), $vua_vid, $k ], 'issi');
        $oo->d = 'User Vote Reset.';


    }else if($o->a == "1000"){
        // End Vote
        if( $tool->user[0] < 1100 ){ echo '{"e":"invalid_permission_level"}'; return; }
        $oo->d = 'Vote failed to end';

        // Get number of neccessary party approvals
        $rq2  = $tool->q('SELECT `party` FROM `users` WHERE `status` >= 1100 GROUP BY `party`', [ ], '' );
        $count_parties = $rq2->num_rows;

        $rq = $tool->q('SELECT `test_mode`, `vote_complete`, `vote_close_uid` FROM `admin`', [], '');
        if( $rq !== null ){
            $r = $rq->fetch_object();
            if( $r->vote_complete == 0 ){
                // Vote has not yet been ended, lets find out if this request is valid.
                if (strpos($r->vote_close_uid, $tool->user[4]) !== false) {
                    // The users party already asked to end the vote.
                    $oo->d = 'Party already asked';
                } else {

                    // Users party still needs to be represented.
                    $vcu = json_decode( $r->vote_close_uid );
                    $vcu = ($vcu == null)?$vcu = [] : $vcu;
                    $vcu[] = [ $tool->uid, $tool->user[4] ];
                    // Update the database with the new represented party
                    $tool->q('UPDATE `admin` SET `vote_close_uid`=?', [ json_encode( $vcu ) ], 's');
                    $oo->d = 'Request to end vote accepted.';
                    if( $count_parties == count($vcu) ){
                        // End the vote.
                        if($r->test_mode == 1){
                            // End the Test Vote
                            $tool->q('UPDATE `admin` SET `vote_complete`=1', [ ], '');
                            // UPDATE `admin` SET `vote_complete`=0,`vote_close_uid`=NULL
                        }else{
                            // End the Live Vote (Might do something different for live later)
                            $tool->q('UPDATE `admin` SET `vote_complete`=1', [ ], '');
                        }
                        $oo->d = 'vote_ended';

                        // -----------------------------------------------------------------------------------------
                        // Flush the remaining queue to the permanat ballot storage
                        $vq = $tool->q('SELECT * FROM `vote_choice_queue`', [], '');
                        if($vq !== null && $vq->num_rows > 0){
                            while ($r = $vq->fetch_object()) {
                                $tool->q('INSERT INTO `vote_choice` (`vc_vid`, `vc_choice`) VALUES (?,?)',[$r->vc_vid, $r->vc_choice],'ss');
                            }
                        }
                        $tool->q('DELETE FROM `vote_choice_queue`', [], '');
                        // -----------------------------------------------------------------------------------------

                        // -----------------------------------------------------------------------------------------
                        // Clean ballots that were not counted.
                        $tool->q('UPDATE `vote_user_approve` SET `vua_ballot` = NULL ', [], '');
                        // -----------------------------------------------------------------------------------------
                    }
                }
            }
        }

    }else if($o->a == "5000"){
        // Pull latest updates for voters every x seconds (golang back-end side)
        $od = new stdClass();
        $od->a = [];    // List of vote users you that you don't have.

        // -----------------------------------------------------------------------------------------
        // Every time we call to update our user actions, we manage the ballot queue of approved voters.
        // When there are more than (max_queue) ballots, we randomly select one to drop into the permanant ballot storage
        // This helps keep people from knowing who voted for who based on order or timestamps.
        if( isset($o->m) && (int) $o->m == 5 ){
            $max_queue = 20;
            $vq = $tool->q('SELECT * FROM `vote_choice_queue`', [], '');
            if($vq !== null && $vq->num_rows > $max_queue){
                $vq_rnd = mt_rand(1,$max_queue);
                $vq_ranc = 0;
                while ($r = $vq->fetch_object()) {
                    $vq_ranc++;
                    if( $vq_ranc == $vq_rnd ){
                        $tool->q('INSERT INTO `vote_choice` (`vc_vid`, `vc_choice`) VALUES (?,?)', [$r->vc_vid, $r->vc_choice], 'ss');
                        $tool->q('DELETE FROM `vote_choice_queue` WHERE `vc_vid`=?', [$r->vc_vid], 's');
                    }
                }
            }
        }
        // -----------------------------------------------------------------------------------------


        $rq      = $tool->q('SELECT * FROM `vote_user_approve` WHERE `l` > ?', [ $o->t ], 'i');
        if($rq !== null && $rq->num_rows > 0){
            while ($r = $rq->fetch_object()) {
                $a        = new stdClass();
                $a->k     = $r->vua_key;
                $a->c     = $r->c;
                $a->l     = $r->l;
                $a->ip    = $r->vua_ip;
                $a->apl   = json_decode($r->vua_approve);
                $a->ap    = $r->vua_approved;
                $a->u     = json_decode($tool->iDecrypt($r->vua_user));
                $a->b     = "";
                $a->p     = $tool->iDecrypt($r->vua_photo);
                $b        = new stdClass();
                $b->k     = (string) $a->k; 
                $b->l     = $a->l; 
                $b->j     = json_encode($a); 
                $od->a[]  = $b; 
            }
        }
        $oo->d = $od;


        // Check if vote has ended
        $rq = $tool->q('SELECT `vote_complete` FROM `admin`', [], '');
        if( $rq !== null ){
            $r = $rq->fetch_object();
            if( $r->vote_complete == 1 ){
                $ev = $r->vote_complete;
            }
        }



    }else if($o->a == "5010"){
        // Pull Ballot Information if vote has ended.
        $od = new stdClass();
        $od->a = [];

        // Pull every ballot (voter choice)
        $rq = $tool->q('SELECT `vote_complete` FROM `admin`', [], '');
        if( $rq !== null ){
            $r = $rq->fetch_object();
            if($r->vote_complete == 1){
                $vq = $tool->q('SELECT * FROM `vote_choice`', [], '');
                if($vq !== null && $vq->num_rows > 0){
                    while ($r2 = $vq->fetch_object()) {
                        $a        = new stdClass();
                        $a->k     = $r2->vc_vid;
                        $a->c     = $tool->iDecrypt($r2->vc_choice);
                        $od->a[]  = $a;
                    }
                }else{
                    $e = 'vote_not_over';
                }
            }
        }
        $oo->d = $od;

    	// Pull the Ballot Meta Data
   		$bdata  = "";
		$bq     = $tool->q('SELECT * FROM `vote_meta` WHERE `v_key` = 1', [], '');
		if($bq  !== null && $bq->num_rows > 0){
		    $brow   = $bq->fetch_object();
    		$bdata  = $brow->v_ballot;
		}
        $oo->g = json_decode($bdata);


    }else{
        $oo->d = 'something else';
    }


    echo '{"e":"'.$e.'","ev":"'.$ev.'","o":"'. $tool->iEncryptReceipt( json_encode($oo), $seckey) .'"}';
?>