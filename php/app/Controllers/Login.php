<?php

namespace App\Controllers;

class Login extends BaseController
{
    public function google()
    {
        $code = $this->request->getPost('code');

        $client = \Config\Services::curlrequest();
        $response = $client->post('https://oauth2.googleapis.com/token', [
            'form_params' => [
                'code' => $code,
                'client_id' => getenv('GOOGLE_CLIENT_ID'),
                'client_secret' => getenv('GOOGLE_CLIENT_SECRET'),
                'redirect_uri' => getenv('GOOGLE_CLIENT_REDIRECT'),
                'grant_type' => 'authorization_code',
            ]
        ]);

        $body = json_decode($response->getBody(), true);
        if (isset($body['access_token'])) {
            $userInfo = $this->getUserInfo($body['access_token']);
            $model = new \App\Models\LoginModel();
            $user = $model->findOrCreateUser($userInfo);

            $appAccessToken = $this->generateAppToken($user);

            return $this->response->setJSON(['access_token' => $appAccessToken]);
        } else {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'Unable to retrieve access token']);
        }
    }
    private function getUserInfo($accessToken)
    {
        $client = \Config\Services::curlrequest();
        $response = $client->get('https://www.googleapis.com/oauth2/v1/userinfo', [
            'headers' => [
                'Authorization' => 'Bearer ' . $accessToken
            ]
        ]);

        return json_decode($response->getBody(), true);
    }
}
