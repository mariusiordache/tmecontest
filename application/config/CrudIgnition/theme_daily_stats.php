<?php
	$config = array (
  'table' => 'theme_daily_stats',
  'model' => 'theme_daily_stats',
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
    'theme_id' => 
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
      'name' => 'theme_id',
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
    'downloads' => 
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
      'name' => 'downloads',
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
    'revenue' => 
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
      'name' => 'revenue',
      'type' => 'decimal',
      'length' => '',
      'digits' => '9',
      'decimals' => '2',
      'data_source' => '',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'decimal',
        'constraint' => 
        array (
          0 => '9',
          1 => '2',
        ),
      ),
    ),
    'rpm' => 
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
      'name' => 'rpm',
      'type' => 'decimal',
      'length' => '',
      'digits' => '5',
      'decimals' => '2',
      'data_source' => '',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'decimal',
        'constraint' => 
        array (
          0 => '5',
          1 => '2',
        ),
      ),
    ),
    'ctr' => 
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
      'name' => 'ctr',
      'type' => 'decimal',
      'length' => '',
      'digits' => '5',
      'decimals' => '2',
      'data_source' => '',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'decimal',
        'constraint' => 
        array (
          0 => '5',
          1 => '2',
        ),
      ),
    ),
  ),
  'controller' => 'manage_theme_daily_stats',
);
