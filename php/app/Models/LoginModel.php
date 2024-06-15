<?php

namespace App\Models;

use CodeIgniter\Model;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class LoginModel extends Model
{
    protected $table            = 'logins';
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

    protected $userTable            = 'users';

    public function findUserOrCreate($provider, $providerId, $userName, $userEmail)
    {
        $db = \Config\Database::connect();
        $builder = $db->table($this->table);

        // Check if the user already exists
        $builder->where('provider', $provider);
        $builder->where('provider_id', $providerId);
        $login = $builder->get()->getRow();

        if ($login) {
            // User exists, return user information
            $userBuilder = $db->table($this->userTable);
            $userBuilder->where('id', $login->user_id);
            $user = $userBuilder->get()->getRow();
        } else {
            // User does not exist, create a new user
            $userBuilder = $db->table($this->userTable);
            $newUserData = [
                'name' => $userName,
                'email' => $userEmail,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ];

            $userBuilder->insert($newUserData);
            $newUserId = $db->insertID();

            // Create a new login entry
            $newLoginData = [
                'user_id' => $newUserId,
                'provider' => $provider,
                'provider_id' => $providerId,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ];

            $builder->insert($newLoginData);

            // Retrieve the new user information
            $user = (object) $newUserData;
            $user->id = $newUserId;
        }

        // Generate JWT token
        $key = getenv('JWT_SECRET_KEY');
        $iss = getenv('JWT_SECRET_ISSUER');
        $aud = getenv('JWT_SECRET_AUDIENCE');
        $payload = [
            'iss' => $iss,
            'aud' => $aud,
            'iat' => time(),
            'nbf' => time(),
            'exp' => time() + 3600,
            'sub' => $user->id,
            'name' => $user->name,
        ];

        $jwt = JWT::encode($payload, $key, 'HS256');

        // Set JWT token as HTTP-only cookie
        setcookie('access_token', $jwt, time() + 3600, '/', '', false, true);

        return $user;
    }
}
