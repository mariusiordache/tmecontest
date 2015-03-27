<?php

include('main_controller.php');

class user extends main_controller {

    public function __construct() {
        parent::__construct();

        $this->load->model('user_collection');
        $this->load->model('user_app_collection');
    }

    public function dashboard() {
        
    }

    public function logout() {
        $this->current_user->logout();
        redirect('user/login');
    }

    public function login() {
        $this->bootstrap->frontend();
        $this->assets->add_css('css/simplepage.css');
        $this->assets->add_js('js/login.js');

        $this->load->helper('form');

        if ($this->input->get('goback')) {
            $this->set_template_var('goback', urldecode($this->input->get('goback')));
        }

        $this->set_template('web/login.tpl');
        $this->show_page();
    }

    public function register() {
        $data = $this->input->post();

        try {

            if (!isset($data['email']) || !isset($data['app_name'])) {
                throw new Exception("Fields Email and Application name are mandatory");
            }

            $user = $this->user_collection->register($data);

            $app = $this->user_app_collection->save(array(
                'user_id' => $user['id'],
                'name' => $data['app_name'],
            ));
            
            $login_result = $this->current_user->login($user);
            $login_result['location'] = '/dashboard/edit/' . $app['data']['hash'];
            
            $this->show_ajax($login_result);
        } catch (Exception $ex) {
            $this->show_ajax(array(
                'errors' => array(
                    $ex->getMessage()
                )
            ));
        }
    }

    public function post_login() {

        $data = $this->input->post();
        $login_result = $this->current_user->login($data);
        $login_result['location'] = ( isset($data['goback']) && strlen($data['goback']) > 0 ) ? $data['goback'] : ( $this->config->item('base_url') . '/dashboard' );

        $this->show_ajax($login_result);
    }

}
