<?php

namespace App\Controllers;

use App\Models\RecipeModel;

class Recipe extends BaseController
{
    private $model;
    public function initController(\CodeIgniter\HTTP\RequestInterface $request, \CodeIgniter\HTTP\ResponseInterface $response, \Psr\Log\LoggerInterface $logger)
    {
        parent::initController($request, $response, $logger);
        $this->model = new RecipeModel();
    }
    /**
      レシピ一覧(画像、タグ付き)を返却する
      POST
      TODO 検索機能
     */
    public function index()
    {
        $page = $this->request->getGet('page') ?? 1;
        $pageSize = $this->request->getGet('pageSize') ?? 10;
        $data = [
            'page' => $page,
            'pageSize' => $pageSize,
        ];
        $rules = [
            'page' => 'permit_empty|numeric',
            'pageSize' => 'permit_empty|numeric'
        ];
        if(!$this->validateData($data, $rules)) {
            return $this->response->setStatusCode(400)->setJSON($this->validator->getErrors());
        }
        $result  = $this->model->list($page, $pageSize);
        $recipeList = $result[0];
        $totalPages = $result[1];
        return $this->response->setJSON([
            'recipeList'  => $recipeList,
            'totalPages' => $totalPages,
        ]);
    }
    /**
      レシピ情報返却。
      GET
     */
    public function show($id = null)
    {
        if($id === null) {
            return $this
                ->response
                ->setStatusCode(400)
                ->setJSON(['message' => 'id is null.']);
        }
        $this->model = new RecipeModel();
        $recipe = $this->model->find($id);
        return $this->response->setJSON($recipe);
    }
    /**
      レシピ作成
      POST
     */
    public function create()
    {
        $user_id = $this->request->getPost('user_id');
        $title = $this->request->getPost('title');
        $recipe_text = $this->request->getPost('recipe_text');
        $data = [
            'user_id' => $user_id,
            'title' => $title,
            'recipe_text' => $recipe_text,
        ];
        $rules = [
            'user_id' => 'required|is_not_unique[users.id]',
            'title' => 'required|min_length[1]',
            'recipe_text' => 'required|min_length[1]',
        ];
        if(!$this->validateData($data, $rules)) {
            return $this->response->setStatusCode(400)->setJSON($this->validator->getErrors());
        }
        try {
            $this->model->insert($data);
            return $this->response->setJSON(['message' => '登録成功']);
        } catch(\Exception $e) {
            log_message('error', $e->getMessage());
            return $this->response->setStatusCode(400)->setJSON([
                'message' => 'データ登録エラー。'
            ]);
        }
    }
}
