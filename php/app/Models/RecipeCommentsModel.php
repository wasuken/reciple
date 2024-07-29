<?php

namespace App\Models;

use CodeIgniter\Model;

class RecipeCommentsModel extends Model
{
    protected $table            = 'recipe_comments';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = false;
    protected $allowedFields    = [];

    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    protected array $casts = [];
    protected array $castHandlers = [];

    // Dates
    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      = [];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = [];
    protected $afterInsert    = [];
    protected $beforeUpdate   = [];
    protected $afterUpdate    = [];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = [];
    protected $afterDelete    = [];

    /**
      特定のレシピ($id)のコメント一覧を返却する
     */
    public function list($id)
    {
        throw new \Exception('implemented yet');
    }
    /**
      特定のレシピ($id)のコメント($data)を登録する
    */
    public function create($id, $data)
    {
        throw new \Exception('implemented yet');
    }
    /**
      recipe_id, comment_idと一致するレコードを削除する
    */
    public function delete($recipe_id, $comment_id)
    {
        throw new \Exception('implemented yet');
    }
    /**
      recipe_id, comment_idと一致するレコードを$dataで更新する
    */
    public function update($recipe_id, $comment_id, $data)
    {
        throw new \Exception('implemented yet');
    }
}
