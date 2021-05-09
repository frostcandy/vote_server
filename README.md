# vote.FrostCandy.com
Secure Trustworthy Online Voting for All

YOU ARE VIEWING THE VOTE SERVER README FILE

Version: 0.9 - While this software has been tested to be working properly it should be considered a first order template until I get more people testing.

#CONTEXT:
  - VOTE SERVER         : the server that hosts the vote for voters to place their vote.
  - MODERATOR SERVER    : The backend server moderators and watchers use to moderate and view vote actions
  - VOTERS              : this is the person who places the vote from their phone or comptuer
  - SOFTWARE TECHNICIAN : this is someone or a team of people trusted to set up the servers.
  - MODERATOR           : this person has the ability to accept or deny voters trying to place their vote.
  - VALIDATOR           : Same as moderator
  - WATCHER             : this person can watch the live vote happen, but can not affect it. 
  - ADMINISTRATOR       : this person sets up the vote meta data like ballot options and descriptions.

#LINKS:
  - VOTE SERVER CODE        : [ https://github.com/frostcandy/vote_server ]
  - MODERATOR SERVER CODE   : [ https://github.com/frostcandy/vote_moderator_server ]
  - DEMO                    : [ https://vote.FrostCandy.com ]
  - VOTE SERVER Video       : [youtube video instruction]
  - MODERATOR SERVER Video  : [youtube video instruction]

#CONTACT:
  - Email                   : help (AT) frostcandy.com
  - Discord                 : https://discord.gg/JrqWW6uqGg   ( Use channel software # vote )

#SUPPORT/DONATION:
  - My vote software will always be completely free to download and use. Your financial support will buy me more time to work on this project and other tools. I haven't set up any practical way to accept your support, so for now if you wish to make a donation you can use the donate button on my passbank software
  https://passbank.frostcandy.com/
  - Or just paypal your freind Frost some cash at the email address:  pay (AT) frostcandy.com 



#ABOUT:
  - The FrostCandy vote software is meant to secure the integrity of contentious voting while allowing all legitimate voters (VOTER) with access to a phone or computer with a camera to place their vote remotely. That vote will then be verified by a member of each interested party (MODERATOR).

  Each moderator will have the ability to ACCEPT, DENY, or BLOCK IP of the voter. A member from each interested party must accept a voter before their ballot will be processed. 

  During the vote setup, the vote administrator can give access to the vote server to moderators and (WATCHERS). Watchers have access to the same software moderators do, but they will have no ability to ACCEPT, DENY, or BLOCK IP of any voter. Watchers will be able to watch in live time the voters information. The watcher check is meant to add an aditional layer of trust, as they will be able to monitor votes being accepted, denied, or blocked and by who and by which party. Once the vote is concluded, the watchers will also have their personal copy of the vote data. 

  During the vote, the vote server will tie the ballot to the voter until that vote is accepted, or the vote is ended. 

  After the vote has ended, a voter can verifiy their vote using their 7 part code. They can offer further validation that the ballot was placed by them by providing the password used to generate the code to the interested party if there are any disputes. 

  The vote server, each watcher, and each moderator will have a personal copy of the vote data after the vote is complete. Each of these should match if there was no tampering. 

  The vote server stores voter information in the database, and will create ballot data files after the vote has completed. 

  After a live vote ends, the software should lock out all actions. In order to reset for another vote a software technician would have to manually modify the database on the vote server. 

#GOALS: 
  - Simple online voteing 
  - Modern security features 
  - No cookies 
  - No Phone Home or Auto-Update 
  - Opensource Code
  - Limited third party code
  - whitelisted administrators 
  - distributed verifiable receipts
  - Allow Live voter picture with date
  - Multi-Party verifiablity


#VOTE SERVER FILE STRUCTURE:  
  /tmp                   - The general temporary unix directory where initial secure files are created  
  /vote                  - The storage location of the secure vote passcodes and database credentials.  
  ajax/  
    admin_access_key.php - Creates API Keys for moderators and watchers to connect with  
    admin_live_vote.php  - Handles incoming requests from moderator servers  
    admin_party.php      - Administrators ability to add party ( heads/tails/Republican/Democrat/...)  
    admin_reset_url.php  - A potential future feature to push notifications to moderator servers (disabled)  
    admin_user_allow.php - Administrators ability to add new moderator and watcher privileges  
    create_account.php   - Moderators and Watchers ability to register as a user for the Vote Server.  
    login_account.php    - Tests your login information, only funcitonal prior to live vote and not during a vote.  
    logout_account.php   - Allows users to log out.  
    start_vote.php       - Handles the voters vote action and creates their security validation code.  
    test_mode.php        - Activates the test or live vote.  
    vote_ballot.php      - Administrator sets the vote meta data, like ballot options, settings and descriptions.  
    vote_check.php       - Re-builds the voters 7 part code based on their password to check if they match.  
  ballots/  
    ballots.bld          - The ballot meta data set by the vote administrator in the vote setup phase.  
    ballots.blt          - This is every approved ballot cast. (these two files produced at vote end)  
  config/  
    config.ini           - The administrator uses this file to set start-up variables for the software.  
  favicon.ico            - The favicon, generally seen in browser near address bar.  
  index.php              - The initiation code for the vote server.  
  LICENSE                - Basic licensing  
  README.md              - The file you are reading now  
  tools.php              - A set of functions for reusable code, setup and security.  
  vote.js                - 90% of the website user expereince, forms, langauge, css, html, javascript.  
  vote.sql               - The vote MySQL generation dump file.  
  
#DATABASE STRUCTURE:  
vote  
|__ admin             (Administration Table)  
   |__ allow_login      - Def: 1, 1 = allow, 0 = do not allow  
   |__ test_mode        - Def: 1, 1 = test mode, 2 = live mode  
   |__ vote_complete    - Def: 0, 1 = vote has ended  
   |__ vote_close_uid   - Def: null, Holds array of parties ending the vote.  
|__ users             (Users Table)  
   |__ ukey             - users key  
   |__ c                - creation timestamp  
   |__ l                - last login timestamp  
   |__ status           - 1000 - watcher, 1100 - moderator/validator, 1110 - moderator that can allow new users , 1111 - Administrator  
   |__ password         - users password  
   |__ fname            - users first name  
   |__ lname            - users last name  
   |__ email            - users email  
   |__ parent           - future feature for showing who allowed you as a user  
   |__ user_last_ip     - Last login IP  
   |__ rsakey           - future feature for added unneccessary security  
   |__ seckey           - User Private secret to decode and encode data  
   |__ apikey           - API Key to check incoming data is known user  
   |__ watchurl         - future feature for push notifiacitons  
   |__ party            - Users party  
|__ users_create_hold (Temporary Users Waiting for Approval)  
   |__ h_key            - temporary users key  
   |__ c                - creation date  
   |__ h_user_data      - Temporary Users data  
|__ voter_ip_list     (List of voting IPs)  
   |__ ip_id            - The IP Address  
   |__ ip_used          - How many times the IP was used in a vote  
   |__ ip_valid         - Def: 1, 1 valid IP, 0 invalid IP  
|__ vote_choice       (Approved Selected Ballot Options)  
   |__ vc_vid           - Ballot ID (unique 7 section code user recieves when they vote)  
   |__ vc_choice        - Ballot Selections placed by the voter  
|__ vote_choice_queue (Randomness for vote_choice to separate votes from voters)  
   |__ vc_vid           - Ballot ID (unique 7 section code user recieves when they vote)  
   |__ vc_choice        - Ballot Selections placed by the voter  
|__ vote_csrf_tokens  (User token to show user is active and logged in)  
   |__ vcsrf_id         - Token Key  
   |__ vcsrf_c          - Timestamp  
   |__ vcsrf_uid        - User ID  
|__ vote_meta         (Table that holds the ballot options, descriptions, and settings information)  
   |__ v_key            - vote meta key  
   |__ l                - Last modified timestamp  
   |__ v_uid            - Last user who made an edit to the table  
   |__ v_start_time_utc - future feature for automated start  
   |__ v_stop_time_utc  - future feature for automated stop  
   |__ v_ballot         - The entire voter ballot, vote options and title and description text  
   |__ v_vu_count       - future feature count users that voted  
   |__ v_vu_totals      - future feature count number of votes made  
   |__ v_receipt_urls   - future feature for push notifications  
   |__ v_ck_country     - Country to match for vote  
   |__ v_ck_city        - City to match for vote  
   |__ v_ck_state       - State to match for vote  
   |__ v_ck_zip         - Zip to match  
   |__ v_ck_age         - Minimum age match  
   |__ v_ck_photo       - Force a photo  
   |__ v_rq_tag         - Tag to match  
   |__ v_rq_voter_id    - The VOTER ID that each of your voters should have when they register to vote.  
   |__ v_rq_extra       - Extra field administrator could ask for, like social security number  
   |__ v_show_fname     - Send first name to moderators and watchers  
   |__ v_show_lname     - Send last name to moderators and watchers  
   |__ v_show_mname     - Send middle name to moderators and watchers  
   |__ v_show_bdate     - Send birthdate name to moderators and watchers  
   |__ v_show_street    - Send street name to moderators and watchers  
   |__ v_show_street2   - Send street2 name to moderators and watchers  
   |__ v_show_city      - Send city name to moderators and watchers  
   |__ v_show_state     - Send state name to moderators and watchers  
   |__ v_show_zip       - Send zip name to moderators and watchers  
   |__ v_show_country   - Send country name to moderators and watchers  
   |__ v_show_email     - Send email name to moderators and watchers  
   |__ v_show_phone     - Send phone name to moderators and watchers  
   |__ v_open_vote      - Def: 1, future feature  
   |__ v_running_total  - Def: 0, future feature to show a running total  
|__ vote_party        (List of involved parties heads/tails/Republican/Democrat/... )  
   |__ party_key        - The interested voting party.  
|__ vote_user_approve (Voters are stored in this table, until approved ballot is tied to voter)  
   |__ vua_key          - Voter Key  
   |__ c                - creation timestamp  
   |__ l                - last touched timestamp  
   |__ vua_ip           - Voter Last IP  
   |__ vua_approve      - Def: 0, 10 block ip, 11 deny vote, 12 accept vote, 13 reset the voter  
   |__ vua_approved     - Array of interested party members that worked on this voter account  
   |__ vua_vid          - Voter Identification number voter recieved when they registered to vote.  
   |__ vua_user         - Voter Data (city/state/phone/...)  
   |__ vua_ballot       - Voter Ballot Selections, removed when voter approved or vote ends.  
   |__ vua_photo        - Voter Photo  



# CONFIG SETUP
-- copy the file config/config.ini.tmp to config/config.ini
-- The software will use the config.ini file for configuration.

debugmode = 1     : default 0, you don't need to change this

The database credentials can be removed after your first deployment
db_user = ""      : Enter the vote server database user name
db_pass = ""      : Enter the vote server database password
db_host = ""      : Enter the vote server database host
db_name = ""      : Enter the vote server database name

The super secret encryption information, remove them after yoru first run of the software.
sec_key    = ""
sec_nonce  = ""

This should be left at 50000. That should be more than enough.
image_max_size              = 50000 

Limit number of people allowed to use the same IP when voting. 
ip_max_usage                = 10

If this is not set long enough then people placing votes will get a timeout error.
seconds_csrf_non_user_valid = 1200

This is for the administrators. After this many seconds you will get a timeout error.
seconds_csrf_user_valid     = 1200

Viewing URL for everyone to see the current vote software code 
vote_view_url        = "https://MyPrecinct.com/votelook1/"

Viewing URL for everyone to see the current NGINX setup
nginx_view_url        = "https://MyPrecinct.com/votelook2/"

List of Unlimited IP - Example, you want walk-ins to vote at your precienct off an ipad or workstation. Example:
unlimited_ip_array    = ["192.168.1.2","192.168.1.3","192.168.1.4"]






# MY BUILD
  - Ubuntu 20.04
  - PHP 8
  - MySQL 8.4 
  - Install netstat: sudo apt install net-tools 
    (This shows us what is listening on port 443 - the secure https default port, should be NGINX)







NGINX Example
server{
 location ^~ /vote/ {
        try_files $uri $uri/ =404;
        location ~ \.php$ {
           fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
           include fastcgi_params;
           fastcgi_param DOCUMENT_URI $request_uri;
           fastcgi_param SCRIPT_FILENAME $request_filename;
           fastcgi_param SCRIPT_NAME $fastcgi_script_name;
        }
    }
    # To show everyone the code running the vote software
    location ^~ /votelook1/ {
        index notexist.htm;
        alias /var/www/html/vote/;
        types { }
        default_type text/plain;
        add_header x-robots-tag "noindex, follow";
        autoindex on;
        autoindex_exact_size off;
        autoindex_format html;
        autoindex_localtime on;
    }
    # Assuming you want to show everyone your NGINX setup
    location ^~ /votelook2/ {
        index notexist.htm;
        alias /etc/nginx/;
        types { }
        default_type text/plain;
        autoindex on;
        autoindex_exact_size off;
        autoindex_format html;
        autoindex_localtime on;
    }
}
