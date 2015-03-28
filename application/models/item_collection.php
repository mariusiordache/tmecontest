<?php
class item_collection extends kms_item_collection {
	
	public function __construct() {
		parent::__construct();
		$this -> _load_crud_data('item');
        $this->load->model('image_collection');
	}

    public function get_by_id($id) {
        return $this->get_one(array('id' => $id));
    }

    public function save($data, $id = 0, $action = null) {
        $item = parent::save($data, $id, $action);
        $item = $this->get_by_id($item['id']);

        if (isset($data['images'])) {
            foreach ((array)$data['images'] as $image) {
                $image_data = [
                    'item_id' => $item['id'],
                    'path' => $image['path'],
                    'is_selected' => $image['is_selected']
                ];
                $this->image_collection->save($image_data);
            }
        }
        return $item;
    }


}