<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateGroupJoinRequestsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'unsigned' => true,
                'auto_increment' => true
            ],
            'group_id' => [
                'type' => 'INT',
                'unsigned' => true,
            ],
            'user_id' => [
                'type' => 'INT',
                'unsigned' => true,
            ],
            'status' => [
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
        $this->forge->addForeignKey('group_id', 'groups', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('user_id', 'users', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('group_join_requests');
    }

    public function down()
    {
        $this->forge->dropTable('group_join_requests');
    }
}
