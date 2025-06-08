<?php

return [
    /*
     * Paths to apply CORS. 'api/*' covers all API routes.
     */
    'paths' => ['api/*'],

    /*
     * Allowed HTTP methods. '*' allows all methods (GET, POST, etc.).
     */
    'allowed_methods' => ['*'],

    /*
     * Allowed origins. Include your frontend URL(s).
     * Update 'http://localhost:5173' to your production frontend URL (e.g., 'https://yourdomain.com').
     */
    'allowed_origins' => [
        'http://localhost:5173', // Local dev
        'https://DonsCustomClothiers.com',
    ],

    /*
     * Patterns for dynamic origins (e.g., subdomains). Leave empty unless needed.
     */
    'allowed_origins_patterns' => [],

    /*
     * Allowed headers. '*' allows all headers (Authorization, Content-Type, etc.).
     */
    'allowed_headers' => ['*'],

    /*
     * Headers exposed to the client. Usually empty unless specific headers are needed.
     */
    'exposed_headers' => [],

    /*
     * Cache duration for CORS preflight requests (in seconds). 0 disables caching.
     */
    'max_age' => 0,

    /*
     * Allow credentials (cookies, auth headers). Set to true if your API needs credentials.
     */
    'supports_credentials' => false,
];
