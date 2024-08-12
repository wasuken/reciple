<?php

namespace App\Controllers;

use App\Models\TagModel;

class Tag extends BaseController
{
    private $model;
    public function initController(\CodeIgniter\HTTP\RequestInterface $request, \CodeIgniter\HTTP\ResponseInterface $response, \Psr\Log\LoggerInterface $logger)
    {
        parent::initController($request, $response, $logger);
        $this->model = new TagModel();
    }
    public function index()
    {
        return $this->response->setJSON($this->model->select('name')->findAll());
    }
}
