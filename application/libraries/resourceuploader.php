<?php

class resourceuploader {
    
    protected $finalFiles = array();
    
    protected function extract_archive($path) {
        $file_extension = pathinfo($path, PATHINFO_EXTENSION);
        
        if (!in_array($file_extension, array('zip'))) {
            return false;
        }
        
        $CI = get_instance();
        $CI->load->library('filemanagement');
        $CI->load->model('upload_user_settings_collection');
        
        if (!$CI->upload_user_settings_collection->getSettingsValue('autounpack')) {
            return false;
        }
        
        $extract_location = dirname($path) . '/' . substr(md5(time() . $path), 0, 10);
        mkdir($extract_location, 0755, true);
        
        switch($file_extension) {
            case 'zip':
                if (!$CI->filemanagement->extract_zip($path, $extract_location)) {
                    return false;
                }
        }
        
        $Directory = new RecursiveDirectoryIterator($extract_location, RecursiveDirectoryIterator::SKIP_DOTS);
        $Iterator = new RecursiveIteratorIterator($Directory);

        foreach($Iterator as $file) {
            $this->addFile((string) $file);
        }
        
        return true;
    }
    
    protected function addFile($path) {
        $CI = get_instance();
        
        $file = new stdClass();
        $file->path = $path;
        $file->name = basename($path);
        $file->size = getFileSize(filesize($path));
        
        $file_extension = pathinfo($path, PATHINFO_EXTENSION);
        
        $name = str_replace(".9.png", "", $file->name);
        $name = trim(str_replace($file_extension, "", $name), "._-");
        $name = preg_replace("@[^a-z0-9_]@", "_", $name);
        $name = preg_replace("@(_+)@", "_", $name);
        $name = trim($name, "_");

        if (exif_imagetype($path)) {
            $file->url = str_replace($CI->config->item('webroot_path'), $CI->config->item('base_url'), $file->path);
        }
        
        $file->identifier = $name;
        
        $this->finalFiles[] = $file;
    }
    
    public function upload($resource_id) {
        $this->finalFiles = array();
        
        $CI = get_instance();
        
        $tmp_dir = $CI->config->item('webroot_path') . '/tmp/resource' . $resource_id . '/';
        
        if (!is_dir($tmp_dir)) {
            mkdir($tmp_dir, 0777, true);
        }
        
        $CI->load->library('UploadHandler', array('options' => array(
                'overwrite_upload_dir' => $tmp_dir
        ), 'initialize' => false, 'error_messages' => null));
        
        $upload_result = $CI->uploadhandler->post(false);

        foreach ($upload_result['files'] as $file) {
            
            if (!$this->extract_archive($file->path)) {
                $this->addFile($file->path);
            }
            
        }

        $CI->uploadhandler->generate_response(array('files' => $this->finalFiles), true);
    }
}