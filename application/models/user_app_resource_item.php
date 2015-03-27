<?php

class user_app_resource_item extends kms_item {

    public function getStoreDir() {
        
    }
    
    public function uploadItems($items, $config_id) {
        $CI = get_instance();
        $CI->load->model('user_app_resource_item_collection');
        $CI->load->model('upload_user_settings_collection');
        $CI->load->model('resource_type_collection');
        $CI->load->decorator('ResourceItemsDecorator');
        
        $full_path = $CI->config->item('webroot_path') . '/' . $this->info['store_dir'] . '/' . $config_id . '/';
        
        if (!is_dir($full_path)) {
            mkdir($full_path, 0775, true);
        }
        
        $item_type_id = $CI->resource_type_collection->get_one(array('name' => 'file'));
        $item_type_id = $item_type_id['id'];
                
        $new_identifiers = array_map(function($item){ return $item['identifier']; }, $items);
        $existing = kms_assoc_by_field($CI->user_app_resource_item_collection->get(array('item' => $new_identifiers, 'resource_id' => $this->id, 'config_id' => $config_id)), 'item');
        
        $replace = $CI->upload_user_settings_collection->getSettingsValue('replace');
        $return = array();
        $item_collection = new ResourceItemsDecorator($CI->user_app_resource_item_collection);
        
        foreach($items as $item) {
            $file_extension = pathinfo($item['path'], PATHINFO_EXTENSION);
            if (preg_match("@\.9\.png$@", $item['path'])) {
                $file_extension = '9.png';
            }

            $filename = $item['identifier'] . '.' . $file_extension;
                
            if (!isset($existing[$item['identifier']])) {
                
                $ret = $CI->user_app_resource_item_collection->save(array(
                    'resource_id' => $this->id,
                    'item' => $item['identifier'],
                    'value' => $filename,
                    'config_id' => $config_id,
                    'item_type_id' => $item_type_id,
                    'filesize' => filesize($item['path'])
                ));
                
                $dbitem['id'] = $ret['id'];
                
                copy($item['path'], $full_path . $filename);
                unlink($item['path']);
                
            } else if ($replace) {
                $dbitem['id'] = $existing[$item['identifier']]['id'];
                $dbitem['existing'] = true;
                
                unlink($full_path . $existing[$item['identifier']]['value']);
                copy($item['path'], $full_path . $filename);
                @unlink($item['path']);
                
                $CI->user_app_resource_item_collection->save(array(
                    'value' => $filename,
                    'filesize' => filesize($full_path . $filename),
                    'last_updated' => 'NOW()'
                ), $dbitem['id']);
                
            } else {
                continue;
            }
        
            $return[] = array_merge(array_shift($item_collection->get(array('id' => $dbitem['id']))), $dbitem);
        }
        
        return $return;
        
    }


}