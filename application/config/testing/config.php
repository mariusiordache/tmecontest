<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| Base Site URL
|--------------------------------------------------------------------------
|
| URL to your CodeIgniter root. Typically this will be your base URL,
| WITH a trailing slash:
|
|	http://example.com/
|
| If this is not set then CodeIgniter will guess the protocol, domain and
| path to your installation.
|
*/

// we have a new config file
foreach($GLOBALS['config_file']['config'] as $k => $v) {
    $config[$k] = $v;
}

$config['admin_url']    = $config['base_url'].'/admin';
$config['webroot_path']	= preg_replace('@/application/config/.*@', '',dirname(__FILE__));

/*
|--------------------------------------------------------------------------
| Index File
|--------------------------------------------------------------------------
|
| Typically this will be your index.php file, unless you've renamed it to
| something else. If you are using mod_rewrite to remove the page set this
| variable so that it is blank.
|
*/
$config['index_page'] = '';

/*
|--------------------------------------------------------------------------
| URI PROTOCOL
|--------------------------------------------------------------------------
|
| This item determines which server global should be used to retrieve the
| URI string.  The default setting of 'AUTO' works for most servers.
| If your links do not seem to work, try one of the other delicious flavors:
|
| 'AUTO'			Default - auto detects
| 'PATH_INFO'		Uses the PATH_INFO
| 'QUERY_STRING'	Uses the QUERY_STRING
| 'REQUEST_URI'		Uses the REQUEST_URI
| 'ORIG_PATH_INFO'	Uses the ORIG_PATH_INFO
|
*/
$config['uri_protocol']	= 'AUTO';

/*
|--------------------------------------------------------------------------
| URL suffix
|--------------------------------------------------------------------------
|
| This option allows you to add a suffix to all URLs generated by CodeIgniter.
| For more information please see the user guide:
|
| http://codeigniter.com/user_guide/general/urls.html
*/

$config['url_suffix'] = '';

/*
|--------------------------------------------------------------------------
| Default Language
|--------------------------------------------------------------------------
|
| This determines which set of language files should be used. Make sure
| there is an available translation if you intend to use something other
| than english.
|
*/
$config['language']	= 'en';

/*
|--------------------------------------------------------------------------
| Default Character Set
|--------------------------------------------------------------------------
|
| This determines which character set is used by default in various methods
| that require a character set to be provided.
|
*/
$config['charset'] = 'UTF-8';

/*
|--------------------------------------------------------------------------
| Enable/Disable System Hooks
|--------------------------------------------------------------------------
|
| If you would like to use the 'hooks' feature you must enable it by
| setting this variable to TRUE (boolean).  See the user guide for details.
|
*/
$config['enable_hooks'] = FALSE;


/*
|--------------------------------------------------------------------------
| Class Extension Prefix
|--------------------------------------------------------------------------
|
| This item allows you to set the filename/classname prefix when extending
| native libraries.  For more information please see the user guide:
|
| http://codeigniter.com/user_guide/general/core_classes.html
| http://codeigniter.com/user_guide/general/creating_libraries.html
|
*/
$config['subclass_prefix'] = 'MY_';


/*
|--------------------------------------------------------------------------
| Allowed URL Characters
|--------------------------------------------------------------------------
|
| This lets you specify with a regular expression which characters are permitted
| within your URLs.  When someone tries to submit a URL with disallowed
| characters they will get a warning message.
|
| As a security measure you are STRONGLY encouraged to restrict URLs to
| as few characters as possible.  By default only these are allowed: a-z 0-9~%.:_-
|
| Leave blank to allow all characters -- but only if you are insane.
|
| DO NOT CHANGE THIS UNLESS YOU FULLY UNDERSTAND THE REPERCUSSIONS!!
|
*/
$config['permitted_uri_chars'] = 'a-z 0-9~%.:_\-\+\|,;';


