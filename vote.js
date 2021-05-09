/*************************************************************************
  Copyright 2020 Frost Candy
  Author: Frost Candy
  Description:

  * CSS and JS together for fewer server calls
  * Vanillia JS & CSS only - prevent 3rd party security holes
  * Hard coded relaitve links only
  * Leverageing cache by putting some HTML in here too

  Secure Trustworthy Online Voting for All
*************************************************************************/

// Global Storage Variables
var uballot           = {fn:"", ln:"", mn:"", co:"", st:"", ci:"", zi:"", str:"", str2:"", bm:"", bd:"", by:"", p:"", e:"", t:"", v:"", ex:"", user_img:""};
var uballot_data      = {op:[]};
var end_ballot_array  = [];
var end_ballot_totals = [];



// css to make it look slightly better than terrible
var style = document.createElement('style');
style.innerHTML = '' + 
  '*{margin:0;padding:0;}'+
  '.noselect{-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;}'+
  '.floatleft{float:left;margin-left: 10px;}'+
  '.floatright{float:right;margin-left: 10px;}'+
  '.centertext{text-align:center;}'+
  'p1{font-size: 13px;}'+
  'h1{}'+
  'h2{}'+
  'h3{color:#929292;}'+
  '.ex{color:#333; font-size:14px;}'+
  '.frost{color:#84BBEC;}'+
  '.candy{color:#EC84E9;}'+
  '.code{ padding: 20px; border-radius: 10px; background-color:#fff; border: 1px solid #333; color:#333; font-size: 14px; }'+
  '.codes{ letter-spacing: 1px; }'+

  'optional{font-size:12px; color:#DE8C1F;}'+
  '.leftfieldname{width: 300px !important; margin-right:10px; }'+
  '.smallinfo{font-size:12px; color:#DE7D1F;}'+
  '.smallinfodark{font-size:12px; color:#7B7B7B;}'+
  '.overhide{overflow:hidden;padding:0px 10px 18px 10px;}'+
  '.width100{width: 100%;}'+
  '.center{text-align:center;}'+
  '.bolditalic{font-weight:bold; font-style: italic;font-size:16px;}'+
  '.bold{font-weight:bold;font-size:16px;}'+
  '.divunder{border-bottom: 1px dashed #929292;margin-bottom:10px;}'+
  '.div_spacer_10>div{margin: 10px;}'+
  '#content_box{padding-bottom: 250px;}'+
  '.boxshadow{ -webkit-box-shadow: 3px 3px 15px 5px rgba(0,0,0,0.75); box-shadow: 3px 3px 15px 5px rgba(0,0,0,0.75); }'+
  '.tog1{background-color:#FFF;}'+
  '.tog2{background-color:#ECF6FF;}'+
  '.cgood {color:#46DE1F; font-size: 14px;}'+
  '.cbad  {color:#DE1F1F; font-size: 14px;}'+


  'body{background-color:#EEEEEE;font-family: "Verdana", Arial, Helvetica, sans-serif;font-size:16px; margin-bottom: 100px; }'+

  '.btn,.btnred,.btngrey,.btnorange{margin: 0px 10px; border-radius:4px;display:inline-block;cursor:pointer;font-family:Arial;font-size:13px;font-weight:bold;padding:6px 12px;text-decoration:none;}'+
  '.btn:active,.btnred:active,.btngrey:active,.btnorange:active{position:relative;top:1px;}'+
	'.btn{box-shadow: 0px 10px 14px -7px #3e7327;background:linear-gradient(to bottom, #77b55a 5%, #72b352 100%);background-color:#77b55a;border:1px solid #4b8f29;color:#ffffff;text-shadow:0px 1px 0px #5b8a3c;}' +
  '.btn:hover{background:linear-gradient(to bottom, #72b352 5%, #77b55a 100%);background-color:#72b352;}' + 
  '.btnred{box-shadow: 0px 10px 14px -7px #732727;background:linear-gradient(to bottom, #b35959 5%, #b35252 100%);background-color:#b35959;border:1px solid #8f2929;color:#ffffff;text-shadow:0px 1px 0px #8a3e3e;}'+
  '.btnred:hover{background:linear-gradient(to bottom, #b35252 5%, #b35959 100%);background-color:#b35252;}'+
  '.btngrey{box-shadow: 0px 10px 14px -7px #ffffff;background:linear-gradient(to bottom, #ededed 5%, #dfdfdf 100%);background-color:#ededed;border:1px solid #dcdcdc;color:#777777;text-shadow:0px 1px 0px #ffffff;}'+
  '.btngrey:hover{background:linear-gradient(to bottom, #dfdfdf 5%, #ededed 100%);background-color:#dfdfdf;}'+
  '.btnorange{box-shadow: 0px 10px 14px -7px #ECC314;background:linear-gradient(to bottom, #ffed64 5%, #ffed64 100%);background-color:#ffed64;border:1px solid #ffab23;color:#000000;text-shadow:0px 1px 0px #ffed66;}'+
  '.btnorange:hover{background:linear-gradient(to bottom, #ffed64 5%, #ffed64 100%);background-color:#ffed64;}'+
  '.btnact{cursor:pointer;}'+


  '#errnote{ position: fixed; display: none; opacity:0; border-top: 1px solid #000; bottom: 0px; left: 0px; width: 100%; padding: 10px; background-color:#FFD5D4; overflow: hidden;}'+
  '#errtext{float: left;}'+
  '.errclose{float: right; border-radius: 10px; width: 20px; height: 20px; background-color:#fff; border: 2px solid #000; margin: 0px 20px; line-height: 17px; text-align: center; cursor:pointer;}'+
  '.errclose:hover{background-color:#FFF0B0;}'+
  '.errclose:active{position:relative;top:1px;}'+
  '.errclose:after{display:inline-block;content:"\\00d7";font-weight:bold; font-size: 18px;}'+
  '.hasError{background-color:#FFD5D4 !important;}'+
  '.note{ background-color:#E8FFD2 !important; }'+

  '#fc_header{padding: 10px; background-color:#333;border: 1px solid #000; overflow: hidden;}'+
  '.fc_logo{float: left;margin-top:5px;font-weight:bold;}'+
  '.fc_logo>span:nth-child(1){color:#E0E0E0;}' +
  '.fc_logo>span:nth-child(2){color:#84BBEC;}' +
  '.fc_logo>span:nth-child(3){color:#EC84E9;}' +
  '.fc_logo>span:nth-child(4){color:#E0E0E0;}' +

  '#top_menu{float: right;margin-right:10px;}'+
  '#top_menu>div{float: right;display:none;}'+

  '#content_center{ display: block; position: relative; max-width: 800px; margin: 20px auto; }'+

  '#vote_number_check_container{}'+
  '#vote_number_check_container span{font-weight: bold; font-size: 20px;}'+
  '.vote_number_checks{ padding: 6px; margin: 4px; width: 55px; }'+

  '.nu_user { background-color:#F3F9FF; border: 1px solid #777; margin: 40px 10px; padding: 10px; }'+
  '.nu_party{ background-color:#F3F9FF; border: 1px solid #777; margin: 40px 10px; padding: 10px; overflow: hidden; }'+
  '.account_options .btn{width: 100px; text-align: center;}'+

  '.ballot_option_total_title{ background-color:#333; color:#fff; padding: 6px; }'+
  '.ballot_option{ display: inline-block; float: left; padding:10px; margin:10px; min-width: 300px; border:1px solid #000; background-color:#ffffff; }'+
  '.ballot_option:nth-child(2n+1){clear:both;}'+
  '.ballot_option>form>div{ margin: 10px 0px; }'+
  '.bottomline{border-bottom:1px dashed #333;}'+

  '#ballot_option_popup{position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1000; width: 400px; height: 460px; display: none; border: 2px solid #000; background-color:#fff; padding:10px; }'+
  '#ballot_popup_options_list{ overflow-y:auto; max-height: 250px; margin: 10px 0px; border: 1px solid #777; padding: 10px; }'+
  '.ballot_option_title{ margin-bottom: 10px; min-width:250px; }'+
  '#ofull{ position: relative; display: block; margin: 10px auto 50px auto; padding: 10px 10px 50px 10px; background-color:#E3F2FF; border: 1px solid #333; border-radius: 10px; overflow: hidden;}'+
  '#ofull_sample{ margin-top: 100px; position: relative; font-style: italic;}'+
  '#ofull .ballot_remove_option_button{ display: none; }'+
  '.ballot_underline{  margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px dashed #777; }'+
  '.ballot_underline2{ margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #333; }'+

  '.verify_user_number_div{ overflow: hidden; margin: 10px; }'+
  '.verify_user_number_input{ width: 150px; font-size: 14px; padding: 4px 6px; background-color:#F6FBFF; }'+
  '.verify_user_number_button{}'+




  '#vote_details_opening_block{ padding: 10px; background-color:#fff; border: 1px solid #777; border-radius: 10px; margin: 10px auto; }'+

  '.vote_sections{ display:none; overflow: hidden; }'+
  '#vote_img_upload_container{ display:block;position: relative; display: block; max-width: 400px; margin: 0px auto; }'+
  '#vote_img_display_box{ display:block; position: relative; border: 1px solid #333; margin: 10px auto; max-width: 300px; max-height: 400px; text-align:center; background-color:#F7FBFF; }'+
  '#vote_img_frame{display:block;max-width:300px;max-height:300px; margin: 0px auto;}'+


  '#end_ballot_container{display: block; position: relative; margin-top: 50px; padding: 10px; font-size: 14px; border: 1px solid #333; background-color:#fff; border-radius: 10px; }'+

  '#ballot_output_totals{ }'+
  '.ballot_output_totals_div{ margin: 10px; padding: 10px; }'+
  '.ballot_output_totals_items{ margin: 10px 0px; overflow: hidden; }'+
  '.ballot_output_totals_runner{float: left;}'+
  '.ballot_output_totals_number{float: right;}'+

  '#ballot_output_ballot_list{ margin: 40px 10px 20px 10px; border-top: 3px solid #333; }'+
  '.ballot_output_ballot_list_item{ padding: 10px; }'+
  '.ballot_output_ballot_list_item_choice{  }'+


  '.form_default_css{display: block; position: relative; padding: 10px; border: 1px solid #333; background-color:#FFFFFF; border-radius:10px; margin: 40px 0px;}'+
  '.form_default_css>div{margin: 6px;}'+
  '.form_default_css p{ font-size: 20px; }'+
  '.form_default_css input,.form_default_css select{padding: 12px 20px; margin: 8px 0; display: inline-block; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;}'+
  '.form_soft_css select{padding: 6px 10px; margin: 4px; font-size: 14px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;}'+
  '.form_soft_css input{padding: 12px 20px; margin: 8px 0; display: inline-block; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;}'+
  '.form_soft_css textarea{padding: 12px 20px; margin: 8px 0; display: inline-block; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; width: 90%; height: 100px; }'+
  '.form_bittxtarea_css textarea{ width: 98%; min-width: 350px; height: 150px; padding:10px; }'+

  '#fc_vote_info{}'+
  '#fc_vote_info>div{ margin: 10px 0px; }'+


  '::placeholder{          color: #D2D2D2; opacity: 1;}'+
  ':-ms-input-placeholder{ color: #D2D2D2;}'+
  '::-ms-input-placeholder{color: #D2D2D2;}'+

  '.form_default_css>div>div{display: inline-block; width: 100px;}'+

  '';
