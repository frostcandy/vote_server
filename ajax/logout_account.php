<?php
/*************************************************************************
    Copyright 2020 Frost Candy
    Author: Frost Candy
    Description:

    Logout of the user account
    Since I don't use cookies, refreshing the webpage does the same thing.


    Secure Trustworthy Online Voting for All
*************************************************************************/
    $t = time(); $e = '';$n = '';$f = '';

	require_once('../tools.php');
	$tool = new tools();

    $csrf          = $tool->deleteCSRF( $tool->rclean($_POST['csrf']) );

    echo '{"csrf":"0"}';
?>