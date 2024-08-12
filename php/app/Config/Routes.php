<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// $routes->get('/', 'Home::index');

$routes->group('api', static function ($routes) {
    // 静的ファイルのルートを追加
    $routes->add('uploads/stored/(:any)', function ($file) {
        $path = WRITEPATH . 'uploads/stored/' . $file;

        if (file_exists($path)) {
            // ファイルのMIMEタイプを取得
            $mimeType = mime_content_type($path);
            header("Content-Type: $mimeType");
            readfile($path);
            exit;
        } else {
            throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
        }
    });

    $routes->post('login', 'Login::id_password');
    $routes->post('login/google', 'Login::google');

    $routes->group('auth', static function ($routes) {
        $routes->get('check', 'Login::getUserProfile');
        $routes->get('tags', 'Tag::index');
        $routes->get('recipes', 'Recipe::index');
        $routes->get('recipe/(:segment)', 'Recipe::show/$1');
        $routes->post('recipe', 'Recipe::create');
        $routes->post('recipe/image', 'Recipe::uploadImage');

        $routes->get('recipe/(:segment)/comments', 'RecipeComment::index/$1');
        $routes->post('comment', 'RecipeComment::create');
        $routes->post('comment/(:segment)', 'RecipeComment::update/$1');
        $routes->delete('comment/(:segment)', 'RecipeComment::delete/$1');

        $routes->get('logout', 'Logout::logout');
    });
});
