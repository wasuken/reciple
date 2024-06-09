<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateChatsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'unsigned' => true,
                'auto_increment' => true
            ],
            'sender_user_id' => [
                'type' => 'INT',
                'unsigned' => true,
            ],
            'receiver_user_id' => [
                'type' => 'INT',
                'unsigned' => true,
            ],
            'chat_text' => [
                'type' => 'TEXT',
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
        $this->forge->addForeignKey('sender_user_id', 'users', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('receiver_user_id', 'users', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('chats');
    }

    public function down()
    {
        $this->forge->dropTable('chats');
    }
}
