<?php

namespace Tests\Feature;

use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\FeatureTestTrait;

class RecipeTest extends CIUnitTestCase
{
    use FeatureTestTrait;
    protected function setUp(): void
    {
        parent::setUp();
    }
    public function testGetIndex()
    {
        $result = $this->call('GET', '/api/auth/recipes');

        $result->assertStatus(200);
    }
}
