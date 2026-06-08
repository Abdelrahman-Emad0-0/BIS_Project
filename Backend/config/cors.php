<?php

return [

    /*
     * Which routes CORS applies to.
     * api/* covers every endpoint. sanctum/csrf-cookie is needed for cookie-based auth.
     */
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    /*
     * Allowed origins are read from the FRONTEND_URL env variable so you
     * never need to touch this file when deploying to a new environment.
     *
     * Local dev:   FRONTEND_URL=http://localhost:3000
     * Production:  FRONTEND_URL=https://your-app.vercel.app
     *
     * Multiple origins (comma-separated) are supported — see below.
     */
    'allowed_origins' => array_filter(
        array_map(
            'trim',
            explode(',', env('FRONTEND_URL', 'http://localhost:3000'))
        )
    ),

    /*
     * Wildcard pattern matching for origins.
     * Covers all Vercel preview deployments automatically (*.vercel.app).
     */
    'allowed_origins_patterns' => [
        '#^https://.*\.vercel\.app$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 86400,

    /*
     * Must be false when using token-based auth (Sanctum bearer tokens).
     * Only set to true if you switch to cookie-based sessions.
     */
    'supports_credentials' => false,

];
