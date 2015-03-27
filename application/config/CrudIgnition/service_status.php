<?php
	$config = array (
  'table' => 'services_status',
  'model' => 'service_status',
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
    'timestamp' => 
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
      'name' => 'timestamp',
      'type' => 'timestamp',
      'length' => '',
      'digits' => '',
      'decimals' => '',
      'data_source' => '',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'timestamp',
      ),
    ),
    'type_id' => 
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
      'name' => 'type_id',
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
    'ip' => 
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
      'name' => 'ip',
      'type' => 'varchar',
      'length' => '39',
      'digits' => '',
      'decimals' => '',
      'data_source' => '',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'varchar',
        'constraint' => '39',
      ),
    ),
    'port' => 
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
      'name' => 'port',
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
    'busy' => 
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
      'name' => 'busy',
      'type' => 'tinyint',
      'length' => '',
      'digits' => '',
      'decimals' => '',
      'data_source' => '',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'tinyint',
      ),
    ),
  ),
  'controller' => 'manage_services_status',
);
