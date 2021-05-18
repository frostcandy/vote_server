<?php
/*************************************************************************
    Copyright 2020 Frost Candy
    Author: Frost Candy
    Description:

    * Minor set-up required on first run to set db credentials
    You can do it here, or in the config file. For security, after your first run
    after putting in your credentials set your credentials back so to default or
    nothing so nobody can read them later. 

	* Follow these steps:
	Adjust the private db_user, db_pass, db_host, db_name variables below.
	Run Project in web browser
	sudo mkdir /vote
	sudo mv /tmp/sec.inf /vote/sec.inf
	sudo chown www-data:root /vote 
	sudo chown www-data:root /vote/sec.inf 
	sudo chmod 740 /vote 
	sudo chmod 640 /vote/sec.inf 

	* This file provides tools the rest of the project will use.


     Secure Trustworthy Online Voting for All
*************************************************************************/

class tools{
	private $db_user      = 'username';  // Default username (change this on first run then remove after moving from /tmp/db.inf to /vote/db.inf)
	private $db_pass      = 'password';  // Default password (change this on first run then remove after moving from /tmp/db.inf to /vote/db.inf)
	private $db_host      = 'host';      // Default host
	private $db_name      = 'name';      // Default db name 

	private $sec_key      = null;        // secure encryption key

    private $seconds_csrf_non_user_valid = 1200;   // Seconds a non-user CSRF token will be valid
    private $seconds_csrf_user_valid     = 1200;   // Seconds a user CSRF token will be valid


	// Don't change variables below
	public $admin         = [];               // [allow_login, test_mode, vote_complete, users_that_ended_vote]
	public $user          = [0,'','','',''];  // [status, fname, lname, email, party]
	public $db            = null;
	public $uid           = 0;
	public $config        = null;             // Config file variables. 

	function __construct() {
		// Load Config Data 
        $this->config = parse_ini_file("config/config.ini");
        $this->db_user = ($this->config["db_user"]!="") ? $this->config["db_user"]:$this->db_user;
        $this->db_pass = ($this->config["db_pass"]!="") ? $this->config["db_pass"]:$this->db_pass;
        $this->db_host = ($this->config["db_host"]!="") ? $this->config["db_host"]:$this->db_host;
        $this->db_name = ($this->config["db_name"]!="") ? $this->config["db_name"]:$this->db_name;
        $this->config["db_user"] = '';
        $this->config["db_pass"] = '';
        $this->config["db_host"] = '';
        $this->config["db_name"] = '';

        if(!is_array($this->config['unlimited_ip_array'])){ $this->config['unlimited_ip_array'] = []; }

        $this->seconds_csrf_non_user_valid = ($this->config["seconds_csrf_non_user_valid"] !="") ? $this->config["seconds_csrf_non_user_valid"] : $this->seconds_csrf_non_user_valid;
        $this->seconds_csrf_user_valid     = ($this->config["seconds_csrf_user_valid"]     !="") ? $this->config["seconds_csrf_user_valid"]     : $this->seconds_csrf_user_valid;
        $this->config["seconds_csrf_non_user_valid"] = '';
        $this->config["seconds_csrf_user_valid"]     = '';

        if($this->config['debugmode']==1){ ini_set('display_errors', 1); ini_set('display_startup_errors', 1); error_reporting(E_ALL); }

		if ( file_exists('/vote/sec.inf') && ($fp = fopen('/vote/sec.inf', "r"))!==false ) {
			// Gather Secure Credentials
			$secparts = explode("|", fgets($fp));
			$this->sec_key   = base64_decode($secparts[0]);
			$this->db_user   = $this->iDecrypt(base64_decode($secparts[1]));
			$this->db_pass   = $this->iDecrypt(base64_decode($secparts[2]));
			$this->db_host   = $this->iDecrypt(base64_decode($secparts[3]));
			$this->db_name   = $this->iDecrypt(base64_decode($secparts[4]));
			fclose($fp);

			// Create the database connection.
			$this->db = new mysqli($this->db_host, $this->db_user, $this->db_pass, $this->db_name);
			if ($this->db->connect_error) { die("Failed to connect to database."); } //. $this->db->connect_errno  . ' ' . $this->db->connect_error); }
			$this->db_user = null; $this->db_pass = null;

            // Initial set up for new installation
			$rq = $this->db->query('SELECT * FROM users LIMIT 1;');
			if($rq->num_rows > 0){
     			$ra = $this->db->query('SELECT * FROM admin LIMIT 1;');
				$r = $ra->fetch_object();
				$this->admin = ['allow_login'=>(int)$r->allow_login,'test_mode'=>(int)$r->test_mode,'vote_complete'=>(int)$r->vote_complete,'vote_close_uid'=>(string)$r->vote_close_uid];
			}else{
		    	$this->db->query('TRUNCATE TABLE `admin`');
		    	$this->db->query('TRUNCATE TABLE `users`');
		    	$this->db->query('INSERT INTO `admin` (`allow_login`,`test_mode`,`vote_complete`,`vote_close_uid`) VALUES (1,1,0,"");');
				$this->admin = ['allow_login'=>1,'test_mode'=>1,'vote_complete'=>0,'vote_close_uid'=>""];
  			}
			$rq->close();
		} else {
			// Generate SODIUM KEY 
			$this->sec_key   = random_bytes(SODIUM_CRYPTO_SECRETBOX_KEYBYTES); // 256 bit - 32 bytes / 32 characters
			// Write security file with DB Credentials
			$fp              = fopen("/tmp/sec.inf", "w") or die("Unable to open security file for creation!");
			fwrite($fp, base64_encode( $this->sec_key ) . 
				'|' . base64_encode($this->iEncrypt( $this->db_user )) . 
				'|' . base64_encode($this->iEncrypt( $this->db_pass )) . 
				'|' . base64_encode($this->iEncrypt( $this->db_host )) . 
				'|' . base64_encode($this->iEncrypt( $this->db_name )) . 
				'|');
			fclose($fp);
			die("Security file created, move file to /vote/sec.inf");
		}
    }

