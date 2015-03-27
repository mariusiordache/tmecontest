<?php

class upload_user_settings_collection extends kms_item_collection {

    public function __construct() {
        parent::__construct();
        $this->_load_crud_data('upload_user_settings');
    }

    public function getForCurrentUser($item = null) {
        $CI = get_instance();
        $CI->load->model('upload_settings_collection');
        
        $filters = array('b.user_id' => $CI->current_user->get('login.id'));
        
        if ($item) {
            $filters['item'] = $item;
        }
        
        return kms_assoc_by_field($CI->upload_settings_collection->get($filters, null, null, null, array(
            'sql_join' => "LEFT JOIN {$this->get_data_table()} b ON b.settings_id = a.id",
            'fields' => 'a.*, COALESCE(b.value, a.default_value) as value, b.id as user_settings_id'
        )), 'item');
    }
    
    public function getSettingsValue($item) {
        $existing = array_shift($this->getForCurrentUser($item));
        
        return $existing['value'];
    }
    
    public function saveSettings($item, $value) {
        $existing = array_shift($this->getForCurrentUser($item));
        
        if (empty($existing['user_settings_id'])) {
            $CI = get_instance();
            return $this->save(array(
                'user_id' => $CI->current_user->get('login.id'),
                'settings_id' => $existing['id'],
                'value' => $value
            ));
        } else {
            return $this->save(array(
                'value' => $value
            ), $existing['user_settings_id']);
        }
    }
}
