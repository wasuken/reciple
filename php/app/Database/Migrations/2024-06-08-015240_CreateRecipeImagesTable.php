<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateRecipeImagesTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'unsigned' => true,
                'auto_increment' => true
            ],
            'recipe_id' => [
                'type' => 'INT',
                'unsigned' => true,
            ],
            'display_order' => [
                'type' => 'INT',
            ],
            'image_path' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('recipe_id', 'recipes', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('recipe_images');
    }

    public function down()
    {
        $this->forge->dropTable('recipe_images');
    }
}