var ref = document.querySelector('script');
ref.parentNode.insertBefore(style, ref);


//-------------------------------------------------------------------------
// Language Library - Eventually we would put all language in the library to allow different languages.
var def_lang = 'en';
var libr=[[]];

libr['en']=[];
libr['en']['update_browser']               = 'Your browser does not support this application, please update it or try another web browser.';
libr['en']['reload']                       = 'Your session has expired. Please reload the webpage.';
libr['en']['logged_in']                    = 'Successfully logged in.';
libr['en']['login_not_allowed']            = 'Logging into the system is currently not allowed. Usually becasue a vote is currently active.';
libr['en']['login_not_found']              = 'That email and password combination did not match.';
libr['en']['invalid_permission_level']     = 'Invalid permission level, ask an administrator to help you.';
libr['en']['invalid_party']                = 'You must select a valid party for new users.';
libr['en']['failure']                      = 'Your action failed.';
libr['en']['success']                      = 'Your action was successful.';
libr['en']['vote_success']                 = 'Your vote was successfully sent. Thank you!';
libr['en']['empty_field']                  = 'You left a field empty.';
libr['en']['non_functional_button']        = 'This button does not do anything.';
libr['en']['activate_testmode']            = 'Once you go to live mode the live vote will start. This can not be undone unless you manually change the database. Are you sure you want to start live mode?';
libr['en']['invalid_ip']                   = 'Your IP was invalid, try logging in from another network.';
libr['en']['cant_remove_last_admin']       = 'You can not remove the last administrator. Create a new administrator first.';
libr['en']['live_vote_cant_be_removed']    = 'You can not programatically remove live vote data to preserve the vote record.';


libr['en']['ballot_meta_invalid']          = 'There was a problem pulling the vote data, try again later.';
libr['en']['ballot_invalid_country']       = 'Select a valid country.';
libr['en']['ballot_invalid_state']         = 'Select a valid state.';
libr['en']['ballot_invalid_zip']           = 'Select a valid postal code.';
libr['en']['ballot_invalid_dob']           = 'Select a valid date of birth.';
libr['en']['ballot_invalid_voter_tag']     = 'Enter the voter tag you were given.';
libr['en']['ballot_invalid_voter_id']      = 'Enter your voter ID number.';
libr['en']['ballot_invalid_extra']         = 'Enter the additional information field.';
libr['en']['ballot_invalid_phone']         = 'Enter your phone number.';
libr['en']['ballot_invalid_email']         = 'Enter your email address.';
libr['en']['ballot_invalid_firstname']     = 'Please provide your first name';
libr['en']['ballot_invalid_lastname']      = 'Please provide your last name';
libr['en']['ballot_invalid_city']          = 'Enter your city name';
libr['en']['ballot_invalid_street']        = 'Enter your street address';
libr['en']['ballot_invalid_photo']         = 'There was a problem with your photo, please try again.';
libr['en']['ballot_invalid_bm']            = 'Invalid Brith Month';
libr['en']['ballot_invalid_bd']            = 'Invalid Birth Day';
libr['en']['ballot_invalid_by']            = 'Invalid Birth Year';
libr['en']['ballot_invalid_secret']        = 'Vote secret must be at least 8 characters long. Your secret can be used to verify your vote later.';
libr['en']['ballot_invalid_options']       = 'Invalid option selections, try refreshing the webpage.';
libr['en']['ballot_used_voter_id']         = 'Your Voter ID was already used.';


libr['en']['set_url_fail']                 = 'URL failed to be set. Try again later.';

libr['en']['create_user_fail']             = 'Failed to create user account.';
libr['en']['admin_created']                = 'Administrator account created.';
libr['en']['user_waiting_create']          = 'User account waiting approval.';
libr['en']['user_added']                   = 'User account was added.';
libr['en']['user_removed']                 = 'User account was removed.';
libr['en']['invalid_permission_set']       = 'You must set a valid user permission level.';

libr['en']['ballot_settings_upated']       = 'The ballot settings have been updated.';
libr['en']['ballot_options_upated']        = 'The ballot options have been udpated.';
libr['en']['ballot_multioption_fail']      = 'One of your ballot options has too many selections.';

libr['en']['err_email']                    = 'There is a problem with your e-mail.';
libr['en']['err_password']                 = 'Password must contain a lower, an upper, a number and a special character (!@#$%^&*)';
libr['en']['err_password_len']             = 'Password must be between 6 and 16 characters';
libr['en']['err_fn_len']                   = 'First name must be alphanumeric and at least 2 characters long.';
libr['en']['err_ln_len']                   = 'Last name must be alphanumeric and at least 2 characters long.';

libr['en']['img_missing']                  = 'You must add an image with yourself holding a readable hand drawn date.';
libr['en']['img_size_fail']                = 'Your image was too big, must be less than '+formatBytes(image_max_size,0)+'. Try cropping your image.';


var lib = libr[def_lang];



//-------------------------------------------------------------------------
// Handle Errors and Notes
errTimeout = null;
function resetCSRF(d){ if(typeof d == 'undefined' || d==null || d=='' || d.csrf=='undefined' || d.csrf=='' ){ csrf = ''; doErr(lib['reload']); } else{ csrf = d.csrf; doErr(d,d.f); return true; } return false; }
function doErr(d,f,t){
  closeErr(1); var s = '';
  $('#errnote').removeClass('note');
  errTimeout = setTimeout(function(){ closeErr() }, 10000);
  if(t==1){ $('#errnote').addClass('note'); }
  if(typeof f !== 'undefined' && f != null && f != ''){ $('#'+f).addClass('hasError'); }
  if(typeof d.e !== 'undefined' && ( d.e == '-1' || d.e == '' ) ){ if(typeof d.n === 'undefined' || d.n == ''){ return false; } }
  if(typeof d.e !== 'undefined' && d.e != ''){ s=d.e; }else if(typeof d.n !== 'undefined' && d.n !=''){ $('#errnote').addClass('note'); s=d.n; } else { s=d; } if( s!='' ){ s=(typeof lib[s]=='undefined')?s:lib[s]; $('#errtext').text(s); $('#errnote').fadeIn(); } 
}
function closeErr(t){ clearTimeout(errTimeout); $('.hasError').removeClass('hasError'); t==1?$('#errnote').hide():$('#errnote').fadeOut(); } 
function startsWith(s,m){return s.lastIndexOf(m, 0)===0;}
function formatBytes(a,b=2){if(0===a)return"0 Bytes";const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1000));return parseFloat((a/Math.pow(1000,d)).toFixed(c))+["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][d]}
function getAge(dateString){var today = new Date();var birthDate = new Date(dateString); var age = today.getFullYear() - birthDate.getFullYear();var m = today.getMonth() - birthDate.getMonth();if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())){age--;}return age;}

