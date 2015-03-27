<?php

class ResourceItemsDecorator extends kms_collection_decorator {

    protected function getCollection() {
        
    }

    protected function getDataKey() {
        
    }

    protected function decorate() {
        $CI = get_instance();
        $CI->load->model('resource_type_collection');
        
        $types = kms_assoc_by_field($CI->resource_type_collection->get());

        if ($this->list instanceOf kms_item) {
            $this->list->info['type'] = $types[$this->list->info['item_type_id']]['name'];
        } else if (is_array($this->list)) {
            foreach ($this->list as &$item) {
                //var_dump($item); die;
                $item['type'] = $types[$item['item_type_id']]['name'];

                $item['last_updated'] = getTimeSince($item['last_updated']);

                if ($item['type'] == 'file') {
                    $item['filesize'] = getFileSize($item['filesize']);
                    $item['ext'] = str_replace($item['item'], '', $item['value']);
                }
            }
        }
    }

}
