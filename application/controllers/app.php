<?php

require_once 'member_area.php';

class app extends member_area {

    public function __construct() {
        parent::__construct();

        $this->load->model('user_app_collection');
        $this->load->model('app_type_collection');
        $this->load->model('user_app_resource_collection');
    }
    
    public function edit($app_id) {
        $app = $this->getAppById($app_id);
        $uid = $this->current_user->get('login.id');
        
        $this->addNav('/dashboard/edit/' . $app_id, $app['name']);

        $app_types = $this->app_type_collection->get(array("(a.user_id = 0 OR a.user_id = {$uid}) AND (a.app_id = 0 OR a.app_id = {$app['id']})"), null, null, null, array(
            'sql_join' => "LEFT JOIN {$this->user_app_resource_collection->get_data_table()} b ON b.type_id = a.id AND b.app_id = {$app['id']}",
            'group_by' => 'a.id',
            'fields' => 'a.*, COUNT(b.id) as count'
        ));

        $this->set_template_var('app', $app);
        $this->set_template_var('app_types', $app_types);

        $this->set_template('web/dashboard/edit.tpl');
        $this->assets->add_js('dashboard/edit.js', false);

        $this->show_page();
    }
    
    public function add() {
        $name = $this->input->post('name');

        try {
            if (empty($name)) {
                throw new Exception("Name can not be empty");
            }

            $existing = $this->user_app_collection->get_count("*", array('user_id' => $this->current_user->get('login.id'), 'name' => $name));

            if ($existing) {
                throw new Exception("You already have an app with this name");
            }

            $app = $this->user_app_collection->save(array(
                'user_id' => $this->current_user->get('login.id'),
                'name' => $name
            ));

            if ($app['id']) {
                $this->show_ajax(array(
                    'success' => true,
                    'location' => '/app/edit/' . $app['id']
                ));
            }
        } catch (Exception $ex) {
            $this->show_ajax(array(
                'error' => $ex->getMessage()
            ));
        }
    }

    public function toggleStatus($app_id, $status) {
        $status = (int) !$status;
        $this->show_ajax($this->user_app_collection->save(array(
                    'status' => $status
        ), (int) $app_id));
    }

}
