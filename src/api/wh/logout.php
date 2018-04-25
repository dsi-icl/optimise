<?php

    header('cache-control: no-cache,no-store,must-revalidate'); // HTTP 1.1.
    header('pragma: no-cache'); // HTTP 1.0.
    header('expires: 0'); // Proxies.
    session_start();
    $_SESSION = array();
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();
    echo '{"logged":"out"}';
    return;

?>