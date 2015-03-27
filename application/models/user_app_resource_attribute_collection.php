<?php

class user_app_resource_attribute_collection extends kms_item_collection {

    public function __construct() {
        parent::__construct();
        $this->_load_crud_data('user_app_resource_attribute');
    }
    
    public function setForResource($resource_id, $attributes) {
        $existing = kms_assoc_by_field($this->get(array('resource_id' => $resource_id)), 'item');
        $new = array();
        
        foreach($attributes as $attribute => $value) {
            if (isset($existing[$attribute])) {
                if ($existing[$attribute]['value'] != $value) {
                    $this->save(array(
                        'value' => $value
                    ), $existing[$attribute]['id']);
                }
            } else {
                $new[] = array(
                    'resource_id' => $resource_id,
                    'item' => $attribute,
                    'value' => $value
                );
            }
        }
        
        if (!empty($new)) {
            $this->add_multiple($new);
        }
        
        return true;
    }
    
    public function getForResource($resource_id) {
        
        $this->load->model('user_app_type_config_collection');
        $this->load->model('user_app_resource_collection');
        
        return $this->user_app_type_config_collection->get(array(
            'b.id = ' . $resource_id, "a.type NOT IN('file', 'resource')"
        ), null, null, null, array(
            'sql_join' => "
                INNER JOIN {$this->user_app_resource_collection->get_data_table()} b ON a.app_id = b.app_id AND a.type_id = b.type_id
                LEFT JOIN {$this->get_data_table()} c ON c.resource_id = b.id AND a.item = c.item
                ",
            'fields' => 'a.type, a.item, a.required, c.value'
        ));
    }

}
