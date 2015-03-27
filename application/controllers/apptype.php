<?php

require_once 'member_area.php';

class apptype extends member_area {

    public function __construct() {
        parent::__construct();
        
        $this->load->model('app_type_collection');
    }
    
    public function add() {
        $name = $this->input->post('name');
        $identifier = $this->input->post('identifier');
        $app_id = $this->input->post('app_id');

        try {
            if (empty($name)) {
                throw new Exception("Name can not be empty");
            }

            if (preg_match("@[^a-z0-9_]+@", $identifier)) {
                throw new Exception("Identifier must only contain alpha numeric characters and dash");
            }

            $existing = $this->app_type_collection->get_count("*", array('user_id' => $this->current_user->get('login.id'), 'identifier' => $identifier));

            if ($existing) {
                throw new Exception("You already have an type with this identifier");
            }

            $app = $this->app_type_collection->save(array(
                'user_id' => $this->current_user->get('login.id'),
                'identifier' => $identifier,
                'app_id' => (int) $app_id,
                'name' => $name
            ));

            if ($app['id']) {
                $this->show_ajax($app);
            }
        } catch (Exception $ex) {
            $this->show_ajax(array(
                'error' => $ex->getMessage()
            ));
        }
    }

}
