<?php

#
#[15:45:51] Mihai Cristian Tanase: http://timmystudios.com/aggregator_api/get/themes/count/?user_id=7efa4b478965e6f0&lang=ro&filters=%7B%22category%22%3A8%7D
#[15:46:01] Mihai Cristian Tanase: http://timmystudios.com/aggregator_api/get/themes/search/0/30?user_id=7efa4b478965e6f0&lang=ro&filters=%7B%22category%22%3A8%7D
#[15:46:19] Mihai Cristian Tanase: http://timmystudios.com/aggregator_api/get/theme?user_id=7efa4b478965e6f0&lang=ro&id=4177
#[15:47:05] Mihai Cristian Tanase: http://timmystudios.com/aggregator_api/get/themes/count/?user_id=7efa4b478965e6f0&lang=ro&filters=%7B%22required_app%22%3A%5B54%5D%2C%22category%22%3A5%2C%22price%22%3A%5B1%5D%2C%22style%22%3A%5B13%2C12%5D%2C%22color%22%3A%5B1%2C5%2C8%5D%7D

require dirname(__FILE__) . '/../vendor/autoload.php';

class ApiTestMigration extends PHPUnit_Framework_TestCase {
        
        private static $urls = array();
        private static $domain, $filters;
        
        public static function setUpBeforeClass(){
                self::$domain = "http://dev0.androidmakeup.local/";
                
                self::$filters = array(
                    'category' => array(5),
                    'style' => array(13, 12),
                    'color' => array(1, 5, 8),
                    'price' => array(1, 2, 3, 4),
                    'required_app' => array(1, 3, 12, 15, 20)
                );
                
                self::$urls = array(
                    "themes/count/",
                    "themes/search/0/30?user_id=7efa4b478965e6f0&lang=ro&filters=%7B%22category%22%3A8%7D",
                    "theme?user_id=7efa4b478965e6f0&lang=ro&id=4177"
                );
        }
        
        private function getNewResponse($url, $params = array(), $filters = null) {
                return $this->getUrlResponse("aggregator_api_v2/get/{$url}", $params, $filters);
        }
        
        private function getOldResponse($url, $params = array(), $filters = null) {
                return $this->getUrlResponse("aggregator_api/get/{$url}", $params, $filters);
        }
        
        private function getUrlResponse($url, $params = array(), $filters = null) {
                if (isset($filters)) {
                        $params['filters'] = json_encode($filters);
                }
                
                if (empty($params['lang'])) {
                        $params['lang'] = 'en';
                }
                
                $url = self::$domain . $url . '?' . http_build_query($params);
                
                $time = time();
                if (preg_match("@http://[^/]+/([^/]+)/get@", $url, $m)) {
                        $controller_file = dirname(__FILE__) . '/../application/controllers/'.$m[1].'.php';
                        $time = filemtime($controller_file);
                }
                
                $cached_file = dirname(__FILE__) . '/../cache/api_test_' . md5($url);
                if (file_exists($cached_file) && filemtime($cached_file) > $time) {
                        $content = file_get_contents($cached_file);
                } else {
                        $content = file_get_contents($url);
                        file_put_contents($cached_file, $content);
                }
                
                return json_decode($content, true);
        }
        
        private function getResponse($url, $params = array(), $filters = null) {
                return array(
                    'new' => $this->getNewResponse($url, $params, $filters),
                    'old' => $this->getNewResponse($url, $params, $filters)
                );
        }
        
        public function testUserSettings() {
                $response = $this->getResponse('settings');
                
                foreach($response['old'] as $key => $value) {
                        self::assertArrayHasKey($key, $response['new']);
                        if ($key != 'popular') {
                                self::assertEquals($value, $response['new'][$key], "{$key} is not identical");
                        }
                }
        }
        
        public function testThemeCountAndFilters() {
                $filters_count = count(self::$filters);
                for ($i=1; $i<= $filters_count; $i++) {
                        $filter_keys = array_keys(self::$filters);
                        shuffle($filter_keys);
                        $filters = array();
                        
                        for($j=1; $j<= $i; $j++) {
                                $key = $filter_keys[$j-1];
                                $filters[$key] = self::$filters[$key];
                                shuffle($filters[$key]);
                                
                                $filters[$key] = array_slice($filters[$key], 0, rand(1, count($filters[$key])));
                        }
                
                        $response = $this->getResponse("themes/count/", array(), $filters);
                        
                        // teste themes count
                        self::assertEquals((int) $response['old'], (int) $response['new']);
                        
                        $response = $this->getResponse("themes/search", array(), $filters);
                        
                        self::assertEquals($response['old'], $response['new']);
                        
                        if ($response['new']['list_count'] > 1) {
                                $theme_id = $response['new']['list'][0]['id'];
                        }
                }
                
                if (isset($theme_id) && $theme_id) {
                        $response = $this->getResponse("theme", array("id" => $theme_id));
                        self::assertEquals($response['old'], $response['new']);
                }
        }
}