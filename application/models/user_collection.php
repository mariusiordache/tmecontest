<?php

class user_collection extends kms_item_collection {
	
	public function __construct() {
		parent::__construct();
        $this->_load_crud_data('user');
	}
	
    public function register($data) {
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception("Email not valid");
}

        if ($this->user_collection->get_count("*", array('email' => $data['email']))) {
            throw new Exception("Email already exists");
        }

        preg_match("/([^@]+)@([^\.]+)/", $data['email'], $m);
        $username = $m[1] . $m[2];
        $password = $this->generatePassword();

        $return = $this->save(array(
            'username' => $username,
            'password' => sha1($password),
            'email' => $data['email']
        ));

        $user = $return['data'];
        $user['id'] = $return['id'];
        $user['password'] = $password;

        return $user;
    }

    function generatePassword($length = 9) {
        $vowels = 'aeuyAEUY';
        $consonants = 'bdghjmnpqrstvzBDGHJLMNPQRSTVWXZ23456789@#$%';

        $password = '';
        $alt = time() % 2;
        for ($i = 0; $i < $length; $i++) {
            if ($alt) {
                $password .= $consonants[(rand() % strlen($consonants))];
            } else {
                $password .= $vowels[(rand() % strlen($vowels))];
            }

            $alt = !$alt;
        }

        return $password;
    }

}
