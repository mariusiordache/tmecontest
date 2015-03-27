<?php
	$config = array (
  'table' => 'resource_type_filters',
  'model' => 'resource_type_filter',
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
      'data_source' => 'resource_types:id,type',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'int',
      ),
    ),
    'filter_id' => 
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
      'name' => 'filter_id',
      'type' => 'int',
      'length' => '',
      'digits' => '',
      'decimals' => '',
      'data_source' => 'resource_filters:id,name',
      'admin_header' => 'on',
      'forge' => 
      array (
        'type' => 'int',
      ),
    ),
  ),
  'controller' => 'manage_resource_type_filters',
);
