<?php

class api_controller extends KMS_Web_Controller {

    protected $app = null;
    protected $outputType = 'json';

    public function setOutputType($outputType) {
        $this->outputType = $outputType;
    }

    public function __construct() {
        parent::__construct();

        $hash = $this->input->get('hash');

        $this->load->model('user_app_collection');

        $this->app = $this->user_app_collection->get_one(array('hash' => $hash));

        if (empty($this->app)) {
            $this->error(401, 'You must provide a valid hash to access api.');
        }
    }
    
    
    public function _remap(&$method, $params = array()) {

        if (preg_match("@([a-zA-Z0-9_]+)\.(xml|json)@", $method, $m)) {
            $method = $m[1];
            $this->setOutputType($m[2]);
        }
        
        if (method_exists($this, $method)) {
            $output = call_user_func_array(array($this, $method), $params);
            $this->_output($output);
        }

        
    }
    

    public function _output($output) {
        switch($this->outputType) {
            case 'json':
                header('Content-Type: application/json');
                echo json_encode($output);
                break;
            case 'xml':
                echo 'To be implemented.';
                exit;
        }
        
        exit;
    }

    protected function error($code, $error = null) {
        http_response_code($code);
        if (!empty($error)) {
            header('Content-Type: application/json');
            echo json_encode(array(
                'success' => false,
                'error' => $error
            ));
        }
        exit;
    }

}
