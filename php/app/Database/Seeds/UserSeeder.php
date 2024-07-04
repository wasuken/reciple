<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;
use Faker\Factory;

class UserSeeder extends Seeder
{
    public function run()
    {
        $data = [];
        $n = 10;
        $faker = Factory::create('ja_JP');
        for($i = 0;$i < $n;$i++) {
            $data[] = [
                'name' => $faker->name(),
                'email' => $faker->freeEmail(),
            ];
        }
        $this->db->table('users')->insertBatch($data);
    }
}