    //-------------------------------------------------------------------------------------------
    // Standard encryption for database data
    public function iEncrypt($msg){
    	$nonce = random_bytes(SODIUM_CRYPTO_SECRETBOX_NONCEBYTES); // 24 bytes - $this->sec_key 32 bytes
    	return $nonce . sodium_crypto_secretbox($msg, $nonce, $this->sec_key);
    }
    public function iDecrypt($msg){
    	if(strlen($msg) <= SODIUM_CRYPTO_SECRETBOX_NONCEBYTES){ return ''; }
    	$nonce = mb_substr($msg, 0, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES, '8bit');
    	$m1    = mb_substr($msg, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES, null, '8bit');
    	return sodium_crypto_secretbox_open($m1, $nonce, $this->sec_key);
    }

    //-------------------------------------------------------------------------------------------
    // Reporting encryption when sending receipts to make it hard to inject fake data to recipient. 
    public function iEncryptReceipt(?string $msg, string $Key):string  {
		$key            = substr(hash('sha256', $Key, true), 0, 32); 
		$iv_len         = openssl_cipher_iv_length('aes-256-gcm'); 
		$iv             = openssl_random_pseudo_bytes($iv_len); 
		$ciphertext     = openssl_encrypt($msg, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $iv, $tag, "", 16);
		return bin2hex($iv.$ciphertext.$tag);
 	}
    public function iDecryptReceipt(?string $msg, string $Key):?string {
		$encrypted      = hex2bin($msg); 
		$key            = substr(hash('sha256', $Key, true), 0, 32); 
		$iv_len         = openssl_cipher_iv_length('aes-256-gcm'); 
		$iv             = substr($encrypted, 0, $iv_len);
		$ciphertext     = substr($encrypted, $iv_len, -16); 
		$tag            = substr($encrypted, -16);
		return openssl_decrypt($ciphertext, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $iv, $tag);
 	}

    //-------------------------------------------------------------------------------------------
    // General SSL/TSL encryption keypair. 
    public function enc_ssl($msg, $pubKey){ openssl_public_encrypt($data, $encrypted, $pubKey); return $encrypted; }
    public function dec_ssl($encrypted, $privKey){ openssl_private_decrypt($encrypted, $decrypted, $privKey); return $decrypted; }


    //-------------------------------------------------------------------------------------------
    // Database Query Wrapper $t = (i - integer | d - double | s - string | b - BLOB)
    public function q($q='', $v=array(), $t='', $e=false){ $qr = $this->db->prepare( $q ); if($t!=''){$qr->bind_param($t, ...$v);} $r=null; if($qr->execute()){$r=$qr->get_result();}else{if($e){echo '<br>*** MySQLi FAIL: ' . htmlspecialchars($qr->error).'***<br>'; }} $qr->close(); return $r; }


