<?php
class slide_collection extends kms_item_collection {
	
	public function __construct() {
		parent::__construct();
		$this -> _load_crud_data('slide');
        $this->load->model('item_collection');
	}

    public function get_by_id($id) {
        return $this->get_one(array('id' => $id));
    }

    public function save($data, $id = 0, $action = null) {
        $slide = parent::save($data, $id, $action);
        $slide = $this->slide_collection->get_by_id($slide['id']);

        if (isset($data['items'])){
            foreach ((array)$data['items'] as $item) {
                $item_data = [
                    'slide_id' => $slide['id'],
                    'type' => $item['type'],
                    'images' => $item['images']
                ];
                $this->item_collection->save($item_data);
            }
        }
        return $slide;
    }
	
}