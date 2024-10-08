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
    (SELECT JSON_ARRAYAGG(t.name) FROM recipe_tags rt JOIN tags t ON rt.tag_id = t.id WHERE rt.recipe_id = r.id) AS tags,
    (SELECT COUNT(*) FROM recipe_comments rc where rc.recipe_id = r.id) as comment_count,
    (SELECT JSON_ARRAYAGG(JSON_OBJECT('user_id', rc.user_id, 'comment_id', rc.id, 'comment_text', rc.comment_text, 'rating', rc.rating, 'user_name', (
SELECT name FROM users as u WHERE u.id = rc.user_id
))) FROM recipe_comments as rc WHERE rc.recipe_id = r.id) as comments
FROM recipes r
where r.id = ?
", [$id]);
        $record = $query->getResultArray()[0];
        if(empty($record)) {
            return null;
        }
        $record['tags'] = $record['tags'] === null ? [] : json_decode($record['tags'], false);
        $record['images'] = $record['images'] === null ? [] : json_decode($record['images'], false);
        $record['comments'] = $record['comments'] === null ? [] : json_decode($record['comments'], false);
        return $record;
    }

    /**
      クエリ、タグの入力状況にあわせて、
      SQL, parametersの数を調整していく
    */
    public function adjustQueryAndParameters($query, $tag, $minRating)
    {
        $lquery = "%{$query}%";
        $whereStr = "";
        $params = [];
        $queryWhereStr = "
-- クエリフィルタ
(title LIKE ? OR recipe_text LIKE ?)
";
        $tagWhereStr = "
-- タグフィルタ
EXISTS (SELECT t2.name
from tags as t2
join recipe_tags as rt2 on rt2.tag_id = t2.id and rt2.recipe_id = r.id
where t2.name = ?)";
        $ratingWhereStr = "
-- Ratingフィルタ
EXISTS (SELECT AVG(rc2.rating) AS rating
FROM recipe_comments AS rc2
WHERE rc2.recipe_id = r.id
HAVING rating >= ?)
";
        // log_message('debug', "adjust: " . empty($tag . $query));
        if(empty($tag . $query . $minRating)) {
            // 全部空白の場合
            $whereStr = "";
            $params = [];
        } else {
            $params = [];
            $arr = [];
            if(!empty($tag)) {
                $arr[] = $tagWhereStr;
                $params[] = $tag;
            }
            if(!empty($query)) {
                $arr[] = $queryWhereStr;
                $params[] = $lquery;
                $params[] = $lquery;
            }
            if(!empty($minRating)) {
                $arr[] = $ratingWhereStr;
                $params[] = $minRating;
            }
            $whereStr = 'WHERE' . implode(' AND ', $arr);
        }
        return [$whereStr, $params];
    }
    /**
      レシピ情報にレシピ画像、レシピタグ、タグテーブルを結合した結果を配列で返却する。
      @param int $page
      $param int $pageSize
      @return mixied ($records, totalPages)
    */
    public function list($page = 1, $pageSize = 10, $query = '', $tag = '', $minRating = 0)
    {
        // ページ番号とページサイズのバリデーション
        $page = max(1, (int)$page);
        $pageSize = max(10, (int)$pageSize);

        // OFFSETの計算
        $offset = ($page - 1) * $pageSize;

        $adjParams = $this->adjustQueryAndParameters($query, $tag, $minRating);
        log_message('error', var_export($adjParams, true));
        $whereStr = $adjParams[0];
        $totalParams = $adjParams[1];
        $params = [...$totalParams, $pageSize, $offset];
        $totalSQL = "
SELECT
COUNT(*) AS total
FROM recipes as r
{$whereStr}";
        log_message('error', var_export([$totalSQL, $totalParams], true));
        // 全レコード数を取得するクエリ
        $totalCountQuery = $this
            ->db
            ->query($totalSQL, $totalParams);
        $totalCountResult = $totalCountQuery->getRow();
        $totalCount = (int)$totalCountResult->total;

        // トータルページ数の計算
        $totalPages = ceil($totalCount / $pageSize);

        $sql = "
SELECT r.id, r.title, r.unique_string_id, r.recipe_text, r.created_at,
(SELECT u.name from users AS u WHERE r.user_id = u.id) AS user_name,
    (SELECT JSON_ARRAYAGG(image_path) FROM recipe_images ri WHERE ri.recipe_id = r.id) AS images,
    (SELECT JSON_ARRAYAGG(t.name) FROM recipe_tags rt JOIN tags t ON rt.tag_id = t.id WHERE rt.recipe_id = r.id) AS tags,
    (SELECT COUNT(*) FROM recipe_comments AS rc WHERE rc.recipe_id = r.id) AS comment_count,
(SELECT AVG(rc2.rating) AS rating FROM recipe_comments AS rc2 WHERE rc2.recipe_id = r.id) AS avg_rating
FROM recipes AS r
{$whereStr}
ORDER BY r.created_at desc
LIMIT ? OFFSET ?;
";
        log_message('error', var_export([$sql, $params], true));
        $query = $this->db->query($sql, $params);
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
