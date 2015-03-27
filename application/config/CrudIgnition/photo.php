<?php
	$config = array (
  'table' => 'photos',
  'model' => 'photo',
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
      ),
    ),
    'exif_data' => 
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
      'name' => 'exif_data',
      'type' => 'text',
      'length' => '',
      'digits' => '',
      'decimals' => '',
      'data_source' => '',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'text',
      ),
    ),
    'source' => 
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
      'name' => 'source',
      'type' => 'varchar',
      'length' => '300',
      'digits' => '',
      'decimals' => '',
      'data_source' => '',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'varchar',
        'constraint' => '300',
      ),
    ),
    'licence' => 
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
      'name' => 'licence',
      'type' => 'varchar',
      'length' => '300',
      'digits' => '',
      'decimals' => '',
      'data_source' => '',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'varchar',
        'constraint' => '300',
      ),
    ),
    'width' => 
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
      'name' => 'width',
      'type' => 'int',
      'length' => '',
      'digits' => '',
      'decimals' => '',
      'data_source' => '',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'int',
      ),
    ),
    'height' => 
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
      'name' => 'height',
      'type' => 'int',
      'length' => '',
      'digits' => '',
      'decimals' => '',
      'data_source' => '',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'int',
      ),
    ),
  ),
  'controller' => 'manage_photos',
);
