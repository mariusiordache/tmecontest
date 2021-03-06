<?php
	$config = array (
  'table' => 'users',
  'model' => 'user',
  'fields' => 
  array (
    'id' => 
    array (
      'type' => 'primary',
      'name' => 'id',
      'length' => '',
      'digits' => '',
      'decimals' => '',
      'data_source' => '',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'INT',
        'auto_increment' => true,
        'NULL' => false,
      ),
    ),
    'email' => 
    array (
      'name' => 'email',
      'type' => 'varchar',
      'vgroups' => 
      array (
        0 => 
        array (
          'name' => 'create',
          'rules' => 
          array (
            0 => 
            array (
              'rule' => 'required',
              'state' => '',
            ),
            1 => 
            array (
              'rule' => 'valid_email',
              'state' => '',
            ),
          ),
          'state' => '',
        ),
        1 => 
        array (
          'name' => 'update',
          'rules' => 
          array (
            0 => 
            array (
              'rule' => 'required',
            ),
            1 => 
            array (
              'rule' => 'valid_email',
            ),
          ),
          'state' => '',
        ),
      ),
      'length' => 100,
      'digits' => '',
      'decimals' => '',
      'data_source' => '',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'varchar',
        'constraint' => 100,
        'NULL' => false,
      ),
    ),
    'password' => 
    array (
      'name' => 'password',
      'type' => 'varchar',
      'vgroups' => 
      array (
        0 => 
        array (
          'name' => 'create',
          'rules' => 
          array (
            0 => 
            array (
              'rule' => 'required',
              'state' => '',
            ),
            1 => 
            array (
              'rule' => 'callback_encrypt_password',
              'state' => '',
            ),
          ),
          'state' => '',
        ),
        1 => 
        array (
          'name' => 'update',
          'rules' => 
          array (
            0 => 
            array (
              'rule' => 'callback_encrypt_password',
            ),
          ),
          'state' => '',
        ),
      ),
      'length' => 100,
      'digits' => '',
      'decimals' => '',
      'data_source' => '',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'varchar',
        'constraint' => 100,
        'NULL' => false,
      ),
    ),
    'name' => 
    array (
      'vgroups' => 
      array (
        0 => 
        array (
          'name' => 'create',
          'state' => '',
          'rules' => 
          array (
          ),
        ),
        1 => 
        array (
          'name' => 'update',
          'state' => '',
          'rules' => 
          array (
          ),
        ),
      ),
      'name' => 'name',
      'type' => 'varchar',
      'length' => '100',
      'digits' => '',
      'decimals' => '',
      'data_source' => '',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'varchar',
        'constraint' => '100',
        'NULL' => false,
      ),
    ),
    'date_created' => 
    array (
      'name' => 'date_created',
      'type' => 'datetime',
      'vgroups' => 
      array (
        0 => 
        array (
          'name' => 'create',
          'rules' => 
          array (
            0 => 
            array (
              'rule' => 'required',
              'state' => '',
            ),
            1 => 
            array (
              'rule' => 'callback_current_date',
              'state' => '',
            ),
          ),
          'state' => '',
        ),
        1 => 
        array (
          'name' => 'update',
          'state' => '',
          'rules' => 
          array (
          ),
        ),
      ),
      'length' => '',
      'digits' => '',
      'decimals' => '',
      'data_source' => '',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'datetime',
        'NULL' => false,
      ),
    ),
  ),
  'controller' => 'manage_users',
);
