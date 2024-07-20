<?php

namespace Tests\Support\Database\Seeds;

use CodeIgniter\Database\Seeder;

class RecipeModelTestSeeder extends Seeder
{
    /**
      とにかくid=1がなければ挿入、あれば例外ではじかれるのでそのままにぎりつぶす
    */
    public function run(): void
    {
        $this->db->transBegin();
        try {
            $factories = [
                [
                    'id' => 1,
                    'name' => 'test',
                    'email' => 'example@example.com',
                ],
            ];

            $builder = $this->db->table('users');

            foreach ($factories as $factory) {
                $builder->insert($factory);
            }
            $this->db->transCommit();
        } catch(\Exception $e) {
            $this->db->transRollback();
        }

    }
}
