<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class Logout extends BaseController
{
    public function logout()
    {
        helper('cookie');
        delete_cookie('auth_token');
        return $this
            ->response
            ->setJSON(['message' => "success logout"]);
    }
}
