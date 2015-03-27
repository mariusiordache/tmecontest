<?php

class bootstrap {

    protected $_CI;

    public function __construct() {

        setlocale(LC_ALL, 'en_US');

        $this->_CI = get_instance();

        /* load helpers */
        $this->_CI->load->helper('kms_language');
        $this->_CI->load->helper('kms_array');
        $this->_CI->load->helper('kms_folder');
        $this->_CI->load->helper('kms_date');
        $this->_CI->load->helper('chrome_php');
        $this->_CI->load->helper('url_helper');
        $this->_CI->load->helper('generic_helper');
        /* load current user */
        $this->_CI->load->library('current_user');

        $this->_CI->current_user->set_if_empty('settings.language', $this->_CI->config->item('language'));
        $this->_CI->lang->load('user_interface', $this->_CI->current_user->get('settings.language'));

        setlocale(LC_TIME, kms_lang('locale'));

        $this->_CI->set_js_page_data('js_date_format', kms_lang('js_date_format'));
        $this->_CI->set_js_page_data('strftime_date_format', kms_lang('strftime_date_format'));

        $this->_CI->set_js_page_data('dayNames', kms_lang('dayNames'));
        $this->_CI->set_js_page_data('shortDayNames', kms_lang('dayNames'));
        $this->_CI->set_js_page_data('monthNames', kms_lang('monthNames'));
        $this->_CI->set_js_page_data('shortMonthNames', kms_lang('shortMonthNames'));

        $this->_CI->user_settings = $this->get_user_settings();

        $this->_CI->set_js_page_data('user_settings', $this->_CI->user_settings);

        if ($this->_CI->session->userdata('referrer') === false || $this->_CI->session->userdata('referrer') === '') {
            $this->_CI->session->set_userdata('referrer', isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '');
        }
    }

    public function frontend() {
        $this->_CI->assets->add_css('http://fonts.googleapis.com/css?family=Roboto:300,500', false);
        $this->_CI->assets->add_css('bootstrap-3.2.0/css/bootstrap.min.css', false);
        
        $this->_CI->assets->add_css('css/dashboard.css');

        $this->_CI->assets->add_js('///ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js', false);
        
        $this->_CI->assets->add_js('bootstrap-3.2.0/js/bootstrap.min.js', false);
        
        $this->_CI->assets->add_js('backbone/underscore-min.js', false);
        $this->_CI->assets->add_js('backbone/backbone-min.js', false);

        $this->_CI->assets->add_js('js/loadingButton.js');
        $this->_CI->assets->add_js('js/moment.min.js');
        $this->_CI->assets->add_js('js/common.js');
        $this->_CI->assets->add_js('js/form.js');
        
        $this->_CI->assets->add_js('bootstrap-switch/js/bootstrap-switch.min.js');
        $this->_CI->assets->add_css('bootstrap-switch/css/bootstrap3/bootstrap-switch.min.css');

        $this->_CI->set_js_page_data('date_format', 'D.M.YYYY, h:mm:ss');
    }

    public function setup_fileupload() {

        $this->_CI->assets->add_js('//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js', false);

        $this->_CI->assets->add_css('jqueryfileupload/css/jquery.fileupload-ui.css');
        $this->_CI->assets->add_js('jqueryfileupload/js/tmpl.min.js', false);
        $this->_CI->assets->add_js('jqueryfileupload/js/load-image.min.js', false);
        $this->_CI->assets->add_js('jqueryfileupload/js/canvas-to-blob.min.js', false);
        $this->_CI->assets->add_js('jqueryfileupload/js/jquery.fileupload.js', false);
        $this->_CI->assets->add_js('jqueryfileupload/js/jquery.fileupload-process.js', false);
        $this->_CI->assets->add_js('jqueryfileupload/js/jquery.fileupload-image.js', false);
        $this->_CI->assets->add_js('jqueryfileupload/js/jquery.fileupload-validate.js', false);
        $this->_CI->assets->add_js('jqueryfileupload/js/jquery.fileupload-ui.js', false);
    }

    public function get_user_settings() {

        if ($this->_CI->input->get('s') !== false && $this->_CI->input->get('s') != '') {
            $user_settings = $this->parse_user_settings_from_uri($this->_CI->input->get('s'));
        } else {
            $user_settings = $this->get_user_settings_from_cookie();
            if ($user_settings === false) {
                $user_settings = $this->get_default_user_settings();
            }
        }

        return $user_settings;
    }

    public function get_default_user_settings() {

        $settings = array();
        return $settings;
    }

    public function get_user_settings_from_cookie() {
        return $this->_CI->current_user->get('searchsettings');
    }

    public function parse_user_settings_from_uri($uri) {

        $settings = array();
        return $settings;
    }

}

?>