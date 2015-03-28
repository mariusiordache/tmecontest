<?php
require_once('main_controller.php');

class story extends main_controller
{

    public function new_story()
    {
        $this->assets->add_css('//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css', false);
        $this->assets->add_css('css/storyteller.css', false);

        $this->set_template('web/new_story.tpl');
        $this->show_page();
    }

    public function new_story_submit()
    {
        $this->load->model('story_collection');

        $data = $this->input->post();

        try {
            if (empty($data['name']) ) {
                throw new Exception("A name please!");
            }

            $story = array('name' => $data['name']);


            $story = $this->story_collection->save($story);

            if ($story['id']) {
                redirect('/story/edit/' . $story['hash']);;
            }
        } catch (Exception $ex) {
            $this->show_ajax(array(
                'error' => $ex->getMessage()
            ));
        }
    }


    public function edit($hash)
    {
        $this->assets->add_js('//code.jquery.com/jquery-2.1.3.min.js', false);
        $this->assets->add_js('//code.jquery.com/ui/1.11.4/jquery-ui.min.js', false);
        $this->assets->add_js('//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.2/underscore-min.js', false);
        $this->assets->add_js('//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js', false);
        $this->assets->add_js('//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js', false);
        $this->assets->add_css('//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css', false);
        $this->assets->add_js('//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.2/raphael-min.js', false);
        $this->assets->add_js('//crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/md5.js', false);
        $this->assets->add_js('html2canvas-0.5.0-alpha1/dist/html2canvas.js', false);
        $this->assets->add_js('js/raphael.export.js', false);
        $this->assets->add_js('js/canvg.js', false);

        $this->assets->add_js('js/storyteller.js', false);
        $this->assets->add_js('js/canvaswidget.js', false);
        $this->assets->add_css('css/storyteller.css', false);

        $this -> set_template_var('story_id', $hash);
        
        $this->set_template('web/story.tpl');
        $this->show_page();
    }


}