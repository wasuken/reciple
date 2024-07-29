<?php

namespace App\Models;

use CodeIgniter\Model;

class RecipeModel extends Model
{
    protected $table            = 'recipes';
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

    public function findJoinTagsImages($id)
    {
        $query = $this->db->query("
SELECT r.id, r.title, r.user_id, r.unique_string_id, r.recipe_text, r.created_at,
    (SELECT JSON_ARRAYAGG(image_path) FROM recipe_images ri WHERE ri.recipe_id = r.id) AS images,
    (SELECT JSON_ARRAYAGG(t.name) FROM recipe_tags rt JOIN tags t ON rt.tag_id = t.id WHERE rt.recipe_id = r.id) AS tags
FROM recipes r
where r.id = ?
", [$id]);
        $record = $query->getResultArray()[0];
        if(empty($record)) {
            return null;
        }
        $record['tags'] = $record['tags'] === null ? [] : json_decode($record['tags'], false);
        $record['images'] = $record['images'] === null ? [] : json_decode($record['images'], false);
        return $record;
    }

    /**
      クエリ、タグの入力状況にあわせて、
      SQL, parametersの数を調整していく
    */
    public function adjustQueryAndParameters($query, $tag)
    {
        $lquery = "%{$query}%";
        $whereStr = "";
        $params = [];
        $queryWhereStr = "
-- クエリ検索
WHERE title LIKE ? OR recipe_text LIKE ?
";
        $tagWhereStr = "
-- タグ検索
EXISTS (SELECT t2.name
from tags as t2
join recipe_tags as rt2 on rt2.tag_id = t2.id and rt2.recipe_id = r.id
where t2.name = ?)";
        // log_message('debug', "adjust: " . empty($tag . $query));
        if(empty($tag . $query)) {
            // 両方空白の場合
            $whereStr = "";
            $params = [];
        } elseif(empty($tag)) {
            // tagのみ空白の場合
            $whereStr = $queryWhereStr;
            $params = [$lquery, $lquery];
        } elseif(empty($query)) {
            // queryのみ空白の場合
            $whereStr = "WHERE ".$tagWhereStr;
            $params = [$tag];
        } else {
            $whereStr = $queryWhereStr . " AND ".$tagWhereStr;
            $params = [$lquery, $lquery, $tag];
        }
        return [$whereStr, $params];
    }
    /**
      レシピ情報にレシピ画像、レシピタグ、タグテーブルを結合した結果を配列で返却する。
      @param int $page
      $param int $pageSize
      @return mixied ($records, totalPages)
    */
    public function list($page = 1, $pageSize = 10, $query = '', $tag = '')
    {
        // ページ番号とページサイズのバリデーション
        $page = max(1, (int)$page);
        $pageSize = max(10, (int)$pageSize);

        // OFFSETの計算
        $offset = ($page - 1) * $pageSize;

        $adjParams = $this->adjustQueryAndParameters($query, $tag);
        log_message('error', var_export($adjParams, true));
        $whereStr = $adjParams[0];
        $totalParams = $adjParams[1];
        $params = [...$totalParams, $pageSize, $offset];
        // 全レコード数を取得するクエリ
        $totalCountQuery = $this
            ->db
            ->query("
SELECT COUNT(*) AS total
FROM recipes as r
{$whereStr}", $totalParams);
        $totalCountResult = $totalCountQuery->getRow();
        $totalCount = (int)$totalCountResult->total;

        // トータルページ数の計算
        $totalPages = ceil($totalCount / $pageSize);

        $query = $this->db->query("
SELECT r.id, r.title, r.unique_string_id, r.recipe_text, r.created_at,
(SELECT u.name from users as u where r.user_id = u.id) as user_name,
    (SELECT JSON_ARRAYAGG(image_path) FROM recipe_images ri WHERE ri.recipe_id = r.id) AS images,
    (SELECT JSON_ARRAYAGG(t.name) FROM recipe_tags rt JOIN tags t ON rt.tag_id = t.id WHERE rt.recipe_id = r.id) AS tags
FROM recipes r
{$whereStr}
ORDER BY r.created_at desc
LIMIT ? OFFSET ?;
", $params);
        $records = $query->getResultArray();
        foreach($records as $k => $v) {
            $records[$k]['tags'] = $v['tags'] === null ? [] : json_decode($v['tags'], false);
            $records[$k]['images'] = $v['images'] === null ? [] : json_decode($v['images'], false);
        }
        return [$records, $totalPages];
    }

    /**
      images,tagsをふくんだデータの挿入処理
      unique_string_id はこの関数内で生成するため、$data内部に存在する場合は上書きされる
      @param $data mixed
    */
    public function insertJoinTagsImages($data)
    {
        $this->db->transBegin();
        try {
            // recipe
            $this->insert([
                'title' => $data['title'],
                'recipe_text' => $data['recipe_text'],
                'user_id' => $data['user_id'],
                'unique_string_id' => uniqid('', true),
            ]);
            $recipeId = $this->getInsertID();
            log_message('info', var_export($recipeId, true));
            // tags
            if(!empty($data['tags'])) {
                $tagidList = [];
                $tagModel = new TagModel();
                $tagParams = [];
                // タグIDの取得(なければ作成)
                foreach($data['tags'] as $tag) {
                    $tagId = $tagModel->findOrCreate(['name' => $tag], []);
                    $tagParams[] = [
                        'recipe_id' => $recipeId,
                        'tag_id' => $tagId,
                    ];
                }
                $recipeTagModel = new RecipeTagModel();
                $recipeTagModel->insertBatch($tagParams);
            }

            // images
            if(!empty($data['images'])) {
                $images = $data['images'];
                $imageParams = [];
                $cnt = count($images);
                for($i = 0; $i < $cnt; $i++) {
                    $image = $images[$i];
                    $imageParams[] = [
                        'recipe_id' => $recipeId,
                        'image_path' => $image,
                        'display_order' => $i,
                    ];
                }
                $imageModel = new RecipeImageModel();
                $imageModel->insertBatch($imageParams);
            }

            $this->db->transCommit();
        } catch(\Exception $e) {
            $this->db->transRollback();
            log_message('error', $e->getMessage());
            throw $e;
        }
    }
}
