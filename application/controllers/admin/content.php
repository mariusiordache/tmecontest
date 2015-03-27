<?php

include('admin_controller.php');

class content extends admin_controller {

    public function index() {
        $this->add_assets();

        $this->assets->add_js('js/CrudIgnitionManager.js');

        $this->template_engine->assign('current_menu', 'content');
        $this->set_template('admin/content.tpl');

        $this->load->model('deal_collection');
        $deals = $this->deal_collection->get_complete();
        $this->template_engine->assign('deals', $deals);

        $this->show_page();
    }

}

?>