<?php

namespace Tests\Support\Models;

use CodeIgniter\Test\CIUnitTestCase;
use App\Models\RecipeCommentsModel;
use CodeIgniter\Test\DatabaseTestTrait;

class RecipeCommentsModelTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $refresh = true;
    protected $seed = 'Tests\Support\Database\Seeds\RecipeCommentsModelTestSeeder';

    protected $model;

    public function setUp(): void
    {
        parent::setUp();
        $this->model = new RecipeCommentsModel();
    }
    public function testList()
    {
        $rst = $this->model->list(1);
    }
    public function testCreate()
    {
        $uuidText = uniqid('____testetestest___');
        $data = [
            'comment_text' => $uuidText,
            'rating' => 4,
        ];
        $rst = $this->model->create(1, $data);
        $this->seeInDatabase('recipe_comments', ['comment_text' => $uuidText]);
    }
    public function testDelete()
    {
        $rst = $this->model->delete(1, 1);
        $this->dontSeeInDatabase('recipe_comments', ['comment_text' => $uuidText]);
    }
    public function testUpdate()
    {
        $uuidText = uniqid('update_text');
        $this->dontSeeInDatabase('recipe_comments', ['comment_text' => $uuidText]);
        $data = [
            'comment_text' => $uuidText,
            'rating' => 1,
        ];
        $rst = $this->model->updateRecipeComment(1, 1, $data);
        $this->seeInDatabase('recipe_comments', ['comment_text' => $uuidText]);
    }

}
