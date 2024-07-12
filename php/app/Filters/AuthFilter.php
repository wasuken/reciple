<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Config\Services;

class AuthFilter implements FilterInterface
{
    /**
     * Do whatever processing this filter needs to do.
     * By default it should not return anything during
     * normal execution. However, when an abnormal state
     * is found, it should return an instance of
     * CodeIgniter\HTTP\Response. If it does, script
     * execution will end and that Response will be
     * sent back to the client, allowing for error pages,
     * redirects, etc.
     *
     * @param RequestInterface $request
     * @param array|null       $arguments
     *
     * @return RequestInterface|ResponseInterface|string|void
     */
    public function before(RequestInterface $request, $arguments = null)
    {
        $authToken = $request->getCookie('auth_token');
        if (!$authToken) {
            return Services::response()
                ->setJSON(['error' => 'Filter: JWT token not found'])
                ->setStatusCode(400);
        }

        try {
            $decodedJWT = JWT::decode($authToken, new Key(getenv('JWT_SECRET_KEY'), 'HS256'));
            $request->setGlobal('authUser', (array) $decodedJWT);
        } catch(\Exception $e) {
            log_message('error', $e->getMessage());
            // 期限切の可能性もあるので、削除する。
            setcookie('auth_token', '', time() - 3600, '/');
            return Services::response()
                ->setJSON(['error' => 'Filter: Invalid JWT token'])
                ->setStatusCode(400);
        }
    }

    /**
     * Allows After filters to inspect and modify the response
     * object as needed. This method does not allow any way
     * to stop execution of other after filters, short of
     * throwing an Exception or Error.
     *
     * @param RequestInterface  $request
     * @param ResponseInterface $response
     * @param array|null        $arguments
     *
     * @return ResponseInterface|void
     */
    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
    }
}
