<?php

class user_app_collection extends kms_item_collection {

    public function __construct() {
        parent::__construct();
        $this->_load_crud_data('user_app');
    }

    public function save($data, $id = 0, $action = null) {
        if (!$id) {
            $data['hash'] = md5(time() . serialize($data));
        }
        
        return parent::save($data, $id, $action);
    }
}