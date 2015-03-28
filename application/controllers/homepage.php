<?php

include('main_controller.php');

class homepage extends main_controller {
    /* main_controller loads library bootstrap.php that does most of the initializations */

    public function __construct()
    {
        parent::__construct();

        $this->load->model('story_collection');
        $this->load->model('slide_collection');
    }

    public function index() {
        redirect('/user/login');
        
        $this->set_template('web/index.tpl');
        $this->show_page();
    }

    public function test() {

        $story = $this->story_collection->save(array(
            'name' => 'test'
        ));

        $story = $this->story_collection->get_by_id($story['id']);

        $this->slide_collection->save(array(
            'story_id' => $story['id'],
            'paragraph' => 'test123'
        ));


        $slide = $this->slide_collection->save(array(
            'story_id' => $story['id'],
            'paragraph' => 'test123',
            'items' => [
                array(
                    'type' => 'location',
                    'images' => [
                        array(
                            'path' => 'path_1_1',
                            'is_selected' => 1
                        ),
                        array(
                            'path' => 'path_1_2',
                            'is_selected' => 0
                        ),
                        array(
                            'path' => 'path_1_3',
                            'is_selected' => 0
                        )
                    ]
                ),
                array(
                    'type' => 'location',
                    'images' => [
                        array(
                            'path' => 'path_2_1',
                            'is_selected' => 0
                        ),
                        array(
                            'path' => 'path_2_2',
                            'is_selected' => 1
                        ),
                        array(
                            'path' => 'path_2_3',
                            'is_selected' => 0
                        )
                    ]
                ),
                array(
                    'type' => 'object',
                    'images' => [
                        array(
                            'path' => 'path_3_1',
                            'is_selected' => 0
                        ),
                        array(
                            'path' => 'path_3_2',
                            'is_selected' => 1
                        ),
                        array(
                            'path' => 'path_3_3',
                            'is_selected' => 0
                        )
                    ]
                )
            ]
        ));

        $this->set_template('web/test.tpl');
        $this->show_page();

    }


}