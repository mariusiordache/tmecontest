<?php

class user_app_resource_collection extends kms_item_collection {

    public function __construct() {
        parent::__construct();
        $this->_load_crud_data('user_app_resource');
    }
    
    public function getItems($resource_id, $config_id = null) {
        $this->load->model('user_app_resource_item_collection');
        $this->load->model('user_app_type_config_collection');
        $this->load->model('app_config_collection');
        $this->load->model('resource_type_collection');
        $this->load->model('user_app_resource_collection');
        
        $default_config = $this->app_config_collection->get_default_id();
        $config_id = !empty($config_id) ? $config_id : $default_config;
        
        $items = $this->user_app_resource_item_collection->get(array(
            'resource_id' => $resource_id,
            'config_id' => $config_id
        ), null, null, null, array(
            'sql_join' => "LEFT JOIN {$this->user_app_resource_collection->get_data_table()} b ON b.id = a.resource_id
                LEFT JOIN {$this->resource_type_collection->get_data_table()} c ON c.id = a.item_type_id
            ",
            'fields' => "c.name as type, a.item, a.value"
        ));
        
        $return = array();
        foreach($items as $item) {          
            if ($item['type'] == 'file') {
                $item['value'] = array(
                    'file' => $item['value'],
                    'config' => (int)$config_id
                );
            }
            
            $return[$item['type']][$item['item']] = $item['value'];
        }                
        
        if ($config_id <> $default_config) {
            $default = $this->getItems($resource_id, $default_config);
            
            foreach($default as $type => $def_items) {
                foreach($def_items as $item => $value) {
                    if (!isset($return[$type][$item])) {
                        $return[$type][$item] = $value;
                    }
                }
            }
        }
                
                
        return $return;
    }
    
    public function getAttributes($resource_id) {
        $resources = is_array($resource_id) ? $resource_id : array($resource_id);
        
        $this->load->model('user_app_type_config_collection');
        $this->load->model('resource_type_collection');
        $this->load->model('user_app_resource_attribute_collection');
        $this->load->model('user_app_resource_item_collection');
        $this->load->model('app_config_collection');
        
        
        $attributes = $this->user_app_type_config_collection->get(array(
            "b.id IN(" . join(",", $resources) . ")"
        ), null, null, null, array(
            'sql_join' => "INNER JOIN {$this->get_data_table()} b ON b.type_id = a.type_id AND b.app_id = a.app_id 
                LEFT JOIN {$this->resource_type_collection->get_data_table()} e ON e.name = a.type
                LEFT JOIN {$this->user_app_resource_attribute_collection->get_data_table()} c ON c.resource_id = b.id AND c.item = a.item
                LEFT JOIN {$this->user_app_resource_item_collection->get_data_table()} d ON d.resource_id = b.id AND d.item = a.item AND e.id = d.item_type_id
                    AND d.config_id IN (SELECT MIN(id) FROM {$this->app_config_collection->get_data_table()})
            ",
            'fields' => "b.id as resource_id, a.item, e.name as type, IF(e.id IS NOT NULL, IF(e.name = 'file', CONCAT(b.store_dir, '/', d.config_id, '/', d.value), d.value), c.value) value"
        ));   
                    
        $return = array();
         
        if (!is_array($resource_id)) {
            return $attributes;
        } else {
            foreach($attributes as $attribute) {
                $return[$attribute['resource_id']][] = $attribute;
            }
            
            return $return;
        }
    }
    
    public function getMissingRequiredAttributes($resource_id) {
        $this->load->model('user_app_type_config_collection');
        $this->load->model('resource_type_collection');
        $this->load->model('user_app_resource_attribute_collection');
        $this->load->model('user_app_resource_item_collection');
        $this->load->model('app_config_collection');
        
        // we must check if all required fields are filled before we publish it
        return $this->user_app_type_config_collection->get_list(array(
            'required' => 1, 
            "b.id = {$resource_id}",
            "IF(e.id IS NOT NULL, d.value, c.value) IS NULL"
        ), null, null, null, array(
            'sql_join' => "INNER JOIN {$this->get_data_table()} b ON b.type_id = a.type_id AND b.app_id = a.app_id 
                LEFT JOIN {$this->resource_type_collection->get_data_table()} e ON e.name = a.type
                LEFT JOIN {$this->user_app_resource_attribute_collection->get_data_table()} c ON c.resource_id = b.id AND c.item = a.item
                LEFT JOIN {$this->user_app_resource_item_collection->get_data_table()} d ON d.resource_id = b.id AND d.item = a.item AND e.id = d.item_type_id
                    AND d.config_id IN (SELECT MIN(id) FROM {$this->app_config_collection->get_data_table()})
            ",
            'fields' => "a.item"
        ));   
    }
    
    public function save($data, $id = 0, $action = null) {
        
        $ret = parent::save($data, $id, $action);
        
        if (!$id && !isset($data['store_dir'])) {
            $this->load->model('user_app_collection');
            $app = $this->user_app_collection->get_one(array('id' => $data['app_id']));
            
            $ret['data']['store_dir'] = "/resources/{$app['user_id']}/{$app['hash']}/{$data['type_id']}/{$ret['id']}";
            
            parent::save(array('store_dir' => $ret['data']['store_dir']), $ret['id']);
        }
        
        return $ret; 
    }

}