//-------------------------------------------------------------------------
// General Cosmetic Functions
function toTitles(s){ return s.replace(/\w\S*/g, function(t) { return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase(); }); }
function goTop(c,e,o){if(typeof c==="undefined"||c==""){c=0}if(typeof e==="undefined"||e==""){document.body.scrollTop=c;document.documentElement.scrollTop=c}else{document.body.scrollTop=document.getElementById(e).offsetTop+o;document.documentElement.scrollTop=document.getElementById(e).offsetTop+o;document.getElementById(e).scrollTop=c;}}
function nl2br(s){if(typeof s === 'undefined' || s === null){return '';} return (s+'').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br/>' + '$2');}
function cleaner(s){  return (s).replace(/[^a-zA-Z ]/g, ""); }
window.onbeforeunload = function(){goTop(); return null;};


//-------------------------------------------------------------------------
// Hard Coded click functions 
var curbops = [];
function ballot_option_new_field(){
  var o = ''; var o1 = 1;	var c = document.getElementsByClassName('ballot_popup_option');
	for(var i=0;i<c.length;i++){
		if( c[i].value != '' ){
    		o += '<div id="ballot_popup_option_'+o1+'_div"><div class="leftfieldname">Option '+o1+':</div> <input id="ballot_popup_option_'+o1+'" class="ballot_popup_option" data-k="'+o1+'" type="text" value="'+c[i].value+'" placeholder="Frost Candy"/> </div>';
    		o1++;
		}
	}
    o += '<div id="ballot_popup_option_'+o1+'_div"><div class="leftfieldname">Option '+o1+':</div> <input id="ballot_popup_option_'+o1+'" class="ballot_popup_option" data-k="'+o1+'" type="text" value="" placeholder="Frost Candy"/> <div onclick="ballot_option_new_field();" class="btn floatright">+</div> </div>';
	$('#ballot_popup_options_list').html( o );
	return true;
}
function ballot_option_remove_option(idx){
  var r = confirm("Are you sure you want to delete?"); if (r == true) { curbops.splice(idx, 1); $().post('vote_ballot', vote_ballot, {csrf:csrf, a:5, o:JSON.stringify(curbops)} ); } else { }
}
function ballot_option_new_submit(){
  var oo = {}; var o = []; var c = document.getElementsByClassName('ballot_popup_option');
  for(var i=0;i<c.length;i++){ if( c[i].value != '' ){ o.push( c[i].value ); } }
  if( document.getElementById('ballot_option_popup_writein').checked==true ){ o.push( 'fcwritein' ); }
  if( document.getElementById('ballot_option_popup_allow_multipul').checked==true ){ o.push( 'allowmultipul' ); }
  oo = {t:$('#ballot_popup_title').val(), o:o };
  if( $('#ballot_option_popup_position').val() > curbops.length ){ curbops.push(oo); } else { curbops.splice( $('#ballot_option_popup_position').val(), 0, oo ); }
  ballot_option_fill_options(1);
}
function ballot_option_fill_options(rm){
  var o = '';  
  for(var i=0;i<curbops.length;i++){
    var oo = ''; var allowmultipul = '0';
    for(var ii=0;ii<curbops[i].o.length;ii++){
      if( curbops[i].o[ii] == 'allowmultipul' ){ allowmultipul = '1'; }else{
       oo += (curbops[i].o[ii] == 'fcwritein') ? 
           '<div class="ballot_option_options smallinfodark">Write In: <input type="text" value="" class="bopsx bop_text" data-t="t" data-k="'+i+'" data-k2="'+ii+'" id="op_'+i+'_'+ii+'" maxlength="60"/></div>' 
           : '<div class="ballot_option_options"><input type="checkbox" value="'+cleaner(curbops[i].o[ii])+'" class="bopsx bop_checkbox" data-t="c" data-k="'+i+'" data-k2="'+ii+'" id="op_'+i+'_'+ii+'"/> '+nl2br(curbops[i].o[ii])+'</div>'; 
      }
    }
    if(rm!=2){ oo +='<div><div class="btnred noselect floatright ballot_remove_option_button" onclick="ballot_option_remove_option('+i+');">Remove Option</div></div>';}
    o+='<div id="op_boxx_'+i+'" data-k="'+i+'" data-m="'+allowmultipul+'" class="ballot_option"> <div class="ballot_option_title">'+nl2br(curbops[i].t)+'</div> <form>'+oo+'</form> </div>';
  }
  return o;
}



//-------------------------------------------------------------------------
// Hold my coffee while I whip up a discount JQuery
$ja = []; $jao = []; $ja2=[]; $jao2 = [];
class $${
  constructor(eleID){ if(typeof eleID === 'undefined'){ return this;} this.eleID = eleID; this.eleObj = []; if( eleID.charAt(0)=='#' ){this.eleObj[0] = document.getElementById(eleID.substring(1)); }else if( eleID.charAt(0)=='.' ){this.eleObj = document.getElementsByClassName(eleID.substring(1));} else{return false;} }
  show(){ this.runAction('show'); return this; }
  hide(){ this.runAction('hide'); return this; }
  fadeIn(){ this.runAction('fadeIn'); return this; }
  fadeOut(){ this.runAction('fadeOut'); return this; }
  addClass(s){ this.runAction('addClass',s); return this; }
  removeClass(s){ this.runAction('removeClass',s); return this; }
  isChecked(s){ if(typeof s !== 'undefined'){ this.eleObj[0].checked = s; return this; } else { return this.eleObj[0].checked; } }
  val(s) { if(typeof s !== 'undefined'){this.eleObj[0].value = s;       return this; } else { return (this.eleObj[0]==null)?'':this.eleObj[0].value; }       }
  text(s){ if(typeof s !== 'undefined'){this.eleObj[0].textContent = s; return this; } else { return this.eleObj[0].textContent; } }
  data(s,r){ if(typeof r !== 'undefined'){this.eleObj[0].setAttribute('data-'+s,r); return this; } else { return this.eleObj[0].getAttribute('data-'+s); } }
  serialize(o,s){var c=this.eleObj[0].querySelectorAll('input, select, textarea, button');
    for(var i=0;i<c.length;i++){
      if(c[i].id&&document.getElementById(c[i].id).value!==undefined){
        if(!s||startsWith(c[i].id,s)){ if(c[i].type != 'checkbox' || c[i].checked ){ o[c[i].id] = c[i].value; } }
      }
    }
  }
  click(doFunc){ if(doFunc && doFunc!==''){this.runAction('click', doFunc);}else{ document.getElementById(this.eleID).click(); } return this; }
  change(doFunc){ this.runAction('change', doFunc); return this; }
  unclick(){ for(var i=0;i<$jao.length;i++){ try{ $jao[i].removeEventListener('click',$jao[i]); }catch(e){} } $jao = []; }
  unchange(){ for(var i=0;i<$jao2.length;i++){ try{ $jao2[i].removeEventListener('change',$jao2[i]); }catch(e){} } $jao2 = []; }
  html(htm){ this.runAction('html',htm); }
  runAction(action, meta1){
    // Store Selectors and functions for clickable content to reuse when HTML changes are made
    if( action == 'click' ){
      var ifound = false;
      if($ja.length>0){ for(var i=0;i<$ja.length;i++){ if($ja[i][0]==this.eleID){ifound=true;} } }
      if(ifound===false){$ja.push([this.eleID, meta1]);}
    }
    if( action == 'change' ){
      var ifound = false;
      if($ja2.length>0){ for(var i=0;i<$ja2.length;i++){ if($ja2[i][0]==this.eleID){ifound=true;} } }
      if(ifound===false){$ja2.push([this.eleID, meta1]);}
    }
    // Handle actions
  	for(var i=0;i<this.eleObj.length;i++){
      var s = this.eleObj[i]!=null ? this.eleObj[i].style : null;
  		switch(action) {
  		    case 'show':
      				s.display="block"; s.opacity=1;
  		        break;
  		    case 'hide':
  		    		s.display="none";
  		        break;
          case 'fadeIn':
              s.display="block"; s.opacity = 0; s.transition = '0.8s'; setTimeout( function fo(){s.opacity = 1.0;}, 10);
              break;
          case 'fadeOut':
              s.opacity = 1; s.transition = '1s'; s.opacity = 0; setTimeout( function fo(){s.display='none';}, 1000);
              break;
          case 'addClass':
              this.eleObj[i].classList.add(meta1);
              break;
          case 'removeClass':
              var co = this.eleObj.length; this.eleObj[ i ].classList.remove(meta1); if(co !== this.eleObj.length){i--;}
              break;
          case 'click':
              // Store element objects to remove event listeners when HTML changes are made
              var ifound = false;
              if($jao.length>0){ for(var ii=0;ii<$jao.length;ii++){ if($jao[ii]==this.eleObj[i]){ifound=true;} } }
              if(ifound===false){$jao.push([this.eleObj[i]]);}

              if( this.eleObj[i]!=null ){ this.eleObj[i].addEventListener("click",  meta1); }
              break;
          case 'change':
              // Store element objects to remove event listeners when HTML changes are made
              var ifound = false;
              if($jao2.length>0){ for(var ii=0;ii<$jao2.length;ii++){ if($jao2[ii]==this.eleObj[i]){ifound=true;} } }
              if(ifound===false){$jao2.push([this.eleObj[i]]);}

              if( this.eleObj[i]!=null ){ this.eleObj[i].addEventListener("change",  meta1); }
              break;
  		    case 'html':
              this.unclick();this.unchange();
  				    this.eleObj[i].innerHTML = meta1;
              // Rebuild all clickable actions for newly created HTML
              for( var ii=0;ii<$ja.length;ii++ ){ var tempObj = new $$($ja[ii][0]).click($ja[ii][1]); }
              for( var ii=0;ii<$ja2.length;ii++ ){ var tempObj = new $$($ja2[ii][0]).change($ja2[ii][1]); }
  		    	  break;
  		    default:
  		} //End Switch
	  } // End For eleObj array
  } // End runAction
  post(doc,callback,obj,event){
    var x = new XMLHttpRequest();
    x.onreadystatechange = function(){ if(this.readyState == 4 && this.status == 200){ if( typeof callback === 'function'){ callback( JSON.parse(this.responseText), event, this); } } }
    x.open("POST", 'ajax/' + doc + '.php', true);
    x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    x.send( new URLSearchParams(obj).toString() );
  }
}
function $(eleID){ if( typeof eleID === 'object' ){ eleID = '#'+eleID.id; } return new $$(eleID);}


//-------------------------------------------------------------------------
// AJAX POST Response functions 

function vote_check(d,e,res){ resetCSRF(d);
  var imatch = '<span class="cbad">( NO MATCH )</span>';
  if( $( '#verify_user_number_button' + d.o.k ).data('chk') == d.o.chk ){ imatch = '<span class="cgood">( MATCH )</span>' }
  $( '#vote_check_match_div' + d.o.k ).html( d.o.chk + ' ' + imatch ); 
}

function login_account(d,e,res){ resetCSRF(d); if( typeof d != 'undefined' ){ if( d.n == 'logged_in' ){ user = d.u; loadContent_logged_in(); } } }
function create_account(d,e,res){ resetCSRF(d); if( typeof d != 'undefined' ){ if( d.n == 'admin_created' ){ user = d.u; loadContent_logged_in(); } else if(d.n == 'user_waiting_create' ){ loadContent_user_waiting_create(); } } }

function admin_user_allow(d,e,res){ resetCSRF(d); if( typeof d != 'undefined' ){ if(d.e!='invalid_permission_set'){ show_user_allow_html(d.nu,d.ou,d.pa); } } }
function admin_reset_url(d,e,res){ resetCSRF(d); if( typeof d != 'undefined' ){ if(d.e==''){ if(e<2){loadContent_set_result_url();} $('#url_test_output').text(d.o); } } }
function admin_reset_url_check(d,e,res){ resetCSRF(d); }



function admin_access_key(d,e,res){ resetCSRF(d); if( typeof d != 'undefined' ){ if(d.e==''){ $('#create_api_key_output').html('<div class="code">'+d.o+'</div>'); $('#create_api_key').show(); } } }

function admin_party(d,e,res){ resetCSRF(d); if( typeof d != 'undefined' ){ if(d.e==''){ loadContent_admin_party(d.nu); } } }

function vote_ballot(d,e,res){ resetCSRF(d); if( typeof d != 'undefined' && d.e==''){ if(d.a == 1 || d.a == 3){ loadContent_update_settings(d.o); } else { loadContent_update_ballot(d.o); } } }
function test_mode(d,e,res){ goTop(); window.location.reload(); }

function start_vote(d,e,res){
	resetCSRF(d);
	$('#vote_section_3').hide();
    if(d.e!=''){
    	if(d.p && d.p > 0){$('#vote_section_' + d.p).show();}
    }else{
   		$('#vote_section_4').show();
   		$('#my_secret_code_block').text( d.c );
    }
	goTop(); 
}


function vote_image_uploaded_action(ele){ 
  event.preventDefault();
  if( $('#vote_img_file').val() != '' ){
    var reader = new FileReader();
    // Attempt to resize.
    if(ele.files[0].type.match(/image.*/)) {
      reader.onloadend = function(){
        var nimg = new Image();
        nimg.onload = function(){
          var canvas = document.createElement('canvas'); var width  = nimg.width; var height = nimg.height;
          if(width > height && width > 300){ height *= 300 / width; width = 300; }else if( height > 300 ){ width *= 300 / height; height = 300; }
          canvas.width = width; canvas.height = height; canvas.getContext('2d').drawImage(nimg, 0, 0, width, height); uballot.user_img = canvas.toDataURL('image/jpeg');
          if(uballot.user_img.length > image_max_size){doErr('img_size_fail');}else{if( uballot.user_img != '' ){ $('#vote_img_display_box').html('<img id="vote_img_frame" src="'+uballot.user_img+'"/><div class="centertext">If you are happy with your picture, click continue.</div>'); } }
        }
        nimg.src = reader.result;
      }
      reader.readAsDataURL(ele.files[0]);
    } else { doErr('img_missing'); }
  } else { doErr('img_missing'); }
}

//-------------------------------------------------------------------------
// Common Validation
function validateEmail(e){var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; return re.test(e); }
function validPassword(p){var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/; return re.test(p);}
function alfnum(p){var re = /^[a-zA-Z0-9_]*$/; return re.test(p);}
function slen(s,min,max){ return (s.length >= min && s.length <= max)?true:false;}
function showpass(x){ if(x.type==="password" ){x.type="text";}else{x.type="password";} }
function checkbox(i){ if(i==1){return 'checked';}return '';}

function getStateArray(m){for(var i=0;i<countryObj.length;i++){ if(countryObj[i].v==m){ return setOptions(countryObj[i].s); } } return '';}
function setOptions(oo){ var o='';for(var i=0;i<oo.length;i++){o+='<OPTION VALUE="'+oo[i].v+'">'+oo[i].n+'</OPTION>';} return o;}
function selopnums(d1, d2, rev){var o = '';	if( !d2 ){ d2 = 0; } for(var i=d2;i<=d1;i++){ if(rev==1){o='<OPTION value="'+i+'">'+i+'</OPTION>'+o;}else{o+='<OPTION value="'+i+'">'+i+'</OPTION>';} } return o;}

// Country/State [name, value, state [ name, value ]
var countryObj = [
  {n:'US',v:'US',s:[ {n:'',v:''}, {n:'AL',v:'AL'}, {n:'AK',v:'AK'}, {n:'AZ',v:'AZ'}, {n:'AR',v:'AR'}, {n:'CA',v:'CA'}, {n:'CO',v:'CO'}, {n:'CT',v:'CT'}, {n:'DE',v:'DE'}, {n:'FL',v:'FL'}, {n:'GA',v:'GA'}, {n:'HI',v:'HI'}, {n:'ID',v:'ID'}, {n:'IL',v:'IL'}, {n:'IN',v:'IN'}, {n:'IA',v:'IA'}, {n:'KS',v:'KS'}, {n:'KY',v:'KY'}, {n:'LA',v:'LA'}, {n:'ME',v:'ME'}, {n:'MD',v:'MD'}, {n:'MA',v:'MA'}, {n:'MI',v:'MI'}, {n:'MN',v:'MN'}, {n:'MS',v:'MS'}, {n:'MO',v:'MO'}, {n:'MT',v:'MT'}, {n:'NE',v:'NE'}, {n:'NV',v:'NV'}, {n:'NH',v:'NH'}, {n:'NJ',v:'NJ'}, {n:'NM',v:'NM'}, {n:'NY',v:'NY'}, {n:'NC',v:'NC'}, {n:'ND',v:'ND'}, {n:'OH',v:'OH'}, {n:'OK',v:'OK'}, {n:'OR',v:'OR'}, {n:'PA',v:'PA'}, {n:'RI',v:'RI'}, {n:'SC',v:'SC'}, {n:'SD',v:'SD'}, {n:'TN',v:'TN'}, {n:'TX',v:'TX'}, {n:'UT',v:'UT'}, {n:'VA',v:'VA'}, {n:'VT',v:'VT'}, {n:'WA',v:'WA'}, {n:'WV',v:'WV'}, {n:'WI',v:'WI'}, {n:'WY',v:'WY'} ]},
  {n:'CA',v:'CA',s:[ {n:'',v:''}, {n:'NL',v:'NL'}, {n:'PE',v:'PE'}, {n:'NS',v:'NS'}, {n:'NB',v:'NB'}, {n:'QC',v:'QC'}, {n:'ON',v:'ON'}, {n:'MB',v:'MB'}, {n:'SK',v:'SK'}, {n:'AB',v:'AB'}, {n:'BC',v:'BC'}, {n:'YT',v:'YT'}, {n:'NT',v:'NT'}, {n:'NU',v:'NU'} ]}
];


//-------------------------------------------------------------------------
// Initialization on page load
function init(){
  // Put the CSRF in memory, if somoene else copies it out of text js and usees it this will fail, if not then their copy is useless
  $().post('admin_reset_url', admin_reset_url_check, {csrf:csrf, a:-1} );

  // Quick and Dirty Browser support check
  var elem = document.createElement('canvas');
  if(!!!(elem.getContext && elem.getContext('2d'))){ doErr('update_browser');return false; }
  elem.remove();

  if(admin[0]===1){ $("#ilogin").show().click( function(){ loadContent_login(); } ); }

  $("#iHome").click( function(){ loadContent_logged_in(); } );

  $("#ilogout").click( function(){ $().post('logout_account', '', {csrf:csrf} ); window.location.reload(true); } );
  $(".errclose").click( function(){ closeErr(); } );

  $("#user_login_show_password").click(     function(){ showpass( $('#user_login_password').eleObj[0] );   });
  $("#create_account_show_password").click( function(){ showpass( $('#create_login_password').eleObj[0] ); });

  // Verify your secret to match your voter key
  $(".verify_user_number_button").click( function(){
    $().post('vote_check', vote_check, {csrf:csrf, a:1, k:$(this).data('k'), s:$('#verify_user_id_'+$(this).data('k')).val(), p:$(this).data('pub'), r:$(this).data('rnd')} ); 
  });

  $("#login_create_account").click( function(){ loadContent_create_login(); } );
  $("#login_submit").click( function(){
    var e =''; var f = '';
    if( !validateEmail($('#user_login_email').val()) ){                                               e = 'err_email';        f = 'user_login_email'; }
    if( !validPassword($('#user_login_password').val()) ){                                            e = 'err_password';     f = 'user_login_password'; }
    if( !slen($('#user_login_password').val(), 6, 16) ){                                              e = 'err_password_len'; f = 'user_login_password'; }
    if(e==''){
      $().post('login_account', login_account, {csrf:csrf, em:$('#user_login_email').val(), pw:$('#user_login_password').val(), op:$('#user_login_option').val()} );
    } else { doErr(e, f); }
  } );
  $("#login_create_account_action").click( function(){
    var e =''; var f = '';
    if( !validateEmail($('#create_login_email').val()) ){                                               e = 'err_email';        f = 'create_login_email'; }
    if( !validPassword($('#create_login_password').val()) ){                                            e = 'err_password';     f = 'create_login_password'; }
    if( !slen($('#create_login_password').val(), 6, 16) ){                                              e = 'err_password_len'; f = 'create_login_password'; }
    if( !alfnum($('#create_login_firstname').val()) || $('#create_login_firstname').val().length < 2 ){ e = 'err_fn_len';       f = 'create_login_firstname'; }
    if( !alfnum($('#create_login_lastname').val()) || $('#create_login_lastname').val().length < 2 ){   e = 'err_ln_len';       f = 'create_login_lastname'; }
    if(e==''){
      $().post('create_account', create_account, {csrf:csrf, em:$('#create_login_email').val(), pw:$('#create_login_password').val(), fn:$('#create_login_firstname').val(), ln:$('#create_login_lastname').val()} );
    } else { doErr(e, f); }
  });

  // Admin vote functions
//  $("#aop_set_result_url").click( function(){  loadContent_set_result_url(); });
//    $("#reset_url_submit").click( function(){   $().post('admin_reset_url', admin_reset_url, {csrf:csrf, a:1, u:$('#reset_url').val()} ); });
//    $("#reset_url_test").click(   function(){   $().post('admin_reset_url', admin_reset_url, {csrf:csrf, a:2 }, 1 );  });

  $("#aop_vote_verify").click( function(){     loadContent_get_access_key(); });
    $("#create_api_key").click( function(){     $('#create_api_key').hide(); $().post('admin_access_key', admin_access_key, {csrf:csrf } ); });
    $("#reset_url_test2").click(  function(){   $().post('admin_reset_url', admin_reset_url, {csrf:csrf, a:2 }, 2 );  });


  // Approve administration
  $("#aop_allow_users").click( function(){           $().post('admin_user_allow', admin_user_allow, {csrf:csrf, a:1} ); });
    $(".aop_allow_users_approve").click( function(){
      if($('#aop_allow_users_status_'+$(this).data('k')).val() == 0 || $('#aop_allow_users_party_'+$(this).data('k')).val() == 0 ){ doErr("You must select a Privilege level and Party."); return false;}
       $().post('admin_user_allow', admin_user_allow, {csrf:csrf, a:2, k:$(this).data('k'), st:$('#aop_allow_users_status_'+$(this).data('k')).val(), pa:$('#aop_allow_users_party_'+$(this).data('k')).val()} ); 
    });
    $(".aop_allow_users_deny").click( function(){    $().post('admin_user_allow', admin_user_allow, {csrf:csrf, a:3, k:$(this).data('k')} ); });
    $(".aop_allow_users_remove").click( function(){  $().post('admin_user_allow', admin_user_allow, {csrf:csrf, a:4, k:$(this).data('k')} ); });


  // Admin vote setup options
  $("#aop_set_factions").click( function(){       $().post('admin_party', admin_party, {csrf:csrf, a:1} ); });
    $("#create_vote_party").click( function(){    $().post('admin_party', admin_party, {csrf:csrf, a:2, p:$('#create_party_item').val()} ); });
    $(".admin_party_remove").click( function(){   $().post('admin_party', admin_party, {csrf:csrf, a:3, p:$(this).data('k')} ); });



  $("#aop_create_ballot").click(         function(){   loadContent_set_ballot(); });
    $("#ballot_update_settings").click(  function(){   $().post('vote_ballot', vote_ballot, {csrf:csrf, a:1} ); });
    $("#ballot_update_ballot").click(    function(){   $().post('vote_ballot', vote_ballot, {csrf:csrf, a:2} ); });
    $("#ballot_submit_settings").click(  function(){   var $obj = {csrf:csrf, a:3}; $('#ballot_settings_form').serialize($obj); $().post('vote_ballot', vote_ballot, $obj); });

    $("#ballot_save_title_data").click(  function(){   $().post('vote_ballot', vote_ballot, {csrf:csrf, a:4, t1:$('#ballot_textarea').val(), t2:$('#ballot_sub_textarea').val() } ); });
    $("#ballot_add_option").click(       function(){   $('#ballot_option_popup').show(); ballot_option_new_field(); });

    $("#ballot_popup_close").click(      function(){   $('#ballot_option_popup').hide(); });
    $("#ballot_popup_submit").click(     function(){   ballot_option_new_submit(); $().post('vote_ballot', vote_ballot, {csrf:csrf, a:5, o:JSON.stringify(curbops) } ); $('#ballot_option_popup').hide(); });



  $("#aop_start_test_vote").click( function(){       $().post('test_mode', test_mode, {csrf:csrf, a:1} ); });
  $("#aop_start_live_vote").click( function(){       var r = confirm(lib['activate_testmode']); if(r == true){ $().post('test_mode', test_mode, {csrf:csrf, a:2} ); } else { } });
  $("#end_test_vote").click( function(){             loadContent_login(2); });
  

  // Ballot fill in sections
  $("#vote_section_action_1n").click( function(){    if(ballot_meta.ph == "1" && $('#vote_img_file').val().length < 3){ doErr('img_missing'); return false; } $('#vote_section_1').hide(); $('#vote_section_2').show(); goTop(); });
  $("#vote_section_action_2n").click( function(){    // Validate Voter Personal Information
  	var e=''; var f='';
  	if(ballot_meta.co != "" && ballot_meta.co.toUpperCase() != $('#ballot_country').val().toUpperCase() ){  e='ballot_invalid_country'; f='ballot_country'; }
  	if(ballot_meta.st != "" && ballot_meta.st.toUpperCase() != $('#ballot_state').val().toUpperCase() ){    e='ballot_invalid_state';   f='ballot_state';}
  	if(ballot_meta.zi != "" && ballot_meta.zi.toUpperCase().replace(/ /g,'') != $('#ballot_zip').val().toUpperCase().replace(/ /g,'').substr(0,ballot_meta.zi.replace(/ /g,'').length) ){ e='ballot_invalid_zip'; f='ballot_zip'; }
  	var ballot_dob = $('#ballot_byear').val() + ', ' + $('#ballot_bmonth').val() + ', ' + $('#ballot_bday').val();

  	if( ballot_meta.ag != "" && ballot_meta.ag > 0 && getAge(ballot_dob) < ballot_meta.ag ){ e='ballot_invalid_dob';       f='ballot_byear'; }
  	if( ballot_meta.ta != "" && ballot_meta.ta != $('#ballot_tag').val() )                 { e='ballot_invalid_voter_tag'; f='ballot_tag';   }
  	if( ballot_meta.vi == 1  && $('#ballot_vid').val() == '' )                             { e='ballot_invalid_voter_id';  f='ballot_vid';   }
  	if( ballot_meta.ve != "" && $('#ballot_extra').val() == '' )                           { e='ballot_invalid_extra';     f='ballot_extra'; }
  	if( $('#ballot_phone').val() == '' )     { e='ballot_invalid_phone';     f='ballot_phone';     }
  	if( $('#ballot_email').val() == '' )     { e='ballot_invalid_email';     f='ballot_email';     }
  	if( $('#ballot_firstname').val() == '' ) { e='ballot_invalid_firstname'; f='ballot_firstname'; }
  	if( $('#ballot_lastname').val() == '' )  { e='ballot_invalid_lastname';  f='ballot_lastname';  }
  	if( $('#ballot_country').val() == '' )   { e='ballot_invalid_country';   f='ballot_country';   }
  	if( $('#ballot_state').val() == '' )     { e='ballot_invalid_state';     f='ballot_state';     }
  	if( $('#ballot_city').val() == '' )      { e='ballot_invalid_city';      f='ballot_city';      }
  	if( $('#ballot_zip').val() == '' )       { e='ballot_invalid_zip';       f='ballot_zip';       }
  	if( $('#ballot_street').val() == '' )    { e='ballot_invalid_street';    f='ballot_street';    }

  	if(e==''){

      uballot.fn   = $('#ballot_firstname').val();
      uballot.ln   = $('#ballot_lastname').val();
      uballot.mn   = $('#ballot_middlename').val();
      uballot.co   = $('#ballot_country').val();
      uballot.st   = $('#ballot_state').val();
      uballot.ci   = $('#ballot_city').val();
      uballot.zi   = $('#ballot_zip').val();
      uballot.str  = $('#ballot_street').val();
      uballot.str2 = $('#ballot_street2').val();
      uballot.bm   = $('#ballot_bmonth').val();
      uballot.bd   = $('#ballot_bday').val();
      uballot.by   = $('#ballot_byear').val();
      uballot.p    = $('#ballot_phone').val();
      uballot.e    = $('#ballot_email').val();
      uballot.t    = $('#ballot_tag').val();
      uballot.v    = $('#ballot_vid').val();
      uballot.ex   = $('#ballot_extra').val();

      $('#vote_section_2').hide(); $('#vote_section_3').show(); goTop(); 
    } else { doErr(e,f); }
  });
  $("#vote_section_action_2b").click( function(){    $('#vote_section_2').hide(); $('#vote_section_1').show(); goTop(); });
  $("#vote_section_action_3n").click( function(){
	uballot_data = {op:[]};
    var bops = document.getElementsByClassName("ballot_option");
    for (var i=0;i<bops.length;i++) {
    	var bopsx = bops[i].getElementsByClassName("bopsx"); var ballot_selection = [];
	    for (var ii=0;ii<bopsx.length;ii++) {
	    	if( $(bopsx[ii]).data('t') == 'c' ){
	    		// Handle Checkbox
	    		if( $(bopsx[ii]).isChecked() ){ ballot_selection.push( cleaner($(bopsx[ii]).val().toLowerCase()) ); }
	    	}else{
	    		// Handle Write in
	    		if( $(bopsx[ii]).val() != '' ){ ballot_selection.push( cleaner($(bopsx[ii]).val().toLowerCase()) ); }
	    	}
	    }
	    if( $(bops[i]).data('m') == 0 && ballot_selection.length > 1 ){ doErr('ballot_multioption_fail','op_boxx_' + i); goTop(0, 'op_boxx_'+ i,0); return false; }
	    uballot_data.op.push( { o:i, ct:ballot_selection } );
    }
    if( $('#ballot_my_secret').val().length < 8 ){
    	doErr('ballot_invalid_secret','ballot_my_secret'); 
    }else{
	    $().post('start_vote', start_vote, {csrf:csrf, a:2, s:JSON.stringify(uballot), sb:JSON.stringify(uballot_data), sec:$('#ballot_my_secret').val() } ); 
    }
  });
  $("#vote_section_action_3b").click( function(){    $('#vote_section_3').hide(); $('#vote_section_2').show(); goTop(); });


  $("#v_ck_country").change( function(){ $('#v_ck_state').html( getStateArray($('#v_ck_country').val().toUpperCase()) ); });
  $("#ballot_country").change( function(){ $('#ballot_state').html( getStateArray($('#ballot_country').val().toUpperCase()) ); });



  $("#vote_number_check_button").click( function(){  
  	tk_id = $('#vote_number_check1').val().toUpperCase() + '-' +
    		$('#vote_number_check2').val().toUpperCase() + '-' +
	    	$('#vote_number_check3').val().toUpperCase() + '-' +
		    $('#vote_number_check4').val().toUpperCase() + '-' +
		    $('#vote_number_check5').val().toUpperCase() + '-' +
	    	$('#vote_number_check6').val().toUpperCase() + '-' +
		    $('#vote_number_check7').val().toUpperCase();

  	if( $('#vote_number_check1').val() == '' ){
  		$('#ballot_output_totals').show();
  		$('.ballot_output_ballot_list_item').show();
  	}else{
  		$('#ballot_output_totals').hide();

		var mclass = document.getElementsByClassName("ballot_output_ballot_list_item");
		for (var i = 0; i < mclass.length; i++) {
			if( $(mclass[i]).data('k') != tk_id ){
	  			$(mclass[i]).hide();
		  	}
		}
		for(i=1;i<=7;i++){ $('#vote_number_check'+i).val(''); }
  	}
  	goTop();
  });


  // Load welcome page or vote mode
  if(admin[0]==1){ loadContent_welcome(); }else{ loadContent_run_vote();	if(admin[1]!=2){$('#end_test_vote').show();} }

}





//-------------------------------------------------------------------------
// Show the Login Page
function loadContent_welcome(){
  $('#content_box').html(
    '<div id="content_center" class="div_spacer_10">'+
      '<div class="center"><h1>VOTE</h1><div style="font-size:13px">( <span class="frost">FROST</span> <span class="candy">CANDY</span> )</div></div>'+
      '<div>This voting software was developed as a first draft to create a secure on-line vote that will enfranchise more people while maintianing a high level of trust.</div>'+
      '<div>This is some more words to get you started.</div>'+
      '<div>Watch this how to video.</div>'+
    '</div>'
  );
  goTop();
}
//-------------------------------------------------------------------------
// Show the Login Page
function loadContent_login(endvote){
  $('#content_box').html(
    '<div id="content_center">'+
      '<div id="user_login_form" class="form_default_css">'+
        '<p>Please log in:</p>'+
        '<input type="hidden" id="user_login_option" value="'+(endvote==2?"2":"1")+'"/>'+
        '<div><div>E-mail:</div><input type="text" id="user_login_email" value="" placeholder="E-mail"/></div>'+
        '<div><div>Password:</div><input type="password" id="user_login_password" value="" placeholder="password"/>  <span id="user_login_show_password" class="btnact noselect">&#128269;</span>  </div>'+
        '<div> <div id="login_submit" class="btn noselect floatright">Login</div> <div id="login_create_account" class="btn noselect floatright">Create Account</div> </div>'+
      '</div>'+
    '</div>'
  );
  goTop();
}
//-------------------------------------------------------------------------
// Show the Create Login Page
// In the future we may add a way to let only registerd users vote and ask them to provide more information like, birthday, address, picture
function loadContent_create_login(){
  $('#content_box').html(
    '<div id="content_center">'+
      '<div id="user_create_form" class="form_default_css">'+

        '<p>Enter your account information:</p>'+
        '<div><div>E-mail:</div><input type="text" id="create_login_email" value="" placeholder="E-mail"/></div>'+
        '<div><div>Password:</div><input type="password" id="create_login_password" value="" placeholder="password"/> <span id="create_account_show_password" class="btnact noselect">&#128269;</span> </div>'+

        '<div><div>First Name:</div><input type="text" id="create_login_firstname" value="" placeholder="First Name"/></div>'+
        '<div><div>Last Name:</div><input type="text" id="create_login_lastname" value="" placeholder="Last Name"/></div>'+


        '<div> <div id="login_create_account_action" class="btn noselect floatright">Create</div> </div>'+
      '</div>'+
    '</div>'
  );
  goTop();
}
//-------------------------------------------------------------------------
// Show User Create Request Awaiting Approval
function loadContent_user_waiting_create(){
  $('#ilogin').hide();
  $('#content_box').html(
    '<div id="content_center">'+
      '<div>Your user account is waiting for approval from an Administrator. Once accepted you will be able to log into your account.</div>'+
    '</div>'
  );
  goTop();
}
//-------------------------------------------------------------------------
// Show User Account administration area 
function loadContent_logged_in(){
  var o = '';
  $('#ilogin').hide();$('#end_test_vote').hide(); $('#ilogout').show(); $('#iHome').show();
//  if(user[0] >= 1000){ // I am allowed to monitor voter results.
//    o += '<div class="overhide">Use this button to enter the URL you want vote results sent to. <br><span class="ex">Ex: 192.168.1.20</span>  <div id="aop_set_result_url" class="btn noselect floatright">Result URL</div>  </div>';
//  }
  if(user[0] >= 1100){ // I am allowed to verify voters for my faction.
    o += '<div class="overhide">Get your secret access key so you can access<br> the system during an active voting session. <div id="aop_vote_verify" class="btn noselect floatright">Access Key</div>  </div>';
  }
  if(user[0] >= 1110){ // I am allowed to allow new users access.
    o += '<div class="overhide">This button will let you allow more administrative assistants.<br> <span class="ex">Ex: ( Poll Watchers / Vote Validators )</span> <div id="aop_allow_users" class="btn noselect floatright">Users</div>  </div>';
  }
  if(user[0] >= 1111){ // Full access, allow set faction and create votes 
    o += '<div class="overhide">This button will let you set the party affiliation list. <br><span class="ex">Ex: ( Democrat / Republican / Green )</span>  <div id="aop_set_factions" class="btn noselect floatright">Party List</div>  </div>';
    o += '<div class="overhide">Use this button to set up your ballot. <div id="aop_create_ballot" class="btn noselect floatright">Edit Ballot</div>  </div>';
    o += '<div class="overhide">This button will start the election voting process.<br>It will remain active until a vote validator of each party<br> affiliation agrees to stop the vote.  <div id="aop_start_test_vote" class="btn noselect floatright">Start Test Vote</div> <div id="aop_start_live_vote" class="btnorange noselect floatright">Start Live Vote</div> </div>';
  }
  $('#content_box').html(
    '<div id="content_center" class="divunder account_options">'+
      '<h1>Welcome ' + toTitles(user[1]) + '.</h1><br>'+
      '<h3>Account Options:</h3><br>'+
      o +
    '</div>'
  );
  goTop();
}
//-------------------------------------------------------------------------
// Show User Account administration area 
function show_user_allow_html(nu,ou,pa){
  var o = '';var oo='';var par='';
  if(pa.length>1){
    for (let i = 0; i < pa.length; i++){
      par += '<OPTION VALUE="'+pa[i]+'">'+pa[i]+'</OPTION>';
    }
  }
  if(nu.length<1){
    o='There are no new users waiting for approval.'; 
  }else{
    for (let i = 0; i < nu.length; i++){
      o += '<div class="nu_user" data-k="'+nu[i][0]+'">';
      o += '<div>[ <a href="mailto:'+nu[i][1]+'">'+nu[i][1]+' ]</a> '+nu[i][3]+', '+nu[i][2]+'</div>';
      o += '<br><form class="form_soft_css">';
        o += '<SELECT id="aop_allow_users_status_'+nu[i][0]+'" class="aop_allow_users_status">';
          o += '<OPTION VALUE="0">Choose Privilege Level</OPTION>';
          o += '<OPTION VALUE="1000">Monitor</OPTION>';
          o += '<OPTION VALUE="1100">Validator</OPTION>';
          o += '<OPTION VALUE="1110">Allow New Users</OPTION>';
          if( user[0] >= 1111 ){ o += '<OPTION VALUE="1111">Full Admin Access</OPTION>'; }
        o += '</SELECT>';
        o += '<SELECT id="aop_allow_users_party_'+nu[i][0]+'" class="aop_allow_users_party">';
          o += '<OPTION VALUE="0">Choose User Party</OPTION>';
          o += par
        o += '</SELECT>';
      o += '</form>';

      o += '<div id="aop_allow_users_approve_'+nu[i][0]+'" class="aop_allow_users_approve btn noselect floatright" data-k="'+nu[i][0]+'">Allow User</div>';
      o += '<div id="aop_allow_users_deny_'+nu[i][0]+'" class="aop_allow_users_deny btn noselect floatright" data-k="'+nu[i][0]+'">Deny User</div>';
      o +='</div>';
    }
  }
  if(ou.length<1){
    oo='There are no users you can remove.'; 
  }else{
    for (let i = 0; i < ou.length; i++){
      oo += '<div class="nu_user" data-k="'+ou[i][0]+'">';
      oo +=   '<div>[ <a href="mailto:'+ou[i][1]+'">'+ou[i][1]+' ]</a> '+ou[i][3]+', '+ou[i][2]+' <span class="smallinfo">('+ou[i][4]+')</span></div>';
      oo +=   '<div id="aop_allow_users_remove_'+ou[i][0]+'" class="aop_allow_users_remove btn noselect floatright" data-k="'+ou[i][0]+'">Remove User</div>';
      oo += '</div>';
    }
  }

  $('#content_box').html(
    '<div id="content_center" class="div_spacer_10">'+
      '<h2>Approve or Deny new users</h2>'+
      '<div>Use this area to allow or deny new users and set their administrative function levels.<br><br></div>'+
      '<div>1) Monitor - These users will be able to recieve a copy of the vote recipets. Equivilant to the function of a Poll Watcher.</div>'+
      '<div>2) Validator - These users will be able to validate an incoming voter as good or bad for their party affiliation. In order for a vote to be counted one member of each party with the ability to validate must validate the potential voter.</div>'+
      '<div>3) Allow New Users - This allows the user to add more users to the server.</div>'+
      '<div>4) Full Admin Access - This level of permission gives the same access to the server the initial administrator has.</div>'+
      '<div>Note: Every higher level of permission automatically gains permission to lower level permissions.<br><br></div>'+
      '<h3 class="divunder">New User Requests:</h3>'+
      '<div>'+ o + '</div><br><br><br><br>'+
      '<h3 class="divunder">Current Users:</h3>'+
      '<div>'+ oo + '</div>'+
    '</div>'
  );
  goTop();
}
//-------------------------------------------------------------------------
// Show Set Result URL Area
function loadContent_set_result_url(){
  $('#content_box').html(
    '<div id="content_center">'+
      '<div>Set the Address or IP of your machine that will be comunicating with this server during a vote.</div>'+
      '<div><form class="form_default_css"><input type="text" id="reset_url" placeholder="192.168.1.20:8080"/></form></div>'+
      '<div><div id="reset_url_submit" class="btn noselect floatright">Submit</div></div>'+
      '<div>Each networked computer has an address to identify it. Generally this address is a string of numbers like 192.168.1.84 or a domain name like mysite.com.'+
      '<br><br>Following the address, you need to put the port number that computer is listening on. The full address should look like: ADDRESS:PORT</div>'+
      '<div><br><br>Click test to test your connection. <div id="reset_url_test" class="btnorange noselect floatright">TEST</div></div>'+
      '<div id="url_test_output">454</div>'+
    '</div>'
  );
  goTop();
}
//-------------------------------------------------------------------------
// Show User Access Key area
function loadContent_get_access_key(){
  $('#content_box').html(
    '<div id="content_center" class="div_spacer_10">'+
      '<div>To communicate with the vote server once a vote is live, you will need to create your passcode and store it on the client machine.</div>'+
      '<div>Click the create button and copy paste the entire secure code to your client machine. Every time you create a new secure code the old one will become invalid.</div>'+
      '<div><br><br><div id="create_api_key" class="btn noselect floatright">Create</div><br><br></div>'+
      '<div id="create_api_key_output"></div>'+
      //'<div><br><br>Click test to test your connection. <div id="reset_url_test2" class="btnorange noselect floatright">TEST</div></div>'+
      '<div id="url_test_output"></div>'+
    '</div>'
  );
  goTop();
}
//-------------------------------------------------------------------------
// Create Voter Factions
function loadContent_admin_party(nu){
  var o='';
  if(nu.length<1){
    o='There are currently no party affiliations created.'; 
  }else{
    for (let i = 0; i < nu.length; i++){
      o += '<div class="nu_party"><div id="admin_party_remove_'+i+'" class="admin_party_remove btnred noselect floatleft" data-k="'+nu[i]+'">Remove</div> '+nu[i]+'</div>';
    }
  }
  $('#content_box').html(
    '<div id="content_center" class="div_spacer_10">'+
      '<div>Set the differnet vote parties that will be verifying voters so we can distinguish between verifying administrators.</div>'+
      '<div>If you are the initial administrator, the first party you create will become your party affiliation. You can assign affiliations to new users on the user allow page.</div>'+
      '<div><br><br><form class="form_soft_css">Party: <input type="text" id="create_party_item"/></form><div id="create_vote_party" class="btn noselect floatright">Create</div><br><br></div>'+
      '<div id="create_vote_party_output">'+o+'</div>'+
    '</div>'
  );
  goTop();
}
//-------------------------------------------------------------------------
// Ballot Selection Area
function loadContent_set_ballot(){
  $('#content_box').html(
    '<div id="content_center" class="div_spacer_10">'+
      '<div>This area will allow you to build your ballot. Use the settings button to set aspects of the document and the ballot button to create the ballot choices.</div>'+
      '<div><div id="ballot_update_settings" class="btn noselect floatright">Settings</div> <div id="ballot_update_ballot" class="btn noselect floatright">Ballot</div> </div>'+
    '</div>'
  );
  goTop();
}
//-------------------------------------------------------------------------
// Update Ballot Settings
function loadContent_update_settings(vo){
  $('#content_box').html(
    '<div id="content_center" class="div_spacer_10">'+
      '<div>Select your ballot settings:</div>'+
      '<form id="ballot_settings_form" class="form_default_css">'+
          '<div><h3>Choose Voter Requirements:</h3></div>'+
          '<div><div class="leftfieldname">Check Country:       <div class="smallinfodark">Country Code must match what you put here</div>                   </div> <SELECT id="v_ck_country" >'+setOptions(countryObj)+'</SELECT> </div>'+
          '<div><div class="leftfieldname">Check State:         <div class="smallinfodark">State Code must match what you put here</div>                     </div> <SELECT id="v_ck_state"   >'+getStateArray(vo.v_ck_country.toUpperCase())+'</SELECT> </div>'+
          '<div><div class="leftfieldname">Check PostCode:      <div class="smallinfodark">Start of postcode must match what you put here</div>              </div> <input type="text" id="v_ck_zip"          value="'+vo.v_ck_zip+'"       placeholder="11111"/></div>'+
          '<div><div class="leftfieldname">Check Minimum Age:   <div class="smallinfodark">Enter the minimum age, 0 for any age</div>                        </div> <input type="text" id="v_ck_age"          value="'+vo.v_ck_age+'"       placeholder="18"/></div>'+
          '<div><div class="leftfieldname">Require Photo:       <div class="smallinfodark">Check this to force voter to put their voter id</div>             </div> <input type="checkbox" id="v_ck_photo"    '+checkbox(vo.v_ck_photo)+'     /></div>'+
          '<div><div class="leftfieldname">Require Tag Match:   <div class="smallinfodark">User must enter this tag, leave empty if unnecessary</div>        </div> <input type="text" id="v_rq_tag"          value="'+vo.v_rq_tag+'"       placeholder="xyz123"/></div>'+
          '<div><div class="leftfieldname">Require Voter ID#:   <div class="smallinfodark">Check this to force voter to put their voter id</div>             </div> <input type="checkbox" id="v_rq_voter_id" '+checkbox(vo.v_rq_voter_id)+'  /></div>'+
          '<div><div class="leftfieldname">Require Extra Data:  <div class="smallinfodark">Enter additional comma separated field names you require from the voter</div>    </div> <input type="text" id="v_rq_extra"        value="'+vo.v_rq_extra+'"     placeholder="SS#, dog tag number"/></div>'+

          '<div><br><br><h3>Check which data to send to poll watchers:</h3></div>'+
          '<div><div class="leftfieldname">First Name:</div>       <input type="checkbox" id="v_show_fname"   '+checkbox(vo.v_show_fname)+'/></div>'+
          '<div><div class="leftfieldname">Last Name:</div>        <input type="checkbox" id="v_show_lname"   '+checkbox(vo.v_show_lname)+'/></div>'+
          '<div><div class="leftfieldname">Middle Name:</div>      <input type="checkbox" id="v_show_mname"   '+checkbox(vo.v_show_mname)+'/></div>'+
          '<div><div class="leftfieldname">Birthdate:</div>        <input type="checkbox" id="v_show_bdate"   '+checkbox(vo.v_show_bdate)+'/></div>'+
          '<div><div class="leftfieldname">Street:</div>           <input type="checkbox" id="v_show_street"  '+checkbox(vo.v_show_street)+'/></div>'+
          '<div><div class="leftfieldname">Apt#/Street2:</div>     <input type="checkbox" id="v_show_street2" '+checkbox(vo.v_show_street2)+'/></div>'+
          '<div><div class="leftfieldname">City:</div>             <input type="checkbox" id="v_show_city"    '+checkbox(vo.v_show_city)+'/></div>'+
          '<div><div class="leftfieldname">State Code:</div>       <input type="checkbox" id="v_show_state"   '+checkbox(vo.v_show_state)+'/></div>'+
          '<div><div class="leftfieldname">Postal Code:</div>      <input type="checkbox" id="v_show_zip"     '+checkbox(vo.v_show_zip)+'/></div>'+
          '<div><div class="leftfieldname">Country Code:</div>     <input type="checkbox" id="v_show_country" '+checkbox(vo.v_show_country)+'/></div>'+
          '<div><div class="leftfieldname">E-mail Address:</div>   <input type="checkbox" id="v_show_email"   '+checkbox(vo.v_show_email)+'/></div>'+
          '<div><div class="leftfieldname">Phone Number:</div>     <input type="checkbox" id="v_show_phone"   '+checkbox(vo.v_show_phone)+'/></div>'+
          '<div><br><br>Note: Required field data will automatically be sent to poll watchers.</div>'+

      '</form>'+
      '<div> <div id="ballot_submit_settings" class="btn noselect floatright">Update</div> </div>'+
    '</div>'
  );

  $('#v_ck_country').val(vo.v_ck_country);
  $('#v_ck_state').val(vo.v_ck_state);

  goTop();

}
//-------------------------------------------------------------------------
// Update Ballot 
function loadContent_update_ballot(vo){
  var t1 = (vo.v_ballot.hasOwnProperty('t1') && vo.v_ballot.t1) ? vo.v_ballot.t1 : '';
  var t2 = (vo.v_ballot.hasOwnProperty('t2') && vo.v_ballot.t2) ? vo.v_ballot.t2 : '';
  if(vo.v_ballot.hasOwnProperty('o')){ curbops = vo.v_ballot.o; }
  var bopos ='';
  for(var i=0;i<curbops.length+1;i++){ bopos += '<OPTION VALUE="'+i+'" '+((i==curbops.length)?' selected':'')+' >'+(i+1)+'</OPTION>'; }

  var ofull = '<div class="ballot_underline">'+((t1)?nl2br(t1):'Example ballot shown here.')+'</div>'
    + '<div class="ballot_underline2">'+nl2br(t2)+'</div>'
    + ballot_option_fill_options()
    + '<div><div onclick="doErr(\'non_functional_button\');" class="btn noselect floatright">Place My Vote</div></div>'
    + '';

  $('#content_box').html(
    '<div id="ballot_option_popup" class="boxshadow">'+
      '<form class="form_soft_css">'+
	    '<div><div class="leftfieldname">Title:</div> <textarea id="ballot_popup_title" value="" placeholder="Dog Catcher"></textarea> </div>'+
    	'<div id="ballot_popup_options_list"></div>'+
      '</form>'+
      '<div>' +
        '<div class="floatleft smallinfo"><input type="checkbox" id="ballot_option_popup_writein"/> Add Write In</div><div class="floatleft smallinfo"><SELECT id="ballot_option_popup_position">'+bopos+'</SELECT> Position</div>'+
        '<div id="ballot_popup_close" class="btnred floatright">Close</div> <div id="ballot_popup_submit" class="btn floatright">Submit</div> <br><div class="floatleft smallinfo"><input type="checkbox" id="ballot_option_popup_allow_multipul"/> Allow Multi-Choice</div>'+
      '</div>'+
    '</div>'+

    '<div id="content_center" class="div_spacer_10">'+
      '<div class="bottomline overhide">'+
        '<form class="form_bittxtarea_css"><div>Ballot Header Message:<br> <textarea id="ballot_textarea" placeholder="Jan 1, 1980 Election for dog catcher, St. Johns County, Florida.">'+t1+'</textarea></div>'+
        '<div>Ballot Title Message:<br> <textarea id="ballot_sub_textarea" placeholder="Instructions: To vote you must use a current picture with hand written date on paper.">'+t2+'</textarea></form></div>'+
        '<div><br><div id="ballot_save_title_data" class="btn floatright">Save</div></div>'+
      '<br></div>'+
      '<div>Create your ballot selections.</div>'+
      '<div id="ballot_options_list">'+(ballot_option_fill_options())+'</div>'+
      '<div class="overhide width100"> <div id="ballot_add_option" class="btn noselect floatright">Add Selection</div> </div>'+
      '<div id="ofull_sample">Sample Ballot:</div><div id="ofull">'+ofull+'</div>'+
    '</div>'
  );
  goTop();
}

//-------------------------------------------------------------------------
// Handle the actual Users Vote 
function loadContent_run_vote(){
  // Switch to vote ended screen if neccessary
  if( admin[2] == 1){ loadContent_vote_ended(); return false; }

  var cyear  = new Date().getFullYear();

  var t1 = (ballot.hasOwnProperty('t1') && ballot.t1) ? ballot.t1 : '';
  var t2 = (ballot.hasOwnProperty('t2') && ballot.t2) ? ballot.t2 : '';
  if(ballot.hasOwnProperty('o')){ curbops = ballot.o; }
  var ofull = '<div class="overhide">'+
    	'<div class="ballot_underline">'+nl2br(t1)+'</div>'+
    	'<div class="ballot_underline2">'+nl2br(t2)+'</div>'+
    	ballot_option_fill_options(2)+
    '</div>';

  var usepic =  '<div><br><br>Click Continue to start the vote process.</div>';
  if(ballot_meta.ph == "1" ){
    usepic =  '<div><br><br>To begin the vote process please upload a clear picture of yourself holding todays date hand written on a piece of paper. Using a dark crayon or marker will help the camera produce a readable date.</div>'+
              '<div id="vote_img_upload_container"><div id="vote_img_display_box" style="cursor: pointer;" ontouchstart="$(\'vote_img_file\').click();" onclick="$(\'vote_img_file\').click();"><br><br>Click to Select Image<br><br><br></div><form id="img_upload_form" method="POST">'+
               '<input type="file" id="vote_img_file" name="vote_img_file" accept="image/*" value="" onchange="vote_image_uploaded_action(this);" style="visibility:hidden"/>'+
               '<p id="vote_img_status"></p>'+
              '</form></div>';
  }
	$('#content_box').html(
		'<div id="content_center" class="div_spacer_10">'+
			'<div id="vote_section_1" class="vote_sections">'+
				'<div><h1>Welcome to FrostCandy Votes!</h1></div>'+
				'<div>This software will allow you to place your vote online. Simply follow the steps and fill in the information asked of you to complete your vote.</div>'+
        '<div> <div id="vote_details_opening_block">'+t1+'</div> </div>'+
				usepic+
	      '<div><br><br><div id="vote_section_action_1n" class="btn noselect floatright">Continue</div></div>'+
        '<div id="fc_vote_info">'+
            '<div>More info, URLs open in a new tab:</div>'+
            '<div><a target="_blank" href="https://youtu.be/J_uzNzwFuig">How to Vote Video</a></div>'+
            '<div><a target="_blank" href="https://youtu.be/J_uzNzwFuig">FrostCandy Vote Admin Video</a></div>'+
            '<div><a target="_blank" href="">Vote Server Software</a></div>'+
            '<div><a target="_blank" href="">Admin Server Software</a></div>'+
            '<div>Password Generator: <a target="_blank" href="https://passbank.frostcandy.com/">PassBank</a></div>'+
            '<div>Support Freedom: <a target="_blank" href="">Donate</a></div>'+
        '</div>'+
			'</div>'+
			'<div id="vote_section_2" class="vote_sections">'+
		        '<form class="form_default_css">'+

				'<div><h1>Personal Information</h1></div>'+
		        '<div><div>First Name:</div> <input type="text" id="ballot_firstname"/></div>'+
		        '<div><div>Last Name:</div> <input type="text" id="ballot_lastname"/></div>'+
		        '<div><div>Middle Name:</div> <input type="text" id="ballot_middlename"/></div>'+

		        '<div><div>Country:</div> <SELECT id="ballot_country" >'+setOptions(countryObj)+'</SELECT> </div>'+
		        '<div><div>State:</div> <SELECT id="ballot_state" >'+getStateArray("US")+'</SELECT> </div>'+


		        '<div><div>City:</div> <input type="text" id="ballot_city"/></div>'+
		        '<div><div>Post Code:</div> <input type="text" id="ballot_zip"/></div>'+
		        '<div><div>Street:</div> <input type="text" id="ballot_street"/></div>'+
		        '<div><div>Street2:</div> <input type="text" id="ballot_street2"/></div>'+

		        '<div class="divunder bdayfield"><div>Birthdate:</div>'+
		          '<div><SELECT id="ballot_bmonth" placeholder="MM">'+selopnums(12, 1)+'</SELECT></div>'+
		          '<div><SELECT id="ballot_bday" placeholder="DD">'+selopnums(30, 1)+'</SELECT></div>'+
		          '<div><SELECT id="ballot_byear" placeholder="YYYY">'+selopnums(cyear, cyear-150, 1)+'</SELECT></div>'+
		        '</div>'+


		        '<div class="bold">If there are problems with your vote, we may contact you:</div>'+
		        '<div><div>Phone:</div> <input type="text" id="ballot_phone"/></div>'+
		        '<div class="divunder"><div>Email:</div> <input type="text" id="ballot_email"/></div>'+

		        ((ballot_meta.ta != "")?
		        '<div class="bold">To vote you must provide the vote key you were provided.</div>'+
		        '<div class="divunder"><div>Vote Key:</div> <input type="text" id="ballot_tag"/></div>'
				:'')+

		        ((ballot_meta.vi == 1)?
		        '<div class="bold">Put your voter id found on your voter id card:</div>'+
		        '<div class="divunder"><div>Vote ID:</div> <input type="text" id="ballot_vid"/></div>'
				:'')+

		        ((ballot_meta.ve != "")?
		        '<div class="bold">Enter this additional information:</div>'+
		        '<div><div>'+ballot_meta.ve+':</div> <input type="text" id="ballot_extra"/></div>'
				:'')+

		        '</form>'+
		        '<div><div id="vote_section_action_2n" class="btn noselect floatright">Next</div> <div id="vote_section_action_2b" class="btn noselect floatright">Back</div></div>'+
			'</div>'+
			'<div id="vote_section_3" class="vote_sections">'+
				'<div><h1>Ballot Information</h1><br><br></div>'+
				ofull+
				'<div><form class="form_default_css">'+
          'To protect your vote from corruption, enter a secret code that only you will know.<br>'+
          'Your Secret Code: <input type="text" id="ballot_my_secret" value="" maxlength=30/>'+
        '</form></div>'+
       	'<div><div id="vote_section_action_3n" class="btn noselect floatright">Place My Vote</div> <div id="vote_section_action_3b" class="btn noselect floatright">Back</div></div>'+
			'</div>'+
			'<div id="vote_section_4" class="vote_sections">'+
				'<div><h1>Thank You!</h1><br><br></div>'+
				'<div>Your vote has been recorded. <br><br> <span class="bold">Print or save this code so you can verify your vote was not tampered with: <br><br> </span></div>'+
 				'<div id="my_secret_code_block" class="codes"></div>'+
			'</div>'+
		'</div>'
	);
	$('#vote_section_1').show();
  goTop();
} 

//-------------------------------------------------------------------------
// Vote Ended Screen
function vote_number_multi_hop(o){
  // Example Code: 2D68D2-81A469-32F7B1-DC9038-9B4E1E-BC4531-836230
  if( $(o).val().length > 6 ){
    var s = ($(o).val().replace(/-/g,'')).match(/.{1,6}/g);
    for(var i = 0; i<s.length; i++){
      if(i>6){break;}
      $('#vote_number_check'+ parseInt(i+1) ).val( s[i] );
    }
    document.getElementById("vote_number_check1").blur();
  }
}
function set_ballot_info(d){
  end_ballot_array  = d;
  end_ballot_totals = [];

  // Prase out the object - saved some golang coding
  for(i=0;i<d.length;i++){ d[i].c = JSON.parse( d[i].c ); }
  // Sanatize data
  for(i=0;i<d.length;i++){
    for(i2=0;i2<d[i].c.op.length;i2++){
      for(i3=0;i3<d[i].c.op[i2].ct.length;i3++){
        d[i].c.op[i2].ct[i3] = cleaner(d[i].c.op[i2].ct[i3].toLowerCase());
      }
    }
  }

  // Each ballot i
  for(i=0;i<d.length;i++){
    var i_ballot = d[i].c.op;
    // Each ballot option ii
    for(i2=0;i2<i_ballot.length;i2++){
      var i2_ballot_options = i_ballot[i2].ct;

      // Set initial option selection for totals
      if( end_ballot_totals[i2] === undefined ){
        end_ballot_totals[i2]      = [];
        for(i3=0;i3<i2_ballot_options.length;i3++){
           end_ballot_totals[i2].push( [ i2_ballot_options[i3], 1 ] ); 
        }
        continue;
      }

      // Each ballot selected option iii
      for(i3=0;i3<i2_ballot_options.length;i3++){
        // Each updated ballot total
        var ichanged = false;
        for(i4=0;i4<end_ballot_totals[i2].length;i4++){
          if( i2_ballot_options[i3] == end_ballot_totals[i2][i4][0] ){
            end_ballot_totals[i2][i4][1]++;
            ichanged = true;
            break;
          }else if( i2_ballot_options[i3] < end_ballot_totals[i2][i4][0] ){
            end_ballot_totals[i2].splice( i4, 0, [ i2_ballot_options[i3], 1 ] );
            ichanged = true;
            break;
          }
        }
        if(!ichanged){ end_ballot_totals[i2].push( [ i2_ballot_options[i3], 1 ] ); }
      }
    }
  }

  // Create the output (Might address the number of for loops at some point)
  var tog = 'tog2';
  var top_total_votes = 0;
  var o = '<div id="ballot_output_totals">';
  for(i=0;i<end_ballot_totals.length;i++){
  	tog = tog=='tog2'?'tog1':'tog2';
  	o += '<div class="ballot_output_totals_div '+tog+'">';
  	    var o2 = '';
  	    var total_votes = 0;
  	    for(i2=0;i2<end_ballot_totals[i].length;i2++){
  	     	o2 += '<div class="ballot_output_totals_items">';
  	     	     o2 += '<div class="ballot_output_totals_runner">'+end_ballot_totals[i][i2][0]+'</div>';
  	     	     o2 += '<div class="ballot_output_totals_number">'+end_ballot_totals[i][i2][1]+'</div>';
  	     	o2 += '</div>';
  	     	total_votes = total_votes + end_ballot_totals[i][i2][1];
	        top_total_votes = top_total_votes + end_ballot_totals[i][i2][1];
  	    }
	  	o += '<div class="ballot_option_total_title">Option '+(i+1)+' - Total Votes: '+total_votes+'</div>' + o2;
  	o += '</div>';
  }
  o += '</div><div id="ballot_output_ballot_list"><div>List of Ballots:</div>';
  tog = 'tog2';
  for(i=0;i<end_ballot_array.length;i++){
  	tog = tog=='tog2'?'tog1':'tog2';
  	o += '<div id="ballot_output_ballot_list_item'+i+'" class="ballot_output_ballot_list_item '+tog+'" data-k="'+end_ballot_array[i].k+'">';
  	    o += '<div>'+end_ballot_array[i].k+'<div id="vote_check_match_div'+i+'"></div></div>';
        for(i2=0;i2<end_ballot_array[i].c.op.length;i2++){
            o += '<div class="ballot_output_ballot_list_item_choice">'+(i2+1)+') '+ end_ballot_array[i].c.op[i2].ct.join(', ') +'</div>';
  	    }
  	    o += '<div class="verify_user_number_div">';
  	         o += '<div class="floatleft"><input id="verify_user_id_'+i+'" class="verify_user_number_input" type="password"/></div>';
  	         o += '<div id="verify_user_number_button'+i+'" data-k="'+i+'" data-pub="'+end_ballot_array[i].c.pub+'" data-chk="'+end_ballot_array[i].c.chk+'" data-rnd="'+end_ballot_array[i].c.rnd+'" class="verify_user_number_button btn floatright">Verify ME</div>';

  	    o += '</div>';
  	o += '</div>';
  }
  o += '</div>';

  $('#ballot_totals_totalcount').text( end_ballot_array.length );
  $('#top_total_votes').text( top_total_votes );

  $('#end_ballot_list').html( o );
}
function loadContent_vote_ended(){
  fetch('ballots/ballots.blt').then(res => res.json()).then(data => set_ballot_info(data));

  var t1 = (ballot.hasOwnProperty('t1') && ballot.t1) ? ballot.t1 : '';
  $('#content_box').html(
    '<div id="content_center" class="div_spacer_10">'+
      '<div id="vote_section_1" class="vote_sections">'+
        '<div><h1>Welcome to FrostCandy Votes!</h1></div>'+
        '<div>This vote has been completed. Contact your local precincts for more information.</div>'+
          '<div> <div id="vote_details_opening_block">'+t1+'</div> </div>'+
          '<div><br><br>'+
            '<div>Enter your vote code to verify your vote.</div>'+
            '<div id="vote_number_check_container">'+
              '<form>'+
                '<input type="text" id="vote_number_check1" class="vote_number_checks" placeholder="XXXXXX" maxlength=48 oninput="vote_number_multi_hop(this);" /><span>-</span>'+
                '<input type="text" id="vote_number_check2" class="vote_number_checks" placeholder="XXXXXX" maxlength=6 /><span>-</span>'+
                '<input type="text" id="vote_number_check3" class="vote_number_checks" placeholder="XXXXXX" maxlength=6 /><span>-</span>'+
                '<input type="text" id="vote_number_check4" class="vote_number_checks" placeholder="XXXXXX" maxlength=6 /><span>-</span>'+
                '<input type="text" id="vote_number_check5" class="vote_number_checks" placeholder="XXXXXX" maxlength=6 /><span>-</span>'+
                '<input type="text" id="vote_number_check6" class="vote_number_checks" placeholder="XXXXXX" maxlength=6 /><span>-</span>'+
                '<input type="text" id="vote_number_check7" class="vote_number_checks" placeholder="XXXXXX" maxlength=6 />'+
              '</form>'+
            '</div>'+
            '<div id="vote_number_check_button" class="btn noselect floatright">Continue</div>'+
          '</div>'+
      '</div>'+
      '<div id="end_ballot_container">'+
          'Total Ballots: <span id="ballot_totals_totalcount"></span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Total Votes: <span id="top_total_votes"></span>'+
          '<div id="end_ballot_list">'+
          '</div>'+
      '</div>'+
    '</div>'
  );

  $('#vote_section_1').show();
  goTop();
}

