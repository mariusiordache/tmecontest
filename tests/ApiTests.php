<?php

#
#[15:45:51] Mihai Cristian Tanase: http://timmystudios.com/aggregator_api/get/themes/count/?user_id=7efa4b478965e6f0&lang=ro&filters=%7B%22category%22%3A8%7D
#[15:46:01] Mihai Cristian Tanase: http://timmystudios.com/aggregator_api/get/themes/search/0/30?user_id=7efa4b478965e6f0&lang=ro&filters=%7B%22category%22%3A8%7D
#[15:46:19] Mihai Cristian Tanase: http://timmystudios.com/aggregator_api/get/theme?user_id=7efa4b478965e6f0&lang=ro&id=4177
#[15:47:05] Mihai Cristian Tanase: http://timmystudios.com/aggregator_api/get/themes/count/?user_id=7efa4b478965e6f0&lang=ro&filters=%7B%22required_app%22%3A%5B54%5D%2C%22category%22%3A5%2C%22price%22%3A%5B1%5D%2C%22style%22%3A%5B13%2C12%5D%2C%22color%22%3A%5B1%2C5%2C8%5D%7D

require_once dirname(__FILE__) . '/../vendor/autoload.php';
require_once 'AbstractUnitTest.php';
require_once dirname(__FILE__) . '/../application/libraries/mcrypt.php';
require_once dirname(__FILE__) . '/../application/helpers/apikeys_helper.php';

class ApiTests extends AbstractUnitTest {

    private static $urls = array();
    private static $domain, $filters;
    private static $requestkey = array();

    const PACKAGE_NAME = 'com.tmestudios.timmy';

    public static function setUpBeforeClass() {

        $config_file_path = __DIR__ . '/../config.yml';

        if (!file_exists($config_file_path)) {
            throw new Exception("There is no config file config.yml in base folder");
        }
        // fixed bug where php version was prior 5.3 and didn't support namespaces

        $yaml = new Symfony\Component\Yaml\Parser();
        $config = $yaml->parse(file_get_contents($config_file_path));

        self::$domain = trim($config['config']['base_url'], '/') . "/aggregator_api/get/";

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

        // get one crypt key
        if (empty($GLOBALS['android_api_keys'][self::PACKAGE_NAME])) {
            die('Bad android apy keys for package ' . self::PACKAGE_NAME);
        }

        self::$requestkey['verc'] = current(array_keys($GLOBALS['android_api_keys'][self::PACKAGE_NAME]));
        self::$requestkey['vern'] = current(array_keys($GLOBALS['android_api_keys'][self::PACKAGE_NAME][self::$requestkey['verc']]));
        self::$requestkey['key'] = $GLOBALS['android_api_keys'][self::PACKAGE_NAME][self::$requestkey['verc']][self::$requestkey['vern']];
    }

    private function getResponse($url, $params = array(), $filters = null) {

        if (isset($filters)) {
            $params['filters'] = json_encode($filters);
        }

        if (empty($params['lang'])) {
            $params['lang'] = 'en';
        }

        $url = self::$domain . $url;

        $crypt = new mcrypt();

        $params = json_encode($params);
        $code = $crypt->encrypt(self::$requestkey['key'], $params);

        $post = array(
            'verc' => self::$requestkey['verc'],
            'vern' => self::$requestkey['vern'],
            'data' => $code
        );

        $postdata['data'] = json_encode($post);

        if (0) {
            // i wanted initially to cache the result and only re-download it when controller changed.
            $time = time();
            if (preg_match("@http://[^/]+/([^/]+)/get@", $url, $m)) {
                $controller_file = dirname(__FILE__) . '/../application/controllers/' . $m[1] . '.php';
                $time = filemtime($controller_file);
            }

            $cached_file = dirname(__FILE__) . '/../cache/api_test_' . md5($url);
            if (file_exists($cached_file) && filemtime($cached_file) > $time) {
                $content = file_get_contents($cached_file);
            } else {
                $content = file_get_contents($url);
                file_put_contents($cached_file, $content);
            }
        } else {

            $ch = curl_init();

            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postdata));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $content = curl_exec($ch);

