<?php

namespace App\Controllers;

use App\Models\RecipeCommentModel;

/**
  レシピへのコメント関連のAPIメソッドを実装する
 */
class RecipeComment extends BaseController
{
    private $model;
        protected $session;

    public function __construct()
    {
        $this->session = \Config\Services::session();
    }
    public function initController(
        \CodeIgniter\HTTP\RequestInterface $request,
        \CodeIgniter\HTTP\ResponseInterface $response,
        \Psr\Log\LoggerInterface $logger
    ) {
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
            'recipe_id' => 'required|is_not_unique[recipes.id]'
        ];
        $data = [
            'recipe_id' => $id,
        ];
        if(!$this->validateData($data, $rules)) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON($this->validator->getErrors());
        }
        // model->list
        $list = $this->model->where('recipe_id', $id)->findAll();
        // response
        return $this->response->setJSON($list);
    }
    /**
      記事に対するコメントを投稿する
     */
    public function create()
    {
        // validate
        $rules = [
            'user_id' => 'required|is_not_unique[users.id]',
            'recipe_id' => 'required|is_not_unique[recipes.id]',
            'comment_text' => 'required|min_length[1]|max_length[200]',
            'rating' => 'required|integer|in_list[0,1,2,3,4,5]',
        ];
        $data = $this->request->getJSON(true);
        $authUser = $this->session->get('authUser');
        $data = [...$data, 'user_id' => $authUser['sub']];
        if(!$this->validateData($data, $rules)) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON($this->validator->getErrors());
        }
        // model->create($validated_date)
        $this->model->insert($data);
        // response
        return $this->response->setJSON(['message' => 'success']);
    }
    /**
      記事に対するコメントを削除する
      @todo コメント投稿主、記事作者のみ利用可能
    */
    public function delete($id = null)
    {
        // validate
        $rules = [
            'recipe_comment_id' => 'required|is_not_unique[recipe_comments.id]'
        ];
        $data = [
            'recipe_comment_id' => $id,
        ];
        if(!$this->validateData($data, $rules)) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON($this->validator->getErrors());
        }
        // model->list
        $list = $this->model->delete($id);
        // response
        return $this->response->setJSON(['message' => 'success']);
    }
    /**
      記事に対するコメントを更新する
      コメント投稿主のみ利用可能
    */
    public function update($id = null)
    {
        // validate
        $rules = [
            'id' => 'required|is_not_unique[recipe_comments.id]',
            'recipe_id' => 'required|is_not_unique[recipes.id]',
            'user_id' => 'required|is_not_unique[users.id]',
            'comment_text' => 'required|min_length[1]|max_length[200]',
            'rating' => 'required|integer|in_list[0,1,2,3,4,5]',
        ];
        $data = $this->requet->getJSON(true);
        $authUser = $this->session->get('authUser');
        $data = [...$data, 'user_id' => $authUser['sub']];
        if(!$this->validateData($data, $rules)) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON($this->validator->getErrors());
        }
        // model->update($validated_date)
        $this->model->update($id, $data);
        // response
        return $this->response->setJSON(['message' => 'success']);
    }
}
