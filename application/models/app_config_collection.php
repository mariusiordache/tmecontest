<?php

class app_config_collection extends kms_item_collection {

    public function __construct() {
        parent::__construct();
        $this->_load_crud_data('app_config');
    }

    public function get_default_id() {
        return 1;
    }
}