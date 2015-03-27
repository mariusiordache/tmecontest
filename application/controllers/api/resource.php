<?php

require_once 'api_controller.php';

class resource extends api_controller {

    protected function view($type_id) {

        $this->load->model('user_app_resource_collection');
        $this->load->model('user_app_resource_item_collection');
        $this->load->model('user_app_type_config_collection');


        $filters = array('app_id' => $this->app['id'], 'type_id' => $type_id, 'status' => 1);
        $page = $this->input->get('page');
        $limit = $this->input->get('limit');

        $page = $page ? $page : 1;
        $limit = $limit ? $limit : 10;
        $offset = ($page - 1) * $limit;

        $total = $this->user_app_resource_collection->get_count('*', $filters);
        $resources = $this->user_app_resource_collection->get($filters, 'id ASC', $offset, $limit, array(
            'fields' => 'a.id, a.name'
        ));

        if (empty($resources)) {
            throw new Exception("No {$type} published", 204);
        }

        $ids = array_map(function($item) {
            return $item['id'];
        }, $resources);
        $attributes = $this->user_app_resource_collection->getAttributes($ids);

        foreach ($resources as &$resource) {
            $resource['id'] = (int) $resource['id'];
            $attr = isset($attributes[$resource['id']]) ? $attributes[$resource['id']] : array();

            foreach ($attr as $a) {
                $resource[$a['item']] = $a['value'];
            }
        }

        unset($resource);

        return array(
            'total' => $total,
            'list' => $resources
        );
    }
    
    public function show($resource_id) {
        
        $this->load->model('user_app_resource_collection');
        $this->load->model('app_config_collection');
        
        $config_id = $this->input->get('config_id');
        $default_config = $this->app_config_collection->get_default_id();
        
        $config_id = !empty($config_id) ? $config_id : $default_config;
        
        $resource = $this->user_app_resource_collection->get_one(array('id' => $resource_id));
        $attributes = $this->user_app_resource_collection->getAttributes($resource_id);
        foreach($attributes as $a) {
            $resource[$a['item']] = $a['value'];
        }
        
        $items = $this->user_app_resource_collection->getItems($resource_id, $config_id);
        unset($items['file']);
        
        $resource = array_merge($resource, $items);
        $unset = array('app_id', 'type_id', 'status');
        
        $resource['store_dir'] .= "/{$config_id}/";
        $resource['store_dir'] = preg_replace("@/+@", '/', $resource['store_dir']);
        
        $resource['files'] = $resource['store_dir'] . 'files.zip';
        
        foreach($unset as $i) {
            unset($resource[$i]);
        }
        
        return $resource;
    }

    public function _remap($method, $params = array()) {
        parent::_remap($method, $params);

        try {
            if (is_numeric($method)) {
                return $this->_output($this->show((int) $method));
            }

            $this->load->model('app_type_collection');
            $type_obj = $this->app_type_collection->get_one(array('identifier' => $method));

            if (!empty($type_obj)) {
                return $this->_output($this->view($type_obj['id']));
            }
        } catch (Exception $ex) {
            $this->error($ex->getCode(), $ex->getMessage());
        }
    }

}
