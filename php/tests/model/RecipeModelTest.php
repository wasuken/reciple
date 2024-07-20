<?php

namespace Tests\Support\Models;

use CodeIgniter\Test\CIUnitTestCase;
use App\Models\RecipeModel;
use CodeIgniter\Test\DatabaseTestTrait;

class RecipeModelTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $refresh = true;
    protected $seed = 'Tests\Support\Database\Seeds\RecipeModelTestSeeder';

    protected $model;

    protected function setUp(): void
    {
        parent::setUp();
        $this->model = new RecipeModel();
    }

    public function testInsertJoinTagsImages()
    {
        $data = [
            'title' => 'test1',
            'recipe_text' => 'test1',
            'user_id' => 1,
            'tags' => [
                'aaa', 'bbb', 'ccc',
            ],
            'images' => [
                'https://example.com/images/1.png',
                'https://example.com/images/2.png',
                'https://example.com/images/3.png',
            ]
        ];

        $this->model->insertJoinTagsImages($data);
        $db = db_connect();
        // var_dump($db->query('select * from tags')->getResultArray());
        // var_dump($db->query('select * from recipes')->getResultArray());
        // var_dump($db->query('select * from recipe_images')->getResultArray());
        // var_dump($db->query('select * from recipe_tags')->getResultArray());

        foreach($data['tags'] as $tag) {
            $this->seeInDatabase('tags', ['name' => $tag]);
        }
        foreach($data['images'] as $image) {
            $this->seeInDatabase('recipe_images', ['image_path' => $image]);
        }
    }
}