/*
|--------------------------------------------------------------------------
| Enable Query Strings
|--------------------------------------------------------------------------
|
| By default CodeIgniter uses search-engine friendly segment based URLs:
| example.com/who/what/where/
|
| By default CodeIgniter enables access to the $_GET array.  If for some
| reason you would like to disable it, set 'allow_get_array' to FALSE.
|
| You can optionally enable standard query string based URLs:
| example.com?who=me&what=something&where=here
|
| Options are: TRUE or FALSE (boolean)
|
| The other items let you set the query string 'words' that will
| invoke your controllers and its functions:
| example.com/index.php?c=controller&m=function
|
| Please note that some of the helpers won't work as expected when
| this feature is enabled, since CodeIgniter is designed primarily to
| use segment based URLs.
|
*/
$config['allow_get_array']		= TRUE;
$config['enable_query_strings'] = FALSE;
$config['controller_trigger']	= 'c';
$config['function_trigger']		= 'm';
$config['directory_trigger']	= 'd'; // experimental not currently in use

/*
|--------------------------------------------------------------------------
| Error Logging Threshold
|--------------------------------------------------------------------------
|
| If you have enabled error logging, you can set an error threshold to
| determine what gets logged. Threshold options are:
| You can enable error logging by setting a threshold over zero. The
| threshold determines what gets logged. Threshold options are:
|
|	0 = Disables logging, Error logging TURNED OFF
|	1 = Error Messages (including PHP errors)
|	2 = Debug Messages
|	3 = Informational Messages
|	4 = All Messages
|
| For a live site you'll usually only enable Errors (1) to be logged otherwise
| your log files will fill up very fast.
|
*/
$config['log_threshold'] = 4;

/*
|--------------------------------------------------------------------------
| Error Logging Directory Path
|--------------------------------------------------------------------------
|
| Leave this BLANK unless you would like to set something other than the default
| application/logs/ folder. Use a full server path with trailing slash.
|
*/
$config['log_path'] = '';

/*
|--------------------------------------------------------------------------
| Date Format for Logs
|--------------------------------------------------------------------------
|
| Each item that is logged has an associated date. You can use PHP date
| codes to set your own date formatting
|
*/
$config['log_date_format'] = 'Y-m-d H:i:s';

/*
|--------------------------------------------------------------------------
| Cache Directory Path
|--------------------------------------------------------------------------
|
| Leave this BLANK unless you would like to set something other than the default
| system/cache/ folder.  Use a full server path with trailing slash.
|
*/
$config['cache_path'] = '';

/*
|--------------------------------------------------------------------------
| Encryption Key
|--------------------------------------------------------------------------
|
| If you use the Encryption class or the Session class you
| MUST set an encryption key.  See the user guide for info.
|
*/
$config['encryption_key'] = 'DiU3s1tZHl';

/*
|--------------------------------------------------------------------------
| Session Variables
|--------------------------------------------------------------------------
|
| 'sess_cookie_name'		= the name you want for the cookie
| 'sess_expiration'			= the number of SECONDS you want the session to last.
|   by default sessions last 7200 seconds (two hours).  Set to zero for no expiration.
| 'sess_expire_on_close'	= Whether to cause the session to expire automatically
|   when the browser window is closed
| 'sess_encrypt_cookie'		= Whether to encrypt the cookie
| 'sess_use_database'		= Whether to save the session data to a database
| 'sess_table_name'			= The name of the session database table
| 'sess_match_ip'			= Whether to match the user's IP address when reading the session data
| 'sess_match_useragent'	= Whether to match the User Agent when reading the session data
| 'sess_time_to_update'		= how many seconds between CI refreshing Session Information
|
*/
$config['sess_cookie_name']		= 'ci_session';
$config['sess_expiration']		= 7200;
$config['sess_expire_on_close']	= TRUE;
$config['sess_encrypt_cookie']	= FALSE;
$config['sess_use_database']	= FALSE;
$config['sess_table_name']		= 'ci_sessions';
$config['sess_match_ip']		= FALSE;
$config['sess_match_useragent']	= TRUE;
$config['sess_time_to_update']	= 300;

