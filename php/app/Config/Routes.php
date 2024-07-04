<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// $routes->get('/', 'Home::index');

$routes->group('api', static function ($routes) {
    $routes->post('login', 'Login::id_password');
    $routes->post('login/google', 'Login::google');

    $routes->group('auth', static function ($routes) {
        $routes->get('check', 'Login::getUserProfile');
        $routes->get('recipes', 'Recipe::index');
        $routes->get('recipe/(:segment)', 'Recipe::show/$1');
        $routes->get('logout', 'Logout::logout');
    });
});
