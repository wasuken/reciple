<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;
use Faker\Factory;

class RecipeSeeder extends Seeder
{
    public function run()
    {
        $data = [];
        $n = 30;
        $faker = Factory::create('ja_JP');

        //user id list
        $idList = [];
        $query = $this->db->query('select id from users;');
        $rst = $query->getResultArray();

        foreach($rst as $row) {
            $idList[] = $row['id'];
        }
        for($i = 0;$i < $n;$i++) {
            $data[] = [
                'user_id' => $idList[$faker->randomKey($idList)],
                'unique_string_id' => $faker->uuid(),
                'title' => $faker->realTextBetween(20, 40),
                'recipe_text' => $faker->realTextBetween(),
            ];
        }
        $this->db->table('recipes')->insertBatch($data);
    }
}