/*
|--------------------------------------------------------------------------
| Cookie Related Variables
|--------------------------------------------------------------------------
|
| 'cookie_prefix' = Set a prefix if you need to avoid collisions
| 'cookie_domain' = Set to .your-domain.com for site-wide cookies
| 'cookie_path'   =  Typically will be a forward slash
| 'cookie_secure' =  Cookies will only be set if a secure HTTPS connection exists.
|
*/

$config['cookie_prefix']	= "";

$config['cookie_path']		= "/";
$config['cookie_secure']	= FALSE;

/*
|--------------------------------------------------------------------------
| Global XSS Filtering
|--------------------------------------------------------------------------
|
| Determines whether the XSS filter is always active when GET, POST or
| COOKIE data is encountered
|
*/
$config['global_xss_filtering'] = FALSE;

/*
|--------------------------------------------------------------------------
| Cross Site Request Forgery
|--------------------------------------------------------------------------
| Enables a CSRF cookie token to be set. When set to TRUE, token will be
| checked on a submitted form. If you are accepting user data, it is strongly
| recommended CSRF protection be enabled.
|
| 'csrf_token_name' = The token name
| 'csrf_cookie_name' = The cookie name
| 'csrf_expire' = The number in seconds the token should expire.
*/
$config['csrf_protection'] = FALSE;
$config['csrf_token_name'] = 'csrf_test_name';
$config['csrf_cookie_name'] = 'csrf_cookie_name';
$config['csrf_expire'] = 7200;

/*
|--------------------------------------------------------------------------
| Output Compression
|--------------------------------------------------------------------------
|
| Enables Gzip output compression for faster page loads.  When enabled,
| the output class will test whether your server supports Gzip.
| Even if it does, however, not all browsers support compression
| so enable only if you are reasonably sure your visitors can handle it.
|
| VERY IMPORTANT:  If you are getting a blank page when compression is enabled it
| means you are prematurely outputting something to your browser. It could
| even be a line of whitespace at the end of one of your scripts.  For
| compression to work, nothing can be sent before the output buffer is called
| by the output class.  Do not 'echo' any values with compression enabled.
|
*/
$config['compress_output'] = FALSE;

/*
|--------------------------------------------------------------------------
| Master Time Reference
|--------------------------------------------------------------------------
|
| Options are 'local' or 'gmt'.  This pref tells the system whether to use
| your server's local time as the master 'now' reference, or convert it to
| GMT.  See the 'date helper' page of the user guide for information
| regarding date handling.
|
*/
$config['time_reference'] = 'local';


/*
|--------------------------------------------------------------------------
| Rewrite PHP Short Tags
|--------------------------------------------------------------------------
|
| If your PHP installation does not have short tag support enabled CI
| can rewrite the tags on-the-fly, enabling you to utilize that syntax
| in your view files.  Options are TRUE or FALSE (boolean)
|
*/
$config['rewrite_short_tags'] = FALSE;


/*
|--------------------------------------------------------------------------
| Reverse Proxy IPs
|--------------------------------------------------------------------------
|
| If your server is behind a reverse proxy, you must whitelist the proxy IP
| addresses from which CodeIgniter should trust the HTTP_X_FORWARDED_FOR
| header in order to properly identify the visitor's IP address.
| Comma-delimited, e.g. '10.0.1.200,10.0.1.201'
|
*/
$config['proxy_ips'] = '';

/* End of file config.php */
/* Location: ./application/config/config.php */

/*
|--------------------------------------------------------------------------
| URL Base 
|--------------------------------------------------------------------------
|
| This is the base url to the asset directories. We use this to build 
| the FQDN urls that get called in the css / js tags.
|     
*/

$config['assets']['js_url']    = $config['base_url'] .'/assets';
$config['assets']['css_url']   = $config['base_url'] .'/assets';
$config['assets']['less_url']  = $config['base_url'] .'/assets';
$config['assets']['img_url']   = isset($config['assets_url']) ? $config['assets_url'] : $config['base_url'] .'/assets';
$config['assets']['cache_url'] = $config['base_url'].'/cache/';

