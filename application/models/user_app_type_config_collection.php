<?php

class user_app_type_config_collection extends kms_item_collection {

    public function __construct() {
        parent::__construct();
        $this->_load_crud_data('user_app_type_config');
    }
    
    public function createDefault($app_id, $type_id) {
        return $this->saveConfig($app_id, $type_id, array(
            array(
                'type' => 'text',
                'item' => 'title'
            ),
            array(
                'type' => 'file',
                'item' => 'preview'
            )
        ));
    }
    
    public function getForAppType($app_id, $type_id) {
        return $this->get(array('app_id' => $app_id, 'type_id' => $type_id));
    }
    
    public function saveConfig($app_id, $type_id, $config) {
        
        $existing = kms_assoc_by_field($this->getForAppType($app_id, $type_id));
        
        $to_add = array();
        $to_update = array();
        $to_delete = array();
        $new_config = array();
        
        foreach($config as $item) {
            if (empty($item['id']) || empty($existing[$item['id']])) {
                $item['app_id'] = $app_id;
                $item['type_id'] = $type_id;
                
                $to_add[] = $item;
            } else {
                $e = $existing[$item['id']];
                $new_config[] = $item['id'];
                
                if ($e['item'] != $item['item'] || $e['type'] != $item['type'] || $e['required'] != $item['required']) {
                    $id = $item['id'];
                    unset($item['id']);
                    $to_update[$id] = $item;
                }
            }
        }
        
        foreach($existing as $id => $item) {
            if (!in_array($id, $new_config)) {
                $del = true;
                
                foreach($to_add as $i => $add) {
                    if ($item['item'] == $add['item']) {
                        $del = false;
                        
                        if ($item['type'] != $add['type'] || $add['required'] != $item['required']) {
                            $to_update[$id] = array(
                                'type' => $add['type']
                            );
                        }
                        
                        unset($to_add[$i]);
                    }
                }
                
                if ($del) {
                    $to_delete[] = $id;
                }
            }
        }
        
        if (!empty($to_delete)) {
            $this->delete_multiple(array('id' => $to_delete));
        }
        
        if (!empty($to_add)) {
            $this->add_multiple($to_add);
        }
        
        if (!empty($to_update)) {
            foreach($to_update as $id => $item) {
                $this->save($item, $id);
            }
        }
        
        return true;
    }

}