	public function cors(){
	    if (isset($_SERVER['HTTP_ORIGIN'])) { header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}"); header('Access-Control-Allow-Credentials: true'); header('Access-Control-Max-Age: 86400'); }
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { 
        	if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])){ header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); }
        	if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])){ header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}"); }
	        exit(0);
	    }
	}



    //-------------------------------------------------------------------------------------------
    // General Cross-Server Request Forgery, as these are temporary, and minor CSRF checks only, MD5 should be plenty secure.
    public function setUserArray(){
    	// Set the user information array, generally to test privileges with status
    	if( $this->uid > 0 ){
			$rq = $this->q( 'SELECT * FROM `users` WHERE `ukey` = ?;', [$this->uid], 'i');
			if($rq->num_rows > 0){
		        $r = $rq->fetch_object();
	    		$this->user = [ $r->status, $this->iDecrypt($r->fname), $this->iDecrypt($r->lname), $this->iDecrypt($r->email), $this->iDecrypt($r->party) ];
			}
    	}else{
    		$this->user = [ 0, '', '', '', ''];
    	}
	}


    //-------------------------------------------------------------------------------------------
    // General Cross-Server Request Forgery, as these are temporary, and minor CSRF checks only, MD5 should be plenty secure.
    public function setCSRF(){
    	$hh = null;
        // Clean old csrf's
    	$this->q('DELETE FROM `vote_csrf_tokens` WHERE (`vcsrf_c` < ? AND `vcsrf_uid` = 0) OR (`vcsrf_c` < ? AND `vcsrf_uid` > 0);', [(time()-$this->seconds_csrf_non_user_valid), (time()-$this->seconds_csrf_user_valid)], 'ii');
    	// Clean lingering csrf's for known users
    	$this->q('DELETE FROM `vote_csrf_tokens` WHERE `vcsrf_uid` > 0 AND `vcsrf_uid`=?;', [$this->uid], 'i');

    	$this->setUserArray();

    	// Create a new unique csrf for this user, try 10 times then just fail.
    	$count = 0;
    	while( $count < 10 ){
    		$h = bin2hex( random_bytes(16) ) . md5( $this->uid . mt_rand(1,1000000) . microtime(true) );
    	    $hh = md5($h) . md5(substr($h, -1, 32));
	    	$r = $this->q('INSERT INTO `vote_csrf_tokens` (`vcsrf_id`,`vcsrf_c`,`vcsrf_uid`) VALUES (?,?,?);', [ hash('sha256',$hh,false), time(), $this->uid], 'sii');
	    	$count++;
	    	if($r !== null){ $count = 100; }
    	}
    	return ($count==100)?$hh:null;
    }
    public function checkCSRF($csrf){
		$rq = $this->q( 'SELECT * FROM `vote_csrf_tokens` WHERE `vcsrf_id` = ? AND ((`vcsrf_c` > ? AND `vcsrf_uid` = 0) OR (`vcsrf_c` > ? AND `vcsrf_uid` > 0));', [hash('sha256',$csrf,false), (time()-$this->seconds_csrf_non_user_valid), (time()-$this->seconds_csrf_user_valid)], 'sii');
		if($rq->num_rows > 0){
          $r = $rq->fetch_object();
		  $this->uid = $r->vcsrf_uid;
		  $this->q( 'DELETE FROM `vote_csrf_tokens` WHERE `vcsrf_id` = ?;', [hash('sha256',$csrf,false)], 's' );
		  return $this->setCSRF();
		} else { return ''; }
    }
    public function deleteCSRF($csrf){ $this->q( 'DELETE FROM `vote_csrf_tokens` WHERE `vcsrf_id` = ?;', [hash('sha256',$csrf,false)], 's'); return '0'; }
    public function updateCSRF($csrf, $id){ $this->uid = $id; $this->deleteCSRF($csrf); return $this->setCSRF(); }

    //-------------------------------------------------------------------------------------------
    // Verify POST/REQUEST data is utf8
    public function rclean($s) { return ( (bool) preg_match('//u', $s) ) ? $s : ''; }
    public function okchars($s,$L=0){ if($L==0){$L=strlen($s);} return substr( preg_replace('/[^a-z\d\s+=!@#$%^&*.,;:?\/\'\"]/i', '', $s), 0, $L ); }
    public function getIP(){ $ip = isset($_SERVER['HTTP_CLIENT_IP']) ? $_SERVER['HTTP_CLIENT_IP'] : (isset($_SERVER['HTTP_X_FORWARDED_FOR']) ? $_SERVER['HTTP_X_FORWARDED_FOR'] : $_SERVER['REMOTE_ADDR']); if(!filter_var($ip, FILTER_VALIDATE_IP)){ $ip = ''; } return $ip; }
	public function getage($mm,$dd,$yyyy){return (date("md", date("U", mktime(0, 0, 0, $mm, $dd, $yyyy))) > date("md") ? ((date("Y") - $yyyy) - 1) : (date("Y") - $yyyy));}

    //-------------------------------------------------------------------------------------------
    // Database Clean Up
    public function dbclean() { $this->q( 'DELETE FROM `users_create_hold` WHERE `c` < ?;', [ (time()-$this->seconds_csrf_user_valid) ], 'i'); }



}
?>