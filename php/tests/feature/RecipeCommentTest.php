<?php

namespace Tests\Feature;

use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\FeatureTestTrait;
use CodeIgniter\Test\DatabaseTestTrait;

class RecipeCommentTest extends CIUnitTestCase
{
    use FeatureTestTrait;
    use DatabaseTestTrait;

    protected $refresh = true;
    protected $seed = 'Tests\Support\Database\Seeds\RecipeCommentsModelTestSeeder';

    protected function setUp(): void
    {
        parent::setUp();
        // ここで追加のセットアップが必要な場合は記述
        $rst = $this->db->query('select * from recipes where id = 1')->getResultArray();
        if(count($rst) <= 0) {
            $this->db->query("
insert into recipes(id, user_id, unique_string_id, title, recipe_text)
values(1, 1, '1111', 'test', 'body');
");
        }
    }

    protected function tearDown(): void
    {
        parent::tearDown();
        // ここでクリーンアップ処理が必要な場合は記述
    }

    public function testGetIndex()
    {

        $recipeId = 1;
        $result = $this->withSession([
            'authUser' => [
                'sub' => 1,
            ]
        ])
            ->get("/api/auth/recipe/{$recipeId}/comments");

        $result->assertStatus(200);
    }

    public function testPostCreate()
    {
        $postData = [
            'recipe_id' => 1,
            'user_id' => 1,
            'comment_text' => 'This is a test comment.',
            'rating' => 5,
        ];

        $result = $this->withSession([
            'authUser' => [
                'sub' => 1,
            ]
        ])
            ->withBody(json_encode($postData))
            ->post('/api/auth/comment');

        $result->assertStatus(200);
    }
}
