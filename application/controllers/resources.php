<?php

require_once 'member_area.php';

class resources extends member_area {

    public function __construct() {
        parent::__construct();

        $this->load->model('app_config_collection');
        $this->load->model('user_app_collection');
        $this->load->model('app_type_collection');
        $this->load->model('user_app_resource_collection');
        $this->load->model('user_app_resource_item_collection');
        $this->load->model('user_app_type_config_collection');
        $this->load->model('user_app_resource_attribute_collection');
        $this->load->model('upload_user_settings_collection');
        $this->load->model('resource_type_collection');
        
        $this->load->decorator('ResourceItemsDecorator');
    }

    protected function getResourceById($resource_id) {
        $resource = $this->user_app_resource_collection->get_one(array('a.id = ' . $resource_id, 'b.user_id = ' . $this->current_user->get('login.id')), null, null, null, array(
            'sql_join' => "INNER JOIN {$this->user_app_collection->get_data_table()} b ON b.id = a.app_id"
        ));

        if (empty($resource)) {
            redirect('/dashboard');
            exit;
        }

        return $resource;
    }

    public function add() {
        $name = $this->input->post('name');
        $type_id = $this->input->post('type_id');
        $app_id = $this->input->post('app_id');

        try {
            if (empty($type_id) || empty($app_id)) {
                throw new Exception("Something went wrong. Please reload the page and try again!");
            }

            $item = array(
                'user_id' => $this->current_user->get('login.id'),
                'name' => $name,
                'type_id' => $type_id,
                'app_id' => $app_id
            );

            if ($this->user_app_resource_collection->get_count("*", $item)) {
                throw new Exception("You already have an type with this identifier");
            }

            $resource = $this->user_app_resource_collection->save($item);

            if ($resource['id']) {
                $this->show_ajax(array(
                    'success' => true,
                    'location' => '/resources/edit/' . $resource['id']
                ));
            }
        } catch (Exception $ex) {
            $this->show_ajax(array(
                'error' => $ex->getMessage()
            ));
        }
    }

    public function view($app_id, $type_id) {
        $app = $this->getAppById($app_id);
        $type = $this->app_type_collection->get_one(array('id' => $type_id));
        
        $configs = $this->user_app_type_config_collection->getForAppType($app_id, $type_id);
        
        if (empty($configs)) {
            $this->user_app_type_config_collection->createDefault($app_id, $type_id);
            $configs = $this->user_app_type_config_collection->getForAppType($app_id, $type_id);
        }
        
        $this->addNav('/app/edit/' . $app_id, $app['name']);
        $this->addNav('/resources/view/' . $app_id . '/' . $type_id, $type['name']);

        $resources = $this->user_app_resource_collection->get(array('app_id' => $app['id'], 'type_id' => $type_id));
        $config_types = $this->crud->_process_data_source($this->user_app_type_config_collection->data_fields['type']['data_source']);

        $this->set_template_var('app', $app);
        $this->set_template_var('type', $type);
        $this->set_template_var('configs', $configs);
        $this->set_template_var('config_types', $config_types);
        $this->set_template_var('resources', $resources);

        $this->assets->add_js('dashboard/resources.js', false);
        $this->set_template('web/dashboard/resources.tpl');
        $this->show_page();
    }

    public function upload($resource_id) {
        $this->load->library('resourceuploader');
        
        $this->resourceuploader->upload($resource_id);
    }
    
    public function saveUpload($resource_id, $config_id) {
        $r = $this->user_app_resource_collection->new_instance($resource_id);
        
        $post_data = $this->input->post();
        $items = array();
        foreach(array_keys($post_data['path']) as $id) {
            foreach(array_keys($post_data) as $key) {
                $items[$id][$key] = $post_data[$key][$id];
            }
        }
        
        $this->show_ajax($r->uploadItems($items, $config_id));
    }
    
    public function delete($item_id) {
        
        try {
            $this->user_app_resource_item_collection->deleteById($item_id);
            $this->show_ajax(array('success' => true));
        } catch(Exception $ex) {
            $this->show_ajax(array(
                'success' => false,
                'error' => $ex->getMessage()
            ));
        }
    }

    public function pack($resource_id) {
        
        $configs = $this->user_app_resource_item_collection->get_list(array('resource_id' => $resource_id), null, null, null, array(
            'group_by' => "config_id",
            'fields' => "config_id"
        ));
        
        foreach($configs as $config_id) {
        
            $items = $this->user_app_resource_collection->getItems($resource_id, $config_id);
            $files = $items['file'];

            $resource = $this->user_app_resource_collection->get_one(array('id' => $resource_id));

            $base = $this->config->item('webroot_path');
            $zip = new ZipArchive();
            $zipfile =  $base . $resource['store_dir'] . '/' . $config_id . '/files.zip';
            
            if (file_exists($zipfile)) {
                unlink($zipfile);
            }

            if ($zip->open($zipfile, ZipArchive::CREATE)!==TRUE) {
                return $this->show_ajax(array(
                    'success' => false,
                    'error' => 'Can not open ' . $zipfile
                ));
            }
            
            foreach($files as $file) {
                $full_path = $base . $resource['store_dir'] . '/' . $file['config'] . '/' . $file['file'];
                $zip->addFile($full_path, $file['file']);
            }

            $response['files'][$config_id] = $zip->numFiles;
            $zip->close();
        }
        
        $response['success'] = true;
        
        $this->user_app_resource_collection->save(array(
            'date_packed' => 'NOW()'
        ), $resource_id);
        
        return $this->show_ajax($response);
    }
    
