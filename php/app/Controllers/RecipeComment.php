<?php

namespace App\Controllers;

/**
  レシピへのコメント関連のAPIメソッドを実装する
 */
class RecipeComment  extends BaseController{
    public function initController(
        \CodeIgniter\HTTP\RequestInterface $request,
        \CodeIgniter\HTTP\ResponseInterface $response,
        \Psr\Log\LoggerInterface $logger
    )
    {
        parent::initController($request, $response, $logger);
        $this->model = new RecipeCommentModel();
    }
    /**
      記事に対するコメントの一覧を返却する
     */
    public function index($id = null)
    {
        // validate
        $rules = [
            'id' => 'required|is_not_unique[recipes.id]'
        ];
        // model->list
        // response
    }
    /**
      記事に対するコメントを投稿する
     */
    public function create($id = null)
    {
        // validate
        // model->create($validated_date)
        // response
    }
    /**
      記事に対するコメントを削除する
      コメント投稿主、記事作者のみ利用可能
    */
    public function delete($recipe_id = null, $comment_id = null)
    {
        // validate
        // model->delete
        // response
    }
        /**
      記事に対するコメントを更新する
      コメント投稿主のみ利用可能
    */
    public function update($recipe_id = null, $comment_id = null)
    {
        // validate
        // model->update($validated_date)
        // response
    }
}