            curl_close($ch);
        }

        $resp = json_decode($content, true);

        $this->assertEquals(JSON_ERROR_NONE, json_last_error(), "Invalid JSON at url {$url}!\n{$content}");

        return $resp;
    }

    public function testUserSettings() {
        $response = $this->getResponse('settings');
        
        $this->assertArrayHasKey('filters', $response);
        $this->assertArrayHasKey('categories', $response);
        $this->assertArrayHasKey('required_app', $response);
        $this->assertArrayHasKey('popular', $response);
        $this->assertArrayHasKey('top_banners', $response);

        foreach ($response['filters'] as $filter) {
            $this->assertArrayHasKey('id', $filter);
            $this->assertArrayHasKey('label', $filter);
            $this->assertArrayHasKey('filter_options', $filter);

            foreach ($filter['filter_options'] as $option) {
                $this->assertArrayHasKey('id', $option);
                $this->assertArrayHasKey('label', $option);
            }
        }
    }

    public function testThemeFields() {
        $offset = rand(2, 10);
        $limit = rand(1, 5);

        $response = $this->getResponse("themes/search/{$offset}/{$limit}");
        $this->assertArrayHasKey('list', $response);

        foreach ($response['list'] as $item) {
            $this->assertArrayHasKey('id', $item);
            $this->assertTrue(is_int($item['id']));

            $theme = $this->getResponse("theme", array('id' => $item['id']));

            $this->assertArrayHasKey('id', $theme);
            $this->assertTrue(is_int($theme['id']));

            $this->assertArrayHasKey('review_count', $theme);
            $this->assertTrue(is_int($theme['review_count']));

            $this->assertArrayHasKey('reviews', $theme);
            $this->assertTrue(is_array($theme['reviews']));

            $this->assertArrayHasKey('description', $theme);
            $this->assertTrue(is_string($theme['description']));

            $this->assertArrayHasKey('screenshots', $theme);
            $this->assertTrue(is_array($theme['screenshots']));

            $this->assertArrayHasKey('name', $theme);
            $this->assertTrue(is_string($theme['name']));

            $this->assertArrayHasKey('market_url', $theme);
            $this->assertTrue(is_string($theme['market_url']));

            $this->assertArrayHasKey('rating', $theme);
            $this->assertTrue(is_numeric($theme['rating']));

            $this->assertArrayHasKey('image', $theme);
            $this->assertTrue(is_string($theme['image']));

            $this->assertArrayHasKey('required_apps', $theme);
            $this->assertTrue(is_array($theme['required_apps']));

            $this->assertArrayHasKey('subtitle', $theme);
            $this->assertTrue(is_string($theme['subtitle']));
        }
    }

    public function testThemesCountByFilters() {
        $filters_count = count(self::$filters);
        for ($i = 1; $i <= $filters_count; $i++) {
            $filter_keys = array_keys(self::$filters);
            shuffle($filter_keys);
            $filters = array();

            for ($j = 1; $j <= $i; $j++) {
                $key = $filter_keys[$j - 1];
                $filters[$key] = self::$filters[$key];
                shuffle($filters[$key]);

                $filters[$key] = array_slice($filters[$key], 0, rand(1, count($filters[$key])));
            }

            $debug = "?filters=" . urlencode(json_encode($filters));
            $count = $this->getResponse("themes/count", array(), $filters);

            $this->assertRegExp('/[0-9\.]+k?/i', "{$count}", "{$debug}");

            $limit = rand(5, 20);

            $response = $this->getResponse("themes/search/0/{$limit}", array(), $filters);

            $this->assertArrayHasKey('list', $response);
            $this->assertArrayHasKey('list_count', $response);

            $list_count = $response['list_count'];
            $limit = $list_count < $limit ? $list_count : $limit;

            $this->assertEquals($limit, count($response['list']));
        }
    }

    public function testThemesWithNoDS() {
        $limit = rand(2, 6);
        $response = $this->getResponse("themes/search/0/{$limit}");

        foreach ($response['list'] as $item) {
            $this->assertTrue(is_int($item['id']), "{$item['id']} is not integer");
            $this->assertTrue(is_string($item['image']), "image must be a string when no ds is specified");

            // check same thing for a theme request
            $theme = $this->getResponse("theme", array('id' => $item['id']));
            $this->assertArrayHasKey('screenshots', $theme, "A theme must have screenshots");

            foreach ($theme['screenshots'] as $image) {
                $this->assertTrue(is_string($image), "screenshots must be an array of strings when no ds is specified");
            }
        }
    }

    /**
     * Check if when we set a ds ( device size ) we get an array of images
     */
    public function testThemesWithDS() {
        // first generate an array of rezolutions
        $ds = array();
        for ($i = 1; $i <= rand(2, 4); $i++) {
            $ds[] = rand($i * 100, $i * 200);
        }

        $limit = rand(2, 6);
        $response = $this->getResponse("themes/search/0/{$limit}", array('ds' => json_encode($ds)));
        foreach ($response['list'] as $item) {
            $this->assertTrue(is_array($item['image']), "Image must be an array of images when specifying ds");

            $images = $item['image'];

            foreach ($images as $i => $image) {
                $this->assertEquals($ds[$i], $image['width'], "Image order must be the same");
                $this->assertTrue(!empty($image['url']) && is_string($image['url']), "Image url must be specified");
            }

            // check same thing for a theme request
            $theme = $this->getResponse("theme", array('ds' => json_encode($ds), 'id' => $item['id']));
            $this->assertArrayHasKey('screenshots', $theme, "A theme must have screenshots");

            foreach ($theme['screenshots'] as $images) {
                $this->assertTrue(is_array($images), "Screenshots must be an array of images array when specifying ds");
                foreach ($images as $i => $image) {
                    $this->assertEquals($ds[$i], $image['width'], "Image order must be the same");
                }
            }
        }
    }

}
