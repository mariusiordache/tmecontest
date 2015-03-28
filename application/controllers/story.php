<?php
require_once('main_controller.php');
 class story extends main_controller {
     
        public function edit($hash) {
            $this -> assets -> add_js('//code.jquery.com/jquery-2.1.3.min.js',false);
            $this -> assets -> add_js('//code.jquery.com/ui/1.11.4/jquery-ui.min.js',false);
            $this -> assets -> add_js('//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.2/underscore-min.js',false);
            $this -> assets -> add_js('//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js',false);
            $this -> assets -> add_js('//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js',false);
            $this -> assets -> add_css('//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css',false);
            $this -> assets -> add_js('//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.2/raphael-min.js',false);
            
            $this -> assets -> add_js('js/storyteller.js', false);
            $this -> assets -> add_js('js/canvaswidget.js', false);
            $this -> assets -> add_css('css/storyteller.css', false);
            
            $this -> set_template('web/story.tpl');
            $this -> show_page();
        }
     
     
 }