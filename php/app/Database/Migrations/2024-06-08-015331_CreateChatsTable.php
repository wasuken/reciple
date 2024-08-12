<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;
use CodeIgniter\Database\RawSql;

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
                'default' => new RawSql('CURRENT_TIMESTAMP'),
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'default' => new RawSql('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
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
