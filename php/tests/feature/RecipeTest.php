<?php

namespace Tests\Feature;

use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\FeatureTestTrait;
use CodeIgniter\Test\DatabaseTestTrait;

class RecipeTest extends CIUnitTestCase
{
    use FeatureTestTrait;
    use DatabaseTestTrait;
    protected function setUp(): void
    {
        parent::setUp();
        $this->seed('App\Database\Seeds\UserSeeder');
        // $this->seed('App\Database\Seeds\RecipeSeeder');
    }
    protected function tearDown(): void
    {
        parent::tearDown();
        $this->db->table('users')->delete('1=1');
    }
    public function testGetIndex()
    {
        $result = $this->call('GET', '/api/auth/recipes');

        $result->assertStatus(200);
    }
    public function testCreateRecipe()
    {
        //user_idの準備
        $records = $this->db->query('select id from users;')->getResultArray();
        $id = $records[0]['id'];
        $postData = [
            'user_id' => $id,
            'title' => 'test',
            'recipe_text' => 'test',
            'images' => [],
            'tags' => [],
        ];
        $this->withSession([
            'authUser' => [
                'sub' => $id,
            ]
        ]);
        $result = $this
            ->withBody(json_encode($postData))
            ->call('POST', '/api/auth/recipe');

        $result->assertStatus(200);
    }
}
