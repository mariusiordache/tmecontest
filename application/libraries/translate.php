<?php

class translate {

    private $_CI;

    public function __construct() {
        $this->_CI = get_instance();
        $this->_CI->load->model('template_string_collection');
        $this->_CI->load->model('language_collection');
    }

    public function push_to_xml($launcher_id, $folder) {

        $launcher_identifier = $this->_CI->launchers[$launcher_id]['identifier'];

        $folder_path = $this->_CI->config->item('launcher_config_path') . '/' . $launcher_identifier . '/' . $folder . '/res';
        //header("Content-type: text/plain;charset=utf-8");
        $languages = $this->_CI->language_collection->get();
        foreach ($languages as $language) {
            $xml_addon = '';
            $strings = $this->_CI->template_string_collection->get(array('launcher_id' => $launcher_id, 'folder' => $folder, 'language_id' => $language['id']));
            foreach ($strings as $string) {
                if (strlen($string['string_value']) > 0) {
                    $value = html_entity_decode($string['string_value'], ENT_QUOTES);
                    $value = addslashes(strip_slashes($value));
                    $value = str_replace('&', '&amp;', $value);
                    $value = preg_replace('@^(\?)@', '\\?', $value);
                    
                    $xml_addon .= "\n\t" . '<string name="' . $string['string_identifier'] . '">' . $value . '</string>';
                }
            }
            if (strlen($xml_addon) > 0) {
                $xml = '<?xml version="1.0" encoding="utf-8" standalone="no"?>' . "\n" . '<resources>';
                $xml .= $xml_addon;
                $xml .= "\n" . '</resources>';

                $file_location = $folder_path . '/values' . ( $language['is_primary'] ? '' : '-' . $language['iso_code'] );
                if (!is_dir($file_location))
                    mkdir($file_location, 0755, true);
                $file = $file_location . '/strings.xml';
                file_put_contents($file, $xml);
                @chmod($file, 0664);
            }
        }
    }
    
    public function string($string, $language_code, $source_language = 'en') {
        $this->_CI->config->load('google');
        $api_key = $this->_CI->config->item('translate_api_key', 'google');
        $translate_url = 'https://www.googleapis.com/language/translate/v2?key=' . $api_key . '&source='.$source_language.'&format=html&q='.urlencode($string).'&target=' . $language_code;
        
        $content = file_get_contents($translate_url);
        
        $result = json_decode($content, true);
        if (!empty($result['data']['translations'])) {
            return $result['data']['translations'][0]['translatedText'];
        }
        
        return false;
    }

    public function google_translate_blanks($launcher_id, $folder) {

        if (!is_numeric($launcher_id) || $launcher_id == 0 || !preg_match('/[a-z_]+/', $folder))
            return array('success' => false, 'folder' => $folder, 'launcher_id' => $launcher_id);

        $this->_CI->config->load('google');
        $api_key = $this->_CI->config->item('translate_api_key', 'google');
        $translate_url = 'https://www.googleapis.com/language/translate/v2?key=' . $api_key . '&source=en&format=html&q=%query%&target=%target%';

        $languages = $this->_CI->language_collection->get();
        $languages = kms_assoc_by_field($languages);
        foreach ($languages as $lang_id => $lang) {
            if ($lang['is_primary'])
                $main_language_id = $lang_id;
        }

        $primary_language_strings = $this->_CI->template_string_collection->get(array(
            'language_id' => $main_language_id,
            'launcher_id' => $launcher_id,
            'folder' => $folder
        ));


        $empty_strings = $this->_CI->template_string_collection->get(array('launcher_id' => $launcher_id, 'folder' => $folder, 'string_value=""'));

        foreach ($empty_strings as $string) {
            /* identifty corresponding string in the primary language */
            $source_string = '';
            foreach ($primary_language_strings as $primary_string) {
                if ($primary_string['launcher_id'] == $string['launcher_id'] && $primary_string['string_identifier'] == $string['string_identifier'])
                    $source_string = $primary_string['string_value'];
            }
            error_log('To translate: ' . $source_string);
            /* find the target language code */
            $language_code = $languages[$string['language_id']]['iso_code'];
            error_log('Target lang: ' . $language_code);

            $result = json_decode(file_get_contents(str_replace(array('%query%', '%target%'), array(urlencode($source_string), $language_code), $translate_url)), true);
            $translated_string = $result['data']['translations'][0]['translatedText'];

            $this->_CI->template_string_collection->update_filtered(
                    array('string_value' => $translated_string), array('id' => $string['id'])
            );
        }

        return array('success' => true, 'folder' => $folder, 'launcher_id' => $launcher_id);
    }

}
