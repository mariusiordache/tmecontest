<?php

class UserAppTypeCountDecorator extends kms_collection_decorator {

    protected function getCollection() {
        
    }

    protected function getDataKey() {
        return "type_id";
    }

    protected function getDecoratorData() {
        $count = get_instance()->user_app_resource_collection->get($this->filters, null, null, null, array(
            'group_by' => 'type_id',
            'fields' => 'type_id, COUNT(*) as count'
        ));
        
        return kms_array_to_html_options($count, 'type_id', 'count');
    }
}
