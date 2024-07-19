<?php

namespace App\Models;

use CodeIgniter\Model;

class TagModel extends Model
{
    protected $table            = 'tags';
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
     * タグレコードを抽出しつつ、存在しない場合は作成する。
     *
     * @param array $criteria $this->whereメソッドにわたすため、条件の連想配列を想定 ['col' => 1]
     * @param array $data 作成する場合のパラメタ。$criteriaとmergeして作成する
     * @return int 作成、またはみつかったIDの一覧を返却
     */
    public function findOrCreate(array $criteria, array $data)
    {
        // トランザクションの開始
        $this->db->transBegin();

        try {
            $record = $this->where($criteria)->first();

            if ($record) {
                $id = $record[$this->primaryKey];
            } else {
                $this->insert(array_merge($criteria, $data));
                $id = $this->getInsertID();
            }

            $this->db->transCommit();

            return $id;
        } catch (\Exception $e) {
            $this->db->transRollback();
            throw $e;
        }
    }
}
