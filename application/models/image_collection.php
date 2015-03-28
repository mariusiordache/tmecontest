<?php
class image_collection extends kms_item_collection {
	
	public function __construct() {
		parent::__construct();
		$this -> _load_crud_data('image');
	}

    public function get_by_id($id) {
        return $this->get_one(array('id' => $id));
    }
	
}