<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// $routes->get('/', 'Home::index');

$routes->group('api', static function ($routes) {
    $routes->post('login', 'Login::id_password');
    $routes->post('login/google', 'Login::google');
    $routes->get('login/check', 'Login::getUserProfile');
});

