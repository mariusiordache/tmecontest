<?php

class main_controller extends KMS_Web_Controller {

    public function __construct() {
        parent::__construct();

        /* bootstrap library does stuff for both front-end and back-end */
        $this->load->library('bootstrap');
        
        $this->set_js_page_data('base_url', $this->config->item('base_url'));
        $this->set_js_page_data('img_url', $this->config->item('img_url', 'assets'));
        
    }

}
