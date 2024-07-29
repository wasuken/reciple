<?php

namespace Tests\Support\Database\Seeds;

use CodeIgniter\Database\Seeder;

class RecipeCommentsModelTestSeeder extends Seeder
{
    private function user()
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

    private function recipe()
    {
        $this->db->transBegin();
        try {
            //user id list
            $idList = [];
            $query = $this->db->query('select id from users;');
            $rst = $query->getResultArray();

            $n = 3;
            foreach($rst as $row) {
                $idList[] = $row['id'];
            }
            for($i = 0;$i < $n;$i++) {
                $data[] = [
                    'id' => $i + 1,
                    'user_id' => uniqid('', true),
                    'unique_string_id' => uniqid('', true),
                    'title' => 'test'.$i + 1,
                    'recipe_text' => 'test'.$i + 1,
                ];
            }
            $this->db->table('recipes')->insertBatch($data);
            $this->db->table('recipe_comments')->insert([
                'user_id' => 1,
                'recipe_id' => 1,
                'comment_text' => 'test',
                'rating' => 5,
            ]);
            $this->db->transCommit();
        } catch(\Exception $e) {
            $this->db->transRollback();
        }
    }
    /**
      とにかくid=1がなければ挿入、あれば例外ではじかれるのでそのままにぎりつぶす
    */
    public function run(): void
    {
        $this->user();

    }
}
