<?php
	$config = array (
  'table' => 'slides',
  'model' => 'slide',
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
    'story_id' => 
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
      'name' => 'story_id',
      'type' => 'int',
      'length' => '',
      'digits' => '',
      'decimals' => '',
      'data_source' => '100',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'int',
        'NULL' => false,
      ),
    ),
    'position' => 
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
      'name' => 'position',
      'type' => 'int',
      'length' => '',
      'digits' => '',
      'decimals' => '',
      'data_source' => '',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'int',
        'NULL' => false,
      ),
    ),
    'paragraph' => 
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
      'name' => 'paragraph',
      'type' => 'varchar',
      'length' => '255',
      'digits' => '',
      'decimals' => '',
      'data_source' => '',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'varchar',
        'constraint' => '255',
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
  'controller' => 'manage_slides',
);
