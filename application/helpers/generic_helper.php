<?php

if (!function_exists("has_access")) {

    function has_access($feature) {
        return get_instance()->current_user->has_access($feature);
    }

}

if (!function_exists("get_user_id")) {

    function get_user_id() {
        return is_object(get_instance()->current_user) ? get_instance()->current_user->get('login.id') : null;
    }

}

if (!function_exists('force_login')) {

    function force_login($request_mode = 'ajax') {

        if (!get_instance()->current_user->is_logged_in()) {

            switch ($request_mode) {
                case 'ajax':
                    echo 'login_timeout';
                    break;
                default:
                    redirect('user/login?goback=' . urlencode(current_url()));
                    break;
            }

            die();
        }
    }

}

if (!function_exists('get_country_time_offset')) {
    
    function get_country_time_offset($remote_country, $origin_country = null) {
        $remote_tz = array_shift(DateTimeZone::listIdentifiers(DateTimeZone::PER_COUNTRY, strtoupper($remote_country)));
        $origin_tz = null;
        
        if ($origin_country) {
            $origin_tz = array_shift(DateTimeZone::listIdentifiers(DateTimeZone::PER_COUNTRY, strtoupper($origin_country)));
        }
        
        return get_timezone_offset($remote_tz, $origin_tz);
    }
}

if (!function_exists('get_timezone_offset')) {

    function get_timezone_offset($remote_tz, $origin_tz = null) {
        if($origin_tz === null) {
            if(!is_string($origin_tz = date_default_timezone_get())) {
                return false; // A UTC timestamp was returned -- bail out!
            }
        }
        $origin_dtz = new DateTimeZone($origin_tz);
        $remote_dtz = new DateTimeZone($remote_tz);
        $origin_dt = new DateTime("now", $origin_dtz);
        $remote_dt = new DateTime("now", $remote_dtz);
        $offset = $origin_dtz->getOffset($origin_dt) - $remote_dtz->getOffset($remote_dt);
        return $offset;
    }
}

if (!function_exists('getFileSize')) {

    function getFileSize($size) {
        if ($size < 1024) {
            return $size . " B";
        } elseif ($size < 1024 * 1024) {
            return round($size/1024,1). " KB";
        } else {
            return round($size/1024/1024,1). " MB";
        }
    }
}

if (!function_exists('getTimeSince')) {

    function getTimeSince($time) {
        if ($time == null) {
            return 'never';
        }
        if (preg_match("@[^0-9]@", $time)) {
            $time = strtotime($time);
        }

        $time = time() - $time;

        if (!$time) {
            return 'now';
        }

        $tokens = array(
            31536000 => 'year',
            2592000 => 'month',
            604800 => 'week',
            86400 => 'day',
            3600 => 'hr',
            60 => 'min',
            1 => 'sec'
        );

        foreach ($tokens as $unit => $text) {
            if ($time < $unit)
                continue;
            $numberOfUnits = floor($time / $unit);
            return $numberOfUnits . ' ' . $text . (($numberOfUnits > 1) ? 's' : '') . ' ago';
        }
    }
}

if (!function_exists('force_admin')) {

    function force_admin($request_mode = 'ajax') {

        if (!get_instance()->current_user->is_admin()) {

            switch ($request_mode) {
                case 'ajax':
                    echo 'login_timeout';
                    break;
                default:
                    redirect('user/login?goback=' . urlencode(current_url()));
                    break;
            }

            die();
        }
    }

}

if (!function_exists('db_string_to_words')) {

    function db_string_to_words($key) {
        // build nice alias
        $key = preg_replace("@^id_@", "", $key);
        $new_key = preg_replace("@[^0-9A-Za-z/\\\]@", " ", $key);
        $keys = explode(" ", $new_key);
        foreach ($keys as &$k) {
            $k = ucfirst($k);
        }
        $key = implode(" ", $keys);
        $key = str_replace("Table", " Table", $key);
        return $key;
    }

}

if (!function_exists('array_column')) {

    function array_column($array, $column) {
        $new_array = array();
        foreach ($array as $row) {
            if (isset($row[$column])) {
                $new_array[] = $row[$column];
            }
        }

        return $new_array;
    }

}

function remove_similar_resources($filepath) {

    $extensions = array('.jpg', '.jpeg', '.9.png', '.png');

    $ext = '.' . array_pop(explode('.', $filepath));
    $filepath = str_replace($ext, '', $filepath);
    if (substr($filepath, -1) == '9') {
        $ext = '.9.png';
        $filepath = substr($filepath, 0, strlen($filepath) - 2);
    }

    foreach ($extensions as $e) {
        if ($e != $ext) {
            if (file_exists($filepath . $e))
                unlink($filepath . $e);
        }
    }
}

function get_resource_folder($file_name) {
    $resources = get_instance()->globals['current_theme']->get_editor_config();

    $resource_id = str_replace(array('.jpg', '.jpeg', '.9.png', '.png'), '', $file_name);
    foreach ($resources['assets'] as $folder => $list) {
        if (isset($list[$resource_id]))
            return $folder;
    }

    return 'temp';
}
