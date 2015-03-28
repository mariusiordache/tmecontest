<?php
class story_collection extends kms_item_collection {
	
	public function __construct() {
		parent::__construct();
		$this -> _load_crud_data('story');
	}

    public function get_by_id($id) {
        return $this->get_one(array('id' => $id));
        $this->story_collection->get_by_id($story['id']);
    }

    public function save($data, $id = 0, $action = null) {
        $story = parent::save($data, $id, $action);
        $story = $this->story_collection->get_by_id($story['id']);
        return $story;


    }
	
}