$config['theme_resources_path'] = $config['webroot_path'].'/themes';
$config['theme_resources_url']  = $config['base_url'].'/themes';
$config['project_templates_path'] = $config['webroot_path'].'/project_templates';
$config['download_path'] = $config['webroot_path'].'/download';
$config['launcher_config_path'] = $config['webroot_path'].'/launchers';

$config['reports_path'] = $config['webroot_path'] . '/reports';


/*
|--------------------------------------------------------------------------
| Script & Style Directory
|--------------------------------------------------------------------------
|
| Path to the script & style directory.  Relative to the CI front controller.
|
*/

$config['assets']['js_path']  = $config['webroot_path'].'/assets';
$config['assets']['css_path'] = $config['webroot_path'].'/assets';
$config['assets']['less_path'] = $config['webroot_path'].'/assets';
$config['assets']['img_path'] = $config['webroot_path'].'/assets';


/*
|--------------------------------------------------------------------------
| Cache Directory
|--------------------------------------------------------------------------
|
| Path to the cache directory. Must be writable. Relative to the CI 
| front controller.
|
*/

$config['assets']['cache_path'] = 'cache/';


/*
|--------------------------------------------------------------------------
| Rackspace Cloud Files
|--------------------------------------------------------------------------
|
| If you setup the configs below your assets will be uploaded to Rackspace 
| CloudFiles. A css / js tag with a direct url to these files will be returned
| when in production mode. Please note you can only have one cloud 
| storage provider set at a time. The system will only use one of them.
| (please include a trailing slash on rs_url)
||
*/

$config['assets']['rs_container'] = '';
$config['assets']['rs_url'] = '';


/*
|--------------------------------------------------------------------------
| Amazon S3
|--------------------------------------------------------------------------
|
| If you setup the configs below your assets will be uploaded to Amazon 
| S3. A css / js tag with a direct url to these files will be returned
| when in production mode. Please note you can only have one cloud 
| storage provider set at a time. The system will only use one of them.
| (please include a trailing slash on az_url)
|
| $config['assets']['az_bucket'] = 'assets';
| $config['assets']['az_url'] = 'https://s3.amazonaws.com/assets/';
|
| Make sure you create this container with Amazon S3
|
*/

$config['assets']['az_bucket'] = '';
$config['assets']['az_url'] = '';


/*
|--------------------------------------------------------------------------
| Cloud Storage Folders.
|--------------------------------------------------------------------------
|
| Sometimes you might have a folder you want to upload to cloud storage.
| As part of our automated process we want to be able to upload these 
| folders for you. An example would be an images folder. Your combined
| CSS is good to put in cloud storage but uploading the images that 
| make up your website is even better. 
|
| Below is an array of folder paths. This system will loop through the 
| different files in these folders and make sure they are uploaded
| to your cloud storage. So in the case of Racksapce we would create a 
| "folder" at rackspace named the same thing. http://cdnurl.com/foldername/file1.jpg.
|
| We do not delete files on rackspace but we will update or add. The reason we do not 
| delete is this is the web. If you upload one file someone could link to it. If you
| delete it you just broke thier link. If you update or add a file to the folders
| the file will make its way to your cloud storage provider.
|
| $config['assets']['folders'][] = array('name' => 'images', 'path' => './assets/css/images');
| $config['assets']['folders'][] = array('name' => 'fonts', 'path' => './assets/css/fonts');
|
|
*/

// $config['assets']['folders'][] = array(); 

$config['project']['name'] = 'AndroidMakeup';

if (!function_exists('kms_autoload')) {

	function kms_autoload($class) {				
		global $config;
		if(strpos($class, 'CI_') !== 0 && strpos($class, $config['subclass_prefix'])!==0) {
			if(file_exists(KMSPATH.'/core/'. $class . EXT))
				@include_once(KMSPATH.'/core/'. $class . EXT);
			else {
				@include_once(KMSPATH.'/libraries/'. $class . EXT);
			}
		}
	}

	spl_autoload_register('kms_autoload');
}

?>