    public function edit($resource_id) {
        $this->bootstrap->setup_fileupload();

        $resource = $this->getResourceById($resource_id);

        $app = $this->getAppById($resource['app_id']);
        $type = $this->app_type_collection->get_one(array('id' => $resource['type_id']));
        $attributes = $this->user_app_resource_attribute_collection->getForResource($resource_id);
        
        $this->addNav('/app/edit/' . $app['id'], $app['name']);
        $this->addNav('/resources/view/' . $app['id'] . '/' . $resource['type_id'], $type['name']);
        $this->addNav('/resources/edit/' . $resource['id'], $resource['name']);
        
        $item_collection = new ResourceItemsDecorator($this->user_app_resource_item_collection);
        $items = $item_collection->get(array('resource_id' => $resource_id));
        $configs = $this->app_config_collection->get();

        $new_items = array();

        foreach ($items as $item) {
            $new_items[$item['config_id']][] = $item;
        }

        reset($configs);
        $default = current($configs);

        if (!isset($new_items[$default['id']])) {
            $new_items[$default['id']] = array();
        }

        $this->set_template_var('configs', $this->app_config_collection->get());
        $this->set_template_var('app', $app);
        $this->set_template_var('type', $type);
        $this->set_template_var('resource', $resource);
        $this->set_template_var('items', $new_items);
        $this->set_template_var('attributes', $attributes);
        $this->set_template_var('userSettings', $this->upload_user_settings_collection->getForCurrentUser());

        $last_updated = $this->user_app_resource_item_collection->get_one(array('resource_id' => $resource_id, 'item_type_id' => 1), null, null, null, array('fields' => 'MAX(last_updated) as last_updated'));
        $pack_needed = false;
        
        if (isset($last_updated['last_updated'])) {
            $filechanged = strtotime($last_updated['last_updated']);
            $datepacked = !empty($resource['date_packed']) ? strtotime($resource['date_packed']) : 0;
            $pack_needed = $filechanged > $datepacked;
        }
        
        $this->set_template_var('pack_needed', $pack_needed);
        
        $this->assets->add_js('dashboard/resource.js', false);

        $this->set_template('web/dashboard/resource.tpl');
        $this->show_page();
    }
    
    public function toggleSettingsValue($settings_key, $status) {
        $status = (int) !$status;
        
        $this->show_ajax($this->upload_user_settings_collection->saveSettings($settings_key, $status));
    }
    
    public function toggleStatus($resource_id, $status) {
        $status = (int) !$status;
        $resource_id = (int) $resource_id;
        
        if ($status) {
            $missing = $this->user_app_resource_collection->getMissingRequiredAttributes($resource_id);
            
            if (!empty($missing)) {
                return $this->show_ajax(array(
                    'success' => false,
                    'error' => "You can't publish this resource because you have missing required attributes (".join(", ", $missing).")."
                ));
            }
        }
        
        $this->show_ajax($this->user_app_resource_collection->save(array(
                    'status' => $status
        ), $resource_id));
    }
    
    public function saveResourceAttributes($resource_id) {
        $attributes = $this->input->post('attributes');
        
        $this->show_ajax(array(
            'success' => $this->user_app_resource_attribute_collection->setForResource($resource_id, $attributes),
            'message' => 'Attributes saved'
        ));
    }
    
    public function saveConfiguration($app_id, $type_id) {
        
        $data = $this->input->post();
        $config = array();
        
        foreach($data['config']['id'] as $i => $db_id) {
            if (!empty($data['config']['item'][$i])) {
                $config[] = array(
                    'id' => $db_id,
                    'type' => $data['config']['type'][$i],
                    'item' => $data['config']['item'][$i],
                    'required' => !empty($data['config']['required'][$i])
                );
            }
        }
        
        try {
            
            $this->user_app_type_config_collection->saveConfig($app_id, $type_id, $config);

            $this->show_ajax(array(
               'success' => true ,
                'message' => 'Configuration saved succesfully!'
            ));
            
        } catch(Exception $ex) {
            $this->show_ajax(array(
               'success' => false,
               'message' => $ex->getMessage()
            ));
        }
    }
    
    public function addCustomItem($type, $resources_id, $config_id) {
        try {
            $id_type = $this->resource_type_collection->get_one(array('name' => $type));

            if (empty($id_type)) {
                throw new Exception("Unknown type {$type}");
            }

            $item = $this->input->post('item');
            
            if (empty($item['item'])) {
                throw new Exception("Identifier is required");
            }
            
            $item['item'] = strtolower($item['item']);
            
            if (!preg_match("@[a-z0-9_]@", $item['item'])) {
                throw new Exception("Identifier must contain only letters, numbers and underline ");
            }
            
            if (empty($item['value'])) {
                throw new Exception("Value must be filled!");
            }
            
            $item['resource_id'] = $resources_id;
            $item['config_id'] = $config_id;
            $item['item_type_id'] = $id_type['id'];
            $item['value'] = trim($item['value'], '#');

            $saved = $this->user_app_resource_item_collection->updateItem($item);
            
            $this->show_ajax(array(
                'success' => true,
                'item' => $saved
            ));
            
        } catch(Exception $ex) {
            $this->show_ajax(array(
                'success' => false,
                'error' => $ex->getMessage()
            ));
        }
        
    }

}
