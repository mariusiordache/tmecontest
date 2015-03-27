<?php
	$config = array (
  'table' => 'theme_raw_stats',
  'model' => 'theme_raw_stats',
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
    'stats_date' => 
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
      'name' => 'stats_date',
      'type' => 'date',
      'length' => '',
      'digits' => '',
      'decimals' => '',
      'data_source' => '',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'date',
      ),
    ),
    'store' => 
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
      'name' => 'store',
      'type' => 'enum',
      'length' => '',
      'digits' => '',
      'decimals' => '',
      'data_source' => 'googleplay,samsung,generic',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'enum',
        'constraint' => 
        array (
          0 => 'googleplay',
          1 => 'samsung',
          2 => 'generic',
        ),
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
    'stats_day' => 
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
      'name' => 'stats_day',
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
    'total_average_rating' => 
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
      'name' => 'total_average_rating',
      'type' => 'decimal',
      'length' => '',
      'digits' => '3',
      'decimals' => '2',
      'data_source' => '',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'decimal',
        'constraint' => 
        array (
          0 => '3',
          1 => '2',
        ),
      ),
    ),
    'average_rating' => 
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
      'name' => 'average_rating',
      'type' => 'decimal',
      'length' => '',
      'digits' => '3',
      'decimals' => '2',
      'data_source' => '',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'decimal',
        'constraint' => 
        array (
          0 => '3',
          1 => '2',
        ),
      ),
    ),
  ),
  'controller' => 'manage_theme_raw_stats',
);
