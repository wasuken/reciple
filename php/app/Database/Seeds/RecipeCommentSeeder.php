<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;
use Faker\Factory;

class RecipeCommentSeeder extends Seeder
{
    public function run()
    {
        $data = [];
        $n = 30;
        $faker = Factory::create('ja_JP');

        //user id list
        $userIdList = [];
        $query = $this->db->query('select id from users;');
        $rst = $query->getResultArray();

        foreach($rst as $row) {
            $userIdList[] = $row['id'];
        }
        $recipeIdList = [];
        $query = $this->db->query('select id from recipes;');
        $rst = $query->getResultArray();

        foreach($rst as $row) {
            $recipeIdList[] = $row['id'];
        }
        for($i = 0;$i < $n;$i++) {
            $recipeId = $recipeIdList[$faker->randomKey($recipeIdList)];
            $userId = $userIdList[$faker->randomKey($userIdList)];
            $data[] = [
                'recipe_id' => $recipeId,
                'user_id' => $userId,
                'comment_text' => $faker->realText(),
                'rating' => $faker->numberBetween(1, 5),
            ];
        }
        $this->db->table('recipe_comments')->insertBatch($data);
    }
}
