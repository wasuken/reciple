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
        $model = new RecipeModel();
        $recipeList = $model->list();
        return $this->response->setJSON($recipeList);
    }
}
