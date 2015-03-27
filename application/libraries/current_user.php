<?php

class current_user extends kms_current_user {

    public function logout() {

        $this->set('login', null);
    }

    public function login($data) {
        $this->_CI->load->model('user_collection');

        $userfield_type = 'username';
        $userfield = isset($data['email']) ? $data['email'] : (isset($data['username']) ? $data['username'] : '');
        if (strpos($userfield, '@') !== false)
            $userfield_type = 'email';

        $user_found = $this->_CI->user_collection->get_one(array(
            $userfield_type => $userfield,
            'password' => sha1($data['password'])
        ));

        if ($user_found !== false) {
            foreach ($user_found as $key => $value) {
                $this->set('login.' . $key, $value);
            }
            return array('success' => true, 'user' => $user_found);
        } else {
            return array('success' => false, 'errors' => array(kms_lang('user.wrong_login_data')));
        }
    }

    public $events = array(
        'settings.kids' => 'kidsUpdated'
    );

    public function set($key, $value) {

        parent::set($key, $value);

        foreach ($this->events as $event => $callback) {
            if (strpos($key, $event) === 0 && ($key == $event || substr($key, strlen($event), 1) == '.')) {
                call_user_func(array($this, $callback));
            }
        }

        unset($event, $callback);
    }

    public function is_admin() {
        return ( $this->get('login.is_admin') && $this->get('login.id') == 3 );
    }

    public function is_logged_in() {
        return ($this->get('login.id') > 0);
    }

    public function has_access($feature) {
        switch ($feature) {
            case 'admin':
                return $this->is_admin();
                break;
            case 'get_apk':
                return $this->is_admin() || ($this->get('login.is_admin') == 3);
                break;
            case 'aggregator':
                return $this->is_admin() || ($this->get('login.is_admin') == 2);
                break;
            default:
                return $this->is_admin();
                break;
        }
        return false;
    }

}
