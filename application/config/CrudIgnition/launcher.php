<?php
	$config = array (
  'table' => 'launchers',
  'model' => 'launcher',
  'fields' => 
  array (
    'id' => 
    array (
      'name' => 'id',
      'label' => 'id',
      'length' => '11',
      'type' => 'primary',
      'vgroups' => 
      array (
        0 => 
        array (
          'name' => 'create',
          'rules' => 
          array (
          ),
        ),
        1 => 
        array (
          'name' => 'update',
          'rules' => 
          array (
          ),
        ),
      ),
      'forge' => 
      array (
        'type' => 'INT',
        'auto_increment' => true,
      ),
    ),
    'name' => 
    array (
      'name' => 'name',
      'label' => 'name',
      'length' => '150',
      'type' => 'varchar',
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
      'digits' => '',
      'decimals' => '',
      'data_source' => '',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'varchar',
        'constraint' => '150',
      ),
    ),
    'identifier' => 
    array (
      'name' => 'identifier',
      'label' => 'identifier',
      'length' => '50',
      'type' => 'varchar',
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
      'digits' => '',
      'decimals' => '',
      'data_source' => '',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'varchar',
        'constraint' => '50',
      ),
    ),
    'show_in_builder' => 
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
      'name' => 'show_in_builder',
      'type' => 'enum',
      'length' => '',
      'digits' => '',
      'decimals' => '',
      'data_source' => '0,1',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'enum',
        'constraint' => 
        array (
          0 => 0,
          1 => 1,
        ),
      ),
    ),
    'show_in_aggregator' => 
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
      'name' => 'show_in_aggregator',
      'type' => 'enum',
      'length' => '',
      'digits' => '',
      'decimals' => '',
      'data_source' => '1,0',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'enum',
        'constraint' => 
        array (
          0 => 1,
          1 => 0,
        ),
      ),
    ),
    'aggregator_status' => 
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
      'name' => 'aggregator_status',
      'type' => 'enum',
      'length' => '',
      'digits' => '',
      'decimals' => '',
      'data_source' => 'live,waiting_approval',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'enum',
        'constraint' => 
        array (
          0 => 'live',
          1 => 'waiting_approval',
        ),
      ),
    ),
    'builder_status' => 
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
      'name' => 'builder_status',
      'type' => 'enum',
      'length' => '',
      'digits' => '',
      'decimals' => '',
      'data_source' => 'development,active,disabled',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'enum',
        'constraint' => 
        array (
          0 => 'development',
          1 => 'active',
          2 => 'disabled',
        ),
      ),
    ),
    'download_url' => 
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
      'name' => 'download_url',
      'type' => 'varchar',
      'length' => '150',
      'digits' => '',
      'decimals' => '',
      'data_source' => '',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'varchar',
        'constraint' => '150',
      ),
    ),
    'store_launcher_id' => 
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
      'name' => 'store_launcher_id',
      'type' => 'int',
      'length' => '',
      'digits' => '',
      'decimals' => '',
      'data_source' => 'store_launchers:id,name',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'int',
      ),
    ),
  ),
  'controller' => 'manage_launchers',
);
