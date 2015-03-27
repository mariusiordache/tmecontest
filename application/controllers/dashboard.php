<?php

require_once 'member_area.php';

class dashboard extends member_area {

    public function __construct() {
        parent::__construct();

        $this->load->model('user_app_collection');
        $this->load->model('app_type_collection');
        $this->load->model('user_app_resource_collection');
        $this->load->model('user_app_resource_item_collection');

        $this->bootstrap->frontend();
    }
    
    public function index() {

        $apps = $this->user_app_collection->get(array('user_id' => $this->current_user->get('login.id')));

        $this->set_template_var('apps', $apps);
        $this->assets->add_js('dashboard/index.js', false);
        $this->set_template('web/dashboard/index.tpl');
        $this->show_page();
    }

    

}
