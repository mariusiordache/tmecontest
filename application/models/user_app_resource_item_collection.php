<?php

class user_app_resource_item_collection extends kms_item_collection {

    public function __construct() {
        parent::__construct();
        $this->_load_crud_data('user_app_resource_item');
    }

    public function deleteById($id) {
        $CI = get_instance();
        $CI->load->model('user_app_resource_collection');
        $CI->load->model('user_app_collection');
        
        $user_id = $CI->current_user->get('login.id');
        
        $existing = $this->get_one(array('a.id = ' . $id), null, null, null, array(
            'sql_join' => "INNER JOIN {$this->user_app_resource_collection->get_data_table()} b ON b.id = a.resource_id " .
                          "INNER JOIN {$this->user_app_collection->get_data_table()} c ON c.id = b.app_id",
            'fields' => 'a.id, c.user_id, b.store_dir, a.value, a.item_type_id, a.config_id, a.resource_id'
        ));
            
        if (empty($existing)) {
            throw new Exception("Resource item does not exists!");
        }
        
        if ($existing['user_id'] != $user_id) {
            throw new Exception("You are not allowed to modify this resource!");
        }
        
        if ((int)$existing['item_type_id'] === 1) {
            // is a file, delete it from disk
            @unlink($this->config->item('webroot_path') . '/'.$existing['store_dir'] . '/'. $existing['config_id'] . '/' . $existing['value']);
            
            $this->user_app_resource_collection->save(array('date_packed' => 'NULL'), $existing['resource_id']);
        }
        
        return $this->delete($id);
    }
    
    public function updateItem($item) {
        if (empty($item['id'])) {
            $existing = $this->get_one(array(
                'resource_id' => $item['resource_id'],
                'config_id' => $item['config_id'],
                'item' => $item['item']
            ));
            
            $item['id'] = !empty($existing) ? $existing['id'] : null;
        }
        
        $data = $this->save($item, $item['id']);
        
        $item['id'] = !empty($item['id']) ? $item['id'] : $data['id'];
        return $item;
    }
    
}