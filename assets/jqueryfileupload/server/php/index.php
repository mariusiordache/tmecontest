<?php
/*
 * jQuery File Upload Plugin PHP Example 5.14
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

error_reporting(E_ALL | E_STRICT);
require('config.php');
require('UploadHandler.php');

$resources = json_decode(file_get_contents('golauncher.config.json'), true);

function get_resource_folder($file_name) {
	
	$resource_id = str_replace(array('.jpg','.jpeg','.png','.9.png'), '', $file_name);
	
	foreach($resources as $screen => $list) {
		if(isset($list[$resource_id]))
			return $list[$resource_id]['folder'];
	}
	
	return 'others';	
}

$upload_handler = new UploadHandler();
