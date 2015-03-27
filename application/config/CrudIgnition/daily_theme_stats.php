<?php
	$config = array (
  'table' => 'daily_theme_stats',
  'model' => 'daily_theme_stats',
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
      'digits' => '10',
      'decimals' => '2',
      'data_source' => '',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'decimal',
        'constraint' => 
        array (
          0 => '10',
          1 => '2',
        ),
      ),
    ),
    'csvtype_id' => 
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
      'name' => 'csvtype_id',
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
    'report_date' => 
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
      'name' => 'report_date',
      'type' => 'date',
      'length' => '',
      'digits' => '',
      'decimals' => '',
      'data_source' => '',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'date',
        'name' => 'report_date',
      ),
    ),
  ),
  'controller' => 'manage_daily_theme_stats',
);
