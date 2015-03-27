<?php

require_once('admin_controller.php');

class dashboard extends admin_controller {

    public function index() {

        $this->add_assets();
        $this->template_engine->assign('current_menu', '');
        $this->set_template('admin/dashboard.tpl');
        $this->show_page();
    }

}

?>