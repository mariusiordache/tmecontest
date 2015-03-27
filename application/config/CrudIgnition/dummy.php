<?php
	$config = array (
  'table' => 'dummy',
  'model' => 'dummy',
  'fields' => 
  array (
    'meals' => 
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
      'name' => 'meals',
      'type' => 'enum',
      'length' => '',
      'digits' => '',
      'decimals' => '',
      'data_source' => 'Not included[none],Breakfast[breakfast],Half Board[halfboard],Full Board[fullboard],All Inclusive Light[allinclusivelight],All Inclusive[allinclusive],Ultra All Inclusive[ultraallinclusive]',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'enum',
        'constraint' => 
        array (
          0 => 'none',
          1 => 'breakfast',
          2 => 'halfboard',
          3 => 'fullboard',
          4 => 'allinclusivelight',
          5 => 'allinclusive',
          6 => 'ultraallinclusive',
        ),
      ),
    ),
    'internet' => 
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
      'name' => 'internet',
      'type' => 'enum',
      'length' => '',
      'digits' => '',
      'decimals' => '',
      'data_source' => 'Not included[none],In lobby[inlobby],In room[inroom]',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'enum',
        'constraint' => 
        array (
          0 => 'none',
          1 => 'inlobby',
          2 => 'inroom',
        ),
      ),
    ),
    'parking' => 
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
      'name' => 'parking',
      'type' => 'enum',
      'length' => '',
      'digits' => '',
      'decimals' => '',
      'data_source' => 'Not included[none],Hotel parking[hotel],Public parking[public]',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'enum',
        'constraint' => 
        array (
          0 => 'none',
          1 => 'hotel',
          2 => 'public',
        ),
      ),
    ),
    'extraServices' => 
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
      'name' => 'extraServices',
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
    'extraDiscounts' => 
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
      'name' => 'extraDiscounts',
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
    'sharedBathroom' => 
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
      'name' => 'sharedBathroom',
      'type' => 'enum',
      'length' => '',
      'digits' => '',
      'decimals' => '',
      'data_source' => 'No[0],Yes[1]',
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
  ),
  'controller' => 'manage_dummy',
);
