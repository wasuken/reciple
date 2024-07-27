<?php

namespace App\Controllers;

use App\Models\RecipeModel;

class Recipe extends BaseController
{
    private $model;
    protected $session;

    public function __construct()
    {
        $this->session = \Config\Services::session();
    }
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
        $query = $this->request->getGet('query') ?? '';
        $tag = $this->request->getGet('tag') ?? '';

        $data = [
            'page' => $page,
            'pageSize' => $pageSize,
            'query' => $query,
            'tag' => $tag,
        ];
        $rules = [
            'page' => 'permit_empty|numeric',
            'pageSize' => 'permit_empty|numeric',
            'query' => 'permit_empty|min_length[2]|max_length[100]',
            'tag' => 'permit_empty|is_not_unique[tags.name]',
        ];
        if(!$this->validateData($data, $rules)) {
            return $this->response->setStatusCode(400)->setJSON($this->validator->getErrors());
        }
        $result  = $this->model->list($page, $pageSize, $query, $tag);
        // log_message('debug', var_export($result, true));
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
        $recipe = $this->model->findJoinTagsImages($id);
        return $this->response->setJSON($recipe);
    }
    // 画像アップロードエンドポイント
    public function uploadImage()
    {
        // getFileして$dataにいれると、アップロードされたファイルを検証してくれない
        $data = [];
        $rules = [
            'file' => 'uploaded[file]'
                . '|is_image[file]'
                . '|mime_in[file,image/jpg,image/jpeg,image/gif,image/png,image/webp]'
                . '|max_size[file,2048]',
        ];
        if(!$this->validateData($data, $rules)) {
            return $this->response->setStatusCode(400)->setJSON($this->validator->getErrors());
        }

        $img = $this->request->getFile('file');
        if (!$img->hasMoved()) {
            $filepath = WRITEPATH . 'uploads/' . $img->store('stored');
            return $this
                ->response
                ->setJSON(['imageUrl' => base_url('uploads/stored/' . $img->getName())]);
        }

        return $this->fail('The file has already been moved.');
    }
    /**
      レシピ作成
      POST
     */
    public function create()
    {
        $authUser = $this->session->get('authUser');

        // log_message('error', var_export($authUser, true));
        if (!$authUser) {
            return $this
                ->response
                ->setStatusCode(401)
                ->setJSON(['message' => 'Unauthorized']);
        }
        $data = $this->request->getJSON(true);
        $user_id = $authUser['sub'];
        $title = $this->request->getPost('title');
        $recipe_text = $this->request->getPost('recipe_text');
        if (!$data) {
            return $this
                ->response
                ->setStatusCode(400)
                ->setJSON(['message' => 'Invalid data.']);
        }

        $recipeData = [
            'title' => $data['title'],
            'recipe_text' => $data['recipe_text'],
            'images' => $data['images'],
            'tags' => $data['tags'],
            'user_id' => $user_id,
        ];
        // log_message('error', var_export($recipeData, true));
        $rules = [
            'user_id' => 'required|is_not_unique[users.id]',
            'title' => 'required|min_length[1]',
            'recipe_text' => 'required|min_length[1]',
            'images' => 'is_array',
            'images.*' => 'permit_empty|valid_url',
            'tags' => 'is_array',
            'tags.*' => 'permit_empty|max_length[50]',
        ];
        if(!$this->validateData($recipeData, $rules)) {
            log_message('error', var_export($this->validator->getErrors(), true));
            return $this
                ->response->setStatusCode(400)
                ->setJSON($this->validator->getErrors());
        }
        try {
            $recipeData = [
                'title' => $data['title'],
                'recipe_text' => $data['recipe_text'],
                'images' => $data['images'],
                'tags' => $data['tags'],
                'user_id' => $user_id,
            ];
            $this->model->insertJoinTagsImages($recipeData);
            return $this->response->setJSON(['message' => '登録成功']);
        } catch(\Exception $e) {
            log_message('error', $e->getMessage());
            return $this->response->setStatusCode(400)->setJSON([
                'message' => 'データ登録エラー。'
            ]);
        }
    }
}
