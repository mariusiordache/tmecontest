<?php

require_once('main_controller.php');

class member_area extends main_controller {

    public function __construct() {

        parent::__construct();

        force_login('');
        
        $this->addNav('/dashboard', 'Apps');
        $this->load->library('bootstrap');
        $this->assets->add_css('css/app.css');
        
        $this->bootstrap->frontend();
    }

    protected function getAppById($id) {
        return $this->getApp(null, $id);
    }
    
    protected function getAppByHash($hash) {
        return $this->getApp($hash);
    }
    
    protected function getApp($hash = null, $id = null) {
        $filters['user_id'] = $this->current_user->get('login.id');
        if ($hash) {
            $filters['hash'] = $hash;
        }
        if ($id) {
            $filters['id'] = $id;
        }
        
        $app = $this->user_app_collection->get_one($filters);

        if (empty($app)) {
            redirect('/dashboard');
            exit;
        }

        return $app;
    }

    protected function addNav($url, $label) {
        $id = preg_replace("@[^a-z0-9]@", "", strtolower($label));
        $this->topnav[$id] = array('url' => $url, 'label' => $label);
    }

    public function show_page($page_id = '') {
        if (isset($this->topnav[$page_id])) {
            $this->topnav[$page_id]['active'] = true;
        }

        if (isset($this->topnav)) {
            $this->set_template_var('topnav', $this->topnav);
        }

        parent::show_page();
    }

}
