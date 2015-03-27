<?php

include('main_controller.php');

class homepage extends main_controller {
    /* main_controller loads library bootstrap.php that does most of the initializations */

    public function index() {
        redirect('/user/login');
        
        $this->set_template('web/index.tpl');
        $this->show_page();
    }

}