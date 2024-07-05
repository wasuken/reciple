<?php

namespace App\Controllers;

use App\Models\RecipeModel;

class Recipe extends BaseController
{
    /**
      レシピ一覧(画像、タグ付き)を返却する
      TODO 検索機能
      TODO ページング機能
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
        if(!$this->validateData($data, $rules)){
            return $this->response->setStatusCode(400)->setJSON($this->validator->getErrors());
        }
        $model = new RecipeModel();
        $result  = $model->list($page, $pageSize);
        $recipeList = $result[0];
        $totalPages = $result[1];
        return $this->response->setJSON([
            'recipeList'  => $recipeList,
            'totalPages' => $totalPages,
        ]);
    }
    /**
      レシピ情報返却。
     */
    public function show($id = null)
    {
        if($id === null) {
            return $this
                ->response
                ->setStatusCode(400)
                ->setJSON(['message' => 'id is null.']);
        }
        $model = new RecipeModel();
        $recipe = $model->find($id);
        return $this->response->setJSON($recipe);
    }
}
