<?php

namespace App\Controllers;
use Google_Client;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

use App\Models\LoginModel;

class Login extends BaseController
{
    public function google()
    {
        $code = $this->request->getPost('code');

        $client = new Google_Client();
        $client->setClientId(getenv('GOOGLE_CLIENT_ID'));
        $client->setClientSecret(getenv('GOOGLE_CLIENT_SECRET'));
        $client->setRedirectUri(getenv('GOOGLE_CLIENT_REDIRECT_URI'));
        $client->setScopes(['profile', 'email']);

        // 認証コードチェック
        $token = $client->fetchAccessTokenWithAuthCode($code);
        // log_message('error', var_export([$token, $code], true));

        if (isset($token['access_token'])) {
            $client->setAccessToken($token['access_token']);
            $userInfo = $this->getGoogleUserInfo($client);

            // ユーザー情報を元にアプリケーション内でのユーザーを特定または登録
            $model = new LoginModel();
            $user = $model->findUserOrCreate('google', $userInfo->id, $userInfo->name, $userInfo->email);

            // JWTトークンを生成
            $jwt = $this->generateJwtToken($user->id);

            // CookieにJWTトークンを設定
            $cookie = [
                'name'     => 'auth_token',
                'value'    => $jwt,
                'expire'   => time() + 3600, // 1時間の有効期限
                'secure'   => false,  // 開発時
                'httponly' => true,
            ];
            $this->response->setCookie($cookie);

            return $this->response->setJSON(['message' => 'Authenticated successfully']);
        } else {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'Unable to retrieve access token']);
        }
    }
    private function getGoogleUserInfo(Google_Client $client)
    {
        $oauth2 = new \Google_Service_Oauth2($client);
        return $oauth2->userinfo->get();
    }
    // TODO LoginModelの処理とあわせてhelperクラスにまとめる
    private function generateJwtToken($userId)
    {
        $key = getenv('JWT_SECRET_KEY');
        $payload = [
            'iss' => getenv('JWT_SECRET_ISSUER'),
            'aud' => getenv('JWT_SECRET_AUDIENCE'),
            'iat' => time(),
            'nbf' => time(),
            'exp' => time() + 3600, // トークンの有効期限を1時間とする
            'sub' => $userId,
        ];

        return \Firebase\JWT\JWT::encode($payload, $key, 'HS256');
    }
}
