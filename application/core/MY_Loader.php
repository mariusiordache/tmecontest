<?php

class MY_Loader extends CI_Loader {

        public function decorator($model) {

                foreach ($this->_ci_model_paths as $mod_path) {
                        if (!file_exists($mod_path . 'models/decorators/' . $model . '.php')) {
                                continue;
                        }

                        require_once($mod_path . 'models/decorators/' . $model . '.php');
                }
        }
        